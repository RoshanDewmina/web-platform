"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X, Volume2, VolumeX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type Msg = { role: "user" | "assistant"; content: string };

export function ChatWidget({
  context,
  courseId,
  lessonId,
}: {
  context?: string;
  courseId?: string;
  lessonId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: "Hi! I’m your AI tutor. How can I help?",
    } as const,
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [lang, setLang] = useState<string>("en-US");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ai_tts_enabled");
      if (raw) setTtsEnabled(raw === "1");
      const rawLang = localStorage.getItem("ai_tts_lang");
      if (rawLang) setLang(rawLang);
    } catch {}
  }, []);

  const speak = (text: string) => {
    if (
      !ttsEnabled ||
      typeof window === "undefined" ||
      !("speechSynthesis" in window)
    )
      return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    try {
      window.speechSynthesis.cancel();
    } catch {}
    window.speechSynthesis.speak(utter);
  };

  const send = async () => {
    if (!input.trim()) return;
    const next: Msg[] = [...messages, { role: "user", content: input.trim() }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: context
            ? `You are helping with the current lesson context: ${context}`
            : undefined,
          messages: next,
          model: process.env.NEXT_PUBLIC_OPENAI_MODEL || undefined,
          courseId,
          lessonId,
        }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.content || "" },
      ]);
      speak(data.content || "");
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Sorry, I had trouble responding." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!open ? (
        <Button
          onClick={() => setOpen(true)}
          className="rounded-full h-12 w-12 p-0"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-[360px] shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <CardTitle className="text-base">AI Tutor</CardTitle>
            <Button size="icon" variant="ghost" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex justify-end mb-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setTtsEnabled((v) => {
                    const nv = !v;
                    try {
                      localStorage.setItem("ai_tts_enabled", nv ? "1" : "0");
                    } catch {}
                    return nv;
                  });
                }}
                title={ttsEnabled ? "Disable voice" : "Enable voice"}
              >
                {ttsEnabled ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            </div>
            <ScrollArea className="h-64 pr-3">
              <div className="space-y-3 py-2">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={
                      m.role === "user"
                        ? "flex justify-end"
                        : "flex justify-start"
                    }
                  >
                    <div
                      className={
                        m.role === "user"
                          ? "bg-primary text-primary-foreground rounded-lg px-3 py-2 max-w-[80%]"
                          : "bg-muted rounded-lg px-3 py-2 max-w-[80%]"
                      }
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>
            <div className="mt-3 flex gap-2">
              <Input
                placeholder="Ask anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                disabled={loading}
              />
              <Button onClick={send} disabled={loading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
