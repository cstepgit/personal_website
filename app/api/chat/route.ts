import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

// Initialize OpenAI client with server-side API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

export async function POST(request: Request) {
  try {
    // Verify API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
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

    // Return the response
    return NextResponse.json(completion);
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while processing your request",
      },
      { status: 500 }
    );
  }
}
