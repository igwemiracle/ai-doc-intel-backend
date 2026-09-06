import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Database,
  Layers,
  FileText,
  ShieldCheck,
  Zap,
  Search,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-gradient-to-b from-indigo-500/15 via-purple-500/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-96 -right-40 h-80 w-80 rounded-full bg-pink-500/10 blur-3xl" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md shadow-indigo-500/25">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight">DocuIntel</span>
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                AI RAG
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild size="sm" className="gap-1.5 shadow-sm">
              <Link href="/signup">
                <span>Get Started</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-medium text-primary shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Document Research & Semantic Retrieval</span>
          </div>

          {/* Main Title */}
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl sm:leading-[1.15]">
            Chat with your Documents using{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Deep Semantic Intelligence
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg sm:leading-relaxed">
            Upload PDF research papers, technical specs, or contracts. Extract text, vectorize
            with pgvector, and ask questions with verifiable inline source citations.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="gap-2 h-11 px-6 shadow-md shadow-primary/20">
              <Link href="/signup">
                <span>Start Researching Free</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-11 px-6">
              <Link href="/login">Sign in to Workspace</Link>
            </Button>
          </div>

          {/* Interactive Preview Mockup */}
          <div className="mt-14 relative mx-auto max-w-4xl rounded-2xl border border-border/80 bg-card/60 p-3 shadow-2xl backdrop-blur-xl sm:p-4">
            <div className="rounded-xl border border-border/60 bg-background/90 p-5 sm:p-6 text-left space-y-4">
              {/* Mockup Header */}
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-muted-foreground">
                    docuintel://workspace/ask
                  </span>
                </div>
                <span className="text-[11px] font-medium text-emerald-500 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Gemini 3.6 Active
                </span>
              </div>

              {/* Mock Question & Answer */}
              <div className="space-y-3">
                <div className="rounded-lg bg-muted/40 p-3 text-xs">
                  <span className="font-semibold text-foreground">User: </span>
                  <span className="text-muted-foreground">
                    What is our refund policy for enterprise subscribers?
                  </span>
                </div>

                <div className="rounded-xl border border-border/50 bg-card p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span>DocuIntel Assistant</span>
                  </div>
                  <p className="text-xs leading-relaxed text-foreground/90">
                    Enterprise subscriptions may request a full refund within the first 30 days
                    of activation <span className="rounded bg-primary/10 px-1 py-0.5 text-[10px] font-mono font-bold text-primary">[1]</span>.
                    After 30 days, cancellations apply at the end of the billing period with prorated credits issued upon written notice <span className="rounded bg-primary/10 px-1 py-0.5 text-[10px] font-mono font-bold text-primary">[2]</span>.
                  </p>
                  <div className="flex items-center gap-2 pt-1 border-t border-border/30 text-[11px] text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>2 source passages verified from &quot;Master_Service_Agreement_2026.pdf&quot;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 border-t border-border/40 bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Architected for Grounded Research
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
              Every component is built deliberately to guarantee factual accuracy and zero hallucination.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border/60 bg-card p-5 space-y-2.5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm">PDF Parsing</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Extract digital text layers effortlessly with chunking and token management designed for LLM windows.
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-5 space-y-2.5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm">pgvector Embeddings</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Store 768-dimensional vectors directly in PostgreSQL for ultra-fast cosine similarity retrieval.
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-5 space-y-2.5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10 text-pink-500">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm">Grounded Gemini RAG</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Answers cite exact paragraphs with verified bracket citations so you never have to guess truthfulness.
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-5 space-y-2.5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm">Strict Free-Tier</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Built to run reliably within generous free tiers across Neon, Supabase Storage, and Auth.js.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold">DocuIntel Platform</span>
            <span className="text-xs text-muted-foreground">• Learning & Research Stack</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Next.js 16 • React 19 • Prisma 6 • pgvector • Tailwind CSS v4
          </p>
        </div>
      </footer>
    </div>
  );
}