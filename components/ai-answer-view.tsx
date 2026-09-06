"use client";

import { useState } from "react";
import {
  Sparkles,
  FileText,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  BookmarkCheck,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Source {
  fileName: string;
  content: string;
  cited: boolean;
}

interface AnswerResult {
  answer: string;
  sources: Source[];
}

export function AIAnswerView({
  question,
  result,
}: {
  question: string;
  result: AnswerResult;
}) {
  const [copiedAnswer, setCopiedAnswer] = useState(false);
  const [copiedSourceIdx, setCopiedSourceIdx] = useState<number | null>(null);
  const [expandedSourceIdx, setExpandedSourceIdx] = useState<Record<number, boolean>>({});

  function handleCopyAnswer() {
    navigator.clipboard.writeText(result.answer);
    setCopiedAnswer(true);
    setTimeout(() => setCopiedAnswer(false), 2000);
  }

  function handleCopySource(idx: number, content: string) {
    navigator.clipboard.writeText(content);
    setCopiedSourceIdx(idx);
    setTimeout(() => setCopiedSourceIdx(null), 2000);
  }

  function toggleExpandSource(idx: number) {
    setExpandedSourceIdx((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  const citedCount = result.sources.filter((s) => s.cited).length;

  return (
    <div className="space-y-6">
      {/* AI Answer Card */}
      <Card className="relative overflow-hidden border-border/60 bg-gradient-to-br from-card via-card to-muted/20 shadow-md">
        {/* Glow edge accent */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <CardHeader className="flex flex-row items-center justify-between pb-3 pt-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">
                Grounded AI Answer
              </CardTitle>
              <p className="text-[11px] text-muted-foreground">
                Synthesized by Gemini from your indexed documents
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyAnswer}
            className="h-8 gap-1.5 text-xs shadow-xs"
          >
            {copiedAnswer ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Answer</span>
              </>
            )}
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 pt-1">
          {/* Formatted Answer */}
          <div className="rounded-xl border border-border/50 bg-muted/20 p-4 sm:p-5 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
            {result.answer}
          </div>

          {citedCount > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
              <BookmarkCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>
                Referenced <strong className="text-foreground">{citedCount}</strong> verified passage{citedCount !== 1 ? "s" : ""} from your library.
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sources Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Retrieved Document Sources ({result.sources.length})
            </h3>
          </div>
          <span className="text-[11px] text-muted-foreground">
            Ranked by vector relevance
          </span>
        </div>

        {result.sources.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No matching sources were found in your library for this question.
          </p>
        ) : (
          <div className="space-y-3">
            {result.sources.map((source, i) => {
              const isCited = source.cited;
              const isCopied = copiedSourceIdx === i;
              const isExpanded = !!expandedSourceIdx[i];
              const isLongText = source.content.length > 260;
              const textToShow =
                isLongText && !isExpanded
                  ? source.content.slice(0, 260) + "..."
                  : source.content;

              return (
                <Card
                  key={i}
                  className={`border transition-all ${isCited
                      ? "border-emerald-500/30 bg-card shadow-sm hover:border-emerald-500/50"
                      : "border-border/60 bg-muted/10 hover:border-border"
                    }`}
                >
                  <CardContent className="p-4 space-y-3">
                    {/* Header with Source Index & Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[11px] font-bold ${isCited
                              ? "bg-emerald-500 text-white"
                              : "bg-muted text-muted-foreground"
                            }`}
                        >
                          {i + 1}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{source.fileName}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCited && (
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] gap-1">
                            <BookmarkCheck className="h-3 w-3" />
                            Cited in Answer [{i + 1}]
                          </Badge>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopySource(i, source.content)}
                          className="h-6 gap-1 px-2 text-[11px] text-muted-foreground hover:text-foreground"
                        >
                          {isCopied ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-500" />
                              <span className="text-emerald-500">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Chunk content */}
                    <div className="rounded-md bg-muted/40 p-3 text-xs leading-relaxed text-foreground/90 font-mono">
                      {textToShow}
                    </div>

                    {isLongText && (
                      <button
                        type="button"
                        onClick={() => toggleExpandSource(i)}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        {isExpanded ? (
                          <>
                            <span>Show less</span>
                            <ChevronUp className="h-3 w-3" />
                          </>
                        ) : (
                          <>
                            <span>Expand passage</span>
                            <ChevronDown className="h-3 w-3" />
                          </>
                        )}
                      </button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
