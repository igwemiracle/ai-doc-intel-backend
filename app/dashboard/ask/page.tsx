import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { generateAnswer } from "@/lib/rag";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Sparkles, Send, HelpCircle, ShieldCheck, Database } from "lucide-react";
import { AIAnswerView } from "@/components/ai-answer-view";

export default async function AskPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; documentId?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { q, documentId } = await searchParams;
  const question = q?.trim() ?? "";
  const result = question
    ? await generateAnswer(question, session.user.id, documentId)
    : null;

  const promptSuggestions = [
    "What are the main takeaways or conclusions?",
    "Summarize the key requirements or procedures",
    "Identify any risks, limitations, or warnings",
    "Explain the architecture and technical stack",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Heading */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight">AI Document Assistant</h2>
        <p className="text-xs text-muted-foreground">
          Ask questions in plain English and receive answers strictly grounded in your uploaded documents with verifiable citations.
        </p>
      </div>

      {/* Question Form Card */}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-6">
          <form method="GET" className="space-y-4">
            {documentId && <input type="hidden" name="documentId" value={documentId} />}
            <div className="relative flex items-center">
              <Sparkles className="absolute left-3.5 h-4 w-4 text-primary" />
              <Input
                type="text"
                name="q"
                placeholder="Ask a question about your uploaded documents (e.g. What is our refund policy?)..."
                defaultValue={question}
                autoFocus
                className="h-11 pl-10 pr-24 text-sm bg-muted/20 focus-visible:bg-background"
              />
              <div className="absolute right-1.5">
                <Button type="submit" size="sm" className="h-8 gap-1.5 px-3">
                  <Send className="h-3.5 w-3.5" />
                  <span>Ask</span>
                </Button>
              </div>
            </div>

            {/* Suggested Prompt Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-muted-foreground mr-1">
                Suggested questions:
              </span>
              {promptSuggestions.map((prompt) => (
                <Link
                  key={prompt}
                  href={`/dashboard/ask?q=${encodeURIComponent(prompt)}`}
                  className="rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted hover:text-foreground"
                >
                  {prompt}
                </Link>
              ))}
            </div>


          </form>
        </CardContent>
      </Card>

      {/* Answer & Sources Display */}
      {result ? (
        <AIAnswerView question={question} result={result} />
      ) : (
        /* Explainer Cards when idle */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border/60 bg-card p-5 space-y-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold">Zero Hallucinations</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The AI only answers from excerpts retrieved from your documents. If the information isn&apos;t present, it says so clearly.
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-card p-5 space-y-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
              <Database className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold">Inline Citations</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Statements in answers are linked directly to source passages with bracketed citations so you can inspect the exact origin.
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-card p-5 space-y-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold">Deep Synthesis</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Summarizes, compares, and extracts actionable insights across multiple documents in seconds.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}