"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

export function ChatBot() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Function to scroll chat to bottom without affecting page scroll
  const scrollToBottom = () => {
    if (messagesEndRef.current && chatContainerRef.current && isExpanded) {
      // Use scrollIntoView with a block: "nearest" to prevent page scrolling
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  // Handle initial question submission
  const handleInitialSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Expand and process the question
    setIsExpanded(true);

    // Use setTimeout to ensure state updates before processing
    setTimeout(() => {
      handleSubmitQuestion(input.trim());

      // Focus the input in the expanded chat after a delay
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 300);
    }, 100);
  };

  // Process a question and get a response
  const handleSubmitQuestion = async (question: string) => {
    if (isLoading) return;

    setInput("");
    setIsLoading(true);

    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: question,
      timestamp: Date.now(),
    };

    setMessages((prev) => {
      const newMessages = [...prev, newUserMessage];
      // Schedule scroll after state update
      setTimeout(scrollToBottom, 100);
      return newMessages;
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.response || data.answer || data.message,
        timestamp: Date.now(),
      };

      setMessages((prev) => {
        const newMessages = [...prev, assistantMessage];
        // Schedule scroll after state update
        setTimeout(scrollToBottom, 100);
        return newMessages;
      });
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          "Sorry, gemma3 isn't running right now. Compute time is expensive! Cashapp me @ $CooperStepanian to help me pay for my server bills 😃",
        timestamp: Date.now(),
      };

      setMessages((prev) => {
        const newMessages = [...prev, errorMessage];
        // Schedule scroll after state update
        setTimeout(scrollToBottom, 100);
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle expanded chat form submission
  const handleExpandedSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    handleSubmitQuestion(input.trim());
  };

  // Custom input style to remove focus ring
  const inputStyle =
    "focus-visible:ring-0 focus-visible:ring-offset-0 border-zinc-300 dark:border-zinc-700";

  return (
    <section className="space-y-4 w-full">
      <div className="flex items-center gap-2">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight flex items-center gap-2">
          Ask about my experience
        </h2>
        {isExpanded && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={() => setIsExpanded(false)}
          >
            Close Chat
          </Button>
        )}
      </div>

      {!isExpanded ? (
        <div className="space-y-2">
          <form onSubmit={handleInitialSubmit} className="flex gap-2">
            <Input
              placeholder="Ask me anything about my experience..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={cn("flex-1", inputStyle)}
            />
            <Button type="submit" disabled={!input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-xs text-center text-muted-foreground">
            Powered By Gemma
          </p>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="border rounded-lg">
              <CardContent className="p-4 space-y-4">
                <div
                  ref={chatContainerRef}
                  className="space-y-4 min-h-[200px] max-h-[400px] overflow-y-auto scroll-smooth"
                >
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                      Ask a question to start the conversation
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg px-4 py-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="space-y-2">
                  <form
                    onSubmit={handleExpandedSubmit}
                    className="flex gap-2 pt-2 border-t"
                  >
                    <Input
                      ref={inputRef}
                      placeholder="Type your question..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={isLoading}
                      className={cn("flex-1", inputStyle)}
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </form>
                  <p className="text-xs text-center text-muted-foreground">
                    Powered By gemma3:4b
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}
    </section>
  );
}
