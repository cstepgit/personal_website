import { OpenAI } from "openai";
import { NextResponse, type NextRequest } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

// Get the OpenAI API key from environment variables
const openaiApiKey = process.env.OPENAI_API_KEY;

// Initialize OpenAI client with server-side API key if available
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

// Initialize Supabase client if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Flag to determine if Supabase integration should be used
const useSupabase = !!(supabaseUrl && supabaseServiceKey);

// Only create Supabase client if environment variables are available
const supabase = useSupabase
  ? createClient<Database>(supabaseUrl as string, supabaseServiceKey as string)
  : null;

async function loadSystemContext() {
  try {
    const publicDir = path.join(process.cwd(), "public");
    const systemMessagePath = path.join(
      publicDir,
      "model_context",
      "systemMessage.txt"
    );
    const resumePath = path.join(publicDir, "model_context", "resume.txt");

    const [systemMessage, resume] = await Promise.all([
      fs.readFile(systemMessagePath, "utf-8"),
      fs.readFile(resumePath, "utf-8"),
    ]);

    // Append resume to the system message
    const systemContext = `${systemMessage.trim()}\n\nResume:\n\n${resume.trim()}`;
    return systemContext;
  } catch (error) {
    console.error("Error loading system context:", error);
    throw new Error("Failed to load system context");
  }
}

// Store chat query in Supabase if available
async function storeChatQuery(
  query: string,
  response: string,
  request: NextRequest
) {
  // Skip if Supabase integration is not available
  if (!useSupabase || !supabase) {
    console.log(
      "Skipping Supabase storage: Supabase integration not configured"
    );
    return;
  }

  try {
    console.log("Attempting to store chat query in Supabase...");

    // Extract user agent and IP information
    const userAgent = request.headers.get("user-agent") || "Unknown";
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "Unknown";

    console.log("Query data:", {
      query: query.substring(0, 50) + (query.length > 50 ? "..." : ""),
      response: response.substring(0, 50) + (response.length > 50 ? "..." : ""),
      timestamp: new Date().toISOString(),
      user_agent:
        userAgent.substring(0, 50) + (userAgent.length > 50 ? "..." : ""),
      ip_address: ip,
    });

    const { data, error } = await supabase
      .from("chatbotquerries")
      .insert({
        query,
        response,
        timestamp: new Date().toISOString(),
        user_agent: userAgent,
        ip_address: ip,
      })
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
    } else {
      console.log("Successfully stored chat query in Supabase:", data);
    }
  } catch (err) {
    console.error("Failed to store chat query:", err);
    // Don't throw the error to prevent API failure
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify OpenAI client is configured
    if (!openai) {
      console.error("OpenAI API key not configured or invalid");
      return NextResponse.json(
        {
          error:
            "OpenAI API key not configured or invalid. Please add OPENAI_API_KEY to your environment variables.",
          choices: [
            {
              message: {
                content:
                  "Sorry, the AI service is not properly configured. Please contact the site administrator.",
              },
            },
          ],
        },
        { status: 200 } // Return 200 to avoid breaking the UI
      );
    }

    // Load system context
    const systemContext = await loadSystemContext();

    // Parse the request body
    const body = await request.json();
    const { messages } = body;

    if (!messages) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    // Get the user's last message (query)
    const userMessages = messages.filter(
      (msg: ChatMessage) => msg.role === "user"
    );
    const userQuery =
      userMessages.length > 0
        ? userMessages[userMessages.length - 1].content
        : "No query found";

    try {
      // Create chat completion with system context
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemContext,
          },
          ...messages.filter((msg: ChatMessage) => msg.role !== "system"),
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      // Get the assistant's response
      const assistantResponse = completion.choices[0].message.content || "";

      // Store the query and response in Supabase if available
      await storeChatQuery(userQuery, assistantResponse, request);

      // Return the response
      return NextResponse.json(completion);
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError);

      // Check if it's a model-related error
      const errorMessage =
        openaiError instanceof Error ? openaiError.message : "Unknown error";

      if (errorMessage.includes("gpt-4o-mini")) {
        // Try with a fallback model
        try {
          console.log("Trying fallback model gpt-3.5-turbo...");
          const fallbackCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: systemContext,
              },
              ...messages.filter((msg: ChatMessage) => msg.role !== "system"),
            ],
            temperature: 0.7,
            max_tokens: 500,
          });

          // Get the assistant's response
          const assistantResponse =
            fallbackCompletion.choices[0].message.content || "";

          // Store the query and response in Supabase if available
          await storeChatQuery(userQuery, assistantResponse, request);

          // Return the response
          return NextResponse.json(fallbackCompletion);
        } catch (fallbackError) {
          console.error("Fallback model error:", fallbackError);
          throw openaiError; // Throw the original error
        }
      } else {
        throw openaiError;
      }
    }
  } catch (error) {
    console.error("API error:", error);

    // Try to store the error in Supabase if possible
    if (useSupabase) {
      try {
        const body = await request.json().catch(() => ({ messages: [] }));
        const messages = body.messages || [];
        const userMessages = messages.filter(
          (msg: ChatMessage) => msg.role === "user"
        );
        const userQuery =
          userMessages.length > 0
            ? userMessages[userMessages.length - 1].content
            : "No query found";

        const errorMessage =
          error instanceof Error
            ? error.message
            : "An error occurred while processing your request";

        await storeChatQuery(userQuery, `Error: ${errorMessage}`, request);
      } catch (storeError) {
        console.error("Failed to store error in Supabase:", storeError);
      }
    }

    // Return a user-friendly error response
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while processing your request",
        choices: [
          {
            message: {
              content:
                "I'm sorry, I encountered an error processing your request. Please try again later.",
            },
          },
        ],
      },
      { status: 200 } // Return 200 to avoid breaking the UI
    );
  }
}
