"use client";

import { Fragment, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Loader2,
  RotateCw,
  UploadCloud,
  Search,
  Sparkles,
  Layers,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Filter,
} from "lucide-react";
import { processDocument } from "@/app/actions/processDocument";
import { embedDocument } from "@/app/actions/embedDocument";
import { formatFileSize, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

type DocumentStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

type Document = {
  id: string;
  fileName: string;
  fileSize: number;
  createdAt: Date;
  status: DocumentStatus;
  errorMessage: string | null;
  _count: {
    chunks: number;
  };
};

const statusConfig: Record<
  DocumentStatus,
  {
    label: string;
    icon: typeof CheckCircle2;
    className: string;
  }
> = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    className: "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400",
  },
  PROCESSING: {
    label: "Extracting",
    icon: Loader2,
    className: "text-blue-600 bg-blue-500/10 border-blue-500/20 dark:text-blue-400",
  },
  COMPLETED: {
    label: "Extracted",
    icon: CheckCircle2,
    className: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400",
  },
  FAILED: {
    label: "Failed",
    icon: AlertCircle,
    className: "text-rose-600 bg-rose-500/10 border-rose-500/20 dark:text-rose-400",
  },
};

export function DocumentList({ documents }: { documents: Document[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"process" | "embed" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  function handleProcess(id: string) {
    setActiveActionId(id);
    setActionType("process");
    startTransition(async () => {
      await processDocument(id);
      router.refresh();
      setActiveActionId(null);
      setActionType(null);
    });
  }

  function handleEmbed(id: string) {
    setActiveActionId(id);
    setActionType("embed");
    startTransition(async () => {
      await embedDocument(id);
      router.refresh();
      setActiveActionId(null);
      setActionType(null);
    });
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.fileName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (documents.length === 0) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UploadCloud className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold">Your library is empty</h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              Upload your research papers, manuals, or PDF reports to start parsing text and running vector queries.
            </p>
          </div>
          <Button asChild className="mt-2 gap-2">
            <Link href="/dashboard/upload">
              <UploadCloud className="h-4 w-4" />
              Upload your first document
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Document Library</h2>
          <p className="text-xs text-muted-foreground">
            {documents.length} document{documents.length !== 1 ? "s" : ""} in your intelligence vault
          </p>
        </div>

        <Button asChild className="gap-2 shadow-sm">
          <Link href="/dashboard/upload">
            <UploadCloud className="h-4 w-4" />
            Upload PDF
          </Link>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search documents by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border/60 bg-muted/40 p-1">
          {["ALL", "COMPLETED", "PENDING", "FAILED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${statusFilter === status
                ? "bg-card text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {status === "ALL"
                ? "All"
                : status === "COMPLETED"
                  ? "Ready"
                  : status === "PENDING"
                    ? "Pending"
                    : "Failed"}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Table */}
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[300px]">Document</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Vectors</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-xs text-muted-foreground"
                  >
                    No documents match your search criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocuments.map((doc) => {
                  const { label, icon: StatusIcon, className: badgeClass } =
                    statusConfig[doc.status];
                  const isThisRowPending =
                    isPending && activeActionId === doc.id;

                  return (
                    <Fragment key={doc.id}>
                      <TableRow className="transition-colors hover:bg-muted/30">
                        {/* Name */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <FileText className="h-4 w-4" />
                            </div>
                            <span className="font-medium text-sm text-foreground truncate max-w-[240px]" title={doc.fileName}>
                              {doc.fileName}
                            </span>
                          </div>
                        </TableCell>

                        {/* Size */}
                        <TableCell className="text-xs text-muted-foreground">
                          {formatFileSize(doc.fileSize)}
                        </TableCell>

                        {/* Uploaded Date */}
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(doc.createdAt)}
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <span
                            className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${badgeClass}`}
                          >
                            <StatusIcon
                              className={`h-3 w-3 ${isThisRowPending && actionType === "process"
                                ? "animate-spin"
                                : ""
                                }`}
                            />
                            {label}
                          </span>
                        </TableCell>

                        {/* Vectors / Chunks */}
                        <TableCell>
                          {doc._count.chunks > 0 ? (
                            <Badge variant="outline" className="gap-1 text-xs font-normal border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                              <Layers className="h-3 w-3" />
                              <span>{doc._count.chunks} chunks</span>
                            </Badge>
                          ) : doc.status === "COMPLETED" ? (
                            <span className="text-xs text-amber-500 font-medium">
                              Not indexed
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Process Button */}
                            {(doc.status === "PENDING" || doc.status === "FAILED") && (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={isThisRowPending}
                                onClick={() => handleProcess(doc.id)}
                                className="h-8 gap-1 text-xs"
                              >
                                {isThisRowPending && actionType === "process" ? (
                                  <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    <span>Extracting...</span>
                                  </>
                                ) : doc.status === "FAILED" ? (
                                  <>
                                    <RotateCw className="h-3 w-3" />
                                    <span>Retry</span>
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="h-3 w-3 text-primary" />
                                    <span>Process</span>
                                  </>
                                )}
                              </Button>
                            )}

                            {/* Embed Button (if extracted but 0 chunks) */}
                            {doc.status === "COMPLETED" && doc._count.chunks === 0 && (
                              <Button
                                size="sm"
                                variant="default"
                                disabled={isThisRowPending}
                                onClick={() => handleEmbed(doc.id)}
                                className="h-8 gap-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                              >
                                {isThisRowPending && actionType === "embed" ? (
                                  <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    <span>Vectorizing...</span>
                                  </>
                                ) : (
                                  <>
                                    <Layers className="h-3 w-3" />
                                    <span>Index Chunks</span>
                                  </>
                                )}
                              </Button>
                            )}

                            {/* Ready Actions: Ask AI & Search */}
                            {doc.status === "COMPLETED" && doc._count.chunks > 0 && (
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="h-8 gap-1 text-xs"
                              >
                                <Link href={`/dashboard/ask?documentId=${doc.id}&q=Summarize key points from ${encodeURIComponent(doc.fileName)}`}>
                                  <Sparkles className="h-3 w-3 text-primary" />
                                  <span>Ask</span>
                                </Link>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Error details row if failed */}
                      {doc.status === "FAILED" && doc.errorMessage && (
                        <TableRow className="bg-rose-500/5">
                          <TableCell
                            colSpan={6}
                            className="py-2.5 px-4 text-xs text-rose-600 dark:text-rose-400"
                          >
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                              <span>Error processing file: {doc.errorMessage}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
