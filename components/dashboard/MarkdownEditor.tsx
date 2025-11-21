"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";

type MarkdownEditorProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
  placeholder?: string;
  className?: string;
};

export function MarkdownEditor({ label, value, onChange, description, placeholder, className }: MarkdownEditorProps) {
  const [mode, setMode] = useState<"write" | "preview">("write");

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium leading-none">{label}</p>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        <div className="flex gap-2 text-xs">
          <Button type="button" variant={mode === "write" ? "secondary" : "ghost"} size="sm" onClick={() => setMode("write")}>
            Write
          </Button>
          <Button type="button" variant={mode === "preview" ? "secondary" : "ghost"} size="sm" onClick={() => setMode("preview")}>
            Preview
          </Button>
        </div>
      </div>
      {mode === "write" ? (
        <Textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={12} />
      ) : (
        <div className="min-h-[200px] rounded-md border bg-muted/50 p-4 text-sm prose dark:prose-invert">
          {value ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown> : <p className="text-muted-foreground">Nothing to preview yet.</p>}
        </div>
      )}
    </div>
  );
}

