"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { FileDropzone } from "@/components/FileDropzone";
import type { DataConverterSlug } from "@/lib/customToolSlugs";
import {
  getDataConverterTool,
  type ConverterDirection,
} from "@/lib/converterTools";
import { ConvertError } from "@/lib/dataConverters";
import {
  formatFileSize,
  readFileAsText,
  replaceExtension,
  triggerDownload,
} from "@/lib/converter-utils";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB text payloads

export function DataCodeConverter({ slug }: { slug: DataConverterSlug }) {
  const tool = getDataConverterTool(slug);
  const directions = tool?.directions ?? [];
  const [directionId, setDirectionId] = useState(directions[0]?.id ?? "");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [sourceName, setSourceName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const direction: ConverterDirection | undefined = useMemo(
    () => directions.find((d) => d.id === directionId) ?? directions[0],
    [directionId, directions]
  );

  useEffect(() => {
    if (!directions.some((d) => d.id === directionId) && directions[0]) {
      setDirectionId(directions[0].id);
    }
  }, [directionId, directions]);

  if (!tool || !direction) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-sm text-[var(--muted)]">Converter configuration missing.</p>
      </div>
    );
  }

  const runConvert = (text: string, dir: ConverterDirection) => {
    setError(null);
    setCopied(false);
    startTransition(async () => {
      try {
        const result = await Promise.resolve(dir.convert(text));
        setOutput(result.output);
      } catch (err) {
        setOutput("");
        setError(
          err instanceof ConvertError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Conversion failed."
        );
      }
    });
  };

  const onFilesChange = async (files: File[]) => {
    const file = files[0];
    if (!file) {
      setSourceName(null);
      setInput("");
      setOutput("");
      setError(null);
      return;
    }
    try {
      const text = await readFileAsText(file);
      setSourceName(file.name);
      setInput(text);
      setError(null);
      runConvert(text, direction);
    } catch {
      setError("Could not read that file as text.");
    }
  };

  const onDirectionChange = (nextId: string) => {
    setDirectionId(nextId);
    setOutput("");
    setError(null);
    setCopied(false);
    const next = directions.find((d) => d.id === nextId);
    if (next && input.trim()) {
      runConvert(input, next);
    }
  };

  const outputExt = direction.defaultFilename.includes(".")
    ? direction.defaultFilename.slice(direction.defaultFilename.lastIndexOf(".") + 1)
    : "txt";

  const downloadFilename = sourceName
    ? replaceExtension(sourceName, outputExt)
    : direction.defaultFilename;

  const mimeForExt = (ext: string): string => {
    switch (ext) {
      case "json":
        return "application/json;charset=utf-8";
      case "csv":
        return "text/csv;charset=utf-8";
      case "tsv":
        return "text/tab-separated-values;charset=utf-8";
      case "xml":
        return "application/xml;charset=utf-8";
      case "yaml":
      case "yml":
        return "text/yaml;charset=utf-8";
      case "html":
        return "text/html;charset=utf-8";
      case "md":
        return "text/markdown;charset=utf-8";
      case "properties":
        return "text/plain;charset=utf-8";
      default:
        return "text/plain;charset=utf-8";
    }
  };

  const onDownload = () => {
    if (!output) return;
    triggerDownload(output, {
      filename: downloadFilename,
      mimeType: mimeForExt(outputExt),
    });
  };

  const onCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Clipboard permission denied.");
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setSourceName(null);
    setError(null);
    setCopied(false);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
              Direction
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              All conversion runs locally in your browser—nothing is uploaded.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {directions.map((dir) => {
              const active = dir.id === direction.id;
              return (
                <button
                  key={dir.id}
                  type="button"
                  onClick={() => onDirectionChange(dir.id)}
                  className={
                    active
                      ? "rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#2979FF] px-3.5 py-2 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(41,121,255,0.22)]"
                      : "rounded-xl border border-[var(--border)] px-3.5 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  }
                >
                  {dir.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <FileDropzone
        accept={direction.accept}
        maxSizeBytes={MAX_SIZE}
        multiple={false}
        label={`Drop a ${direction.fromLabel} file, or browse`}
        hint={`Accepts ${direction.fromLabel} · max ${formatFileSize(MAX_SIZE)} · private client-side convert`}
        onFilesChange={(files) => {
          void onFilesChange(files);
        }}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
              Input · {direction.fromLabel}
            </span>
            {sourceName ? (
              <span className="truncate text-xs text-[var(--accent)]">{sourceName}</span>
            ) : null}
          </div>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setSourceName(null);
            }}
            placeholder={direction.placeholder}
            spellCheck={false}
            rows={16}
            className="w-full resize-y rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 font-mono text-xs leading-relaxed text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] sm:text-sm"
          />
        </label>

        <label className="block">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
              Output · {direction.toLabel}
            </span>
            {isPending ? (
              <span className="text-xs font-medium text-[var(--accent)]">Converting…</span>
            ) : output ? (
              <span className="text-xs text-[var(--muted)]">{formatFileSize(new Blob([output]).size)}</span>
            ) : null}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Converted output appears here."
            spellCheck={false}
            rows={16}
            className="w-full resize-y rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 font-mono text-xs leading-relaxed text-[var(--foreground)] outline-none sm:text-sm"
          />
        </label>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-500"
        >
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={!input.trim() || isPending}
          onClick={() => runConvert(input, direction)}
          className="rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#2979FF] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Convert
        </button>
        <button
          type="button"
          disabled={!output}
          onClick={onDownload}
          className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Download
        </button>
        <button
          type="button"
          disabled={!output}
          onClick={() => {
            void onCopy();
          }}
          className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          type="button"
          disabled={!input && !output}
          onClick={clearAll}
          className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--muted)] transition hover:border-red-400/50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
