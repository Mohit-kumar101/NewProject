"use client";

import {
  useCallback,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
} from "react";
import { formatFileSize } from "@/lib/converter-utils";

export type FileDropzoneProps = {
  /** Called whenever the accepted file list changes. */
  onFilesChange: (files: File[]) => void;
  /** Controlled file list (optional — component can also manage itself). */
  files?: File[];
  /** Comma-separated accept string for the hidden input (e.g. ".csv,text/csv"). */
  accept?: string;
  /** Max file size in bytes. Defaults to 25 MB. */
  maxSizeBytes?: number;
  /** Allow selecting more than one file. */
  multiple?: boolean;
  /** Disable interaction. */
  disabled?: boolean;
  /** Short helper under the title. */
  hint?: string;
  /** Custom empty-state label. */
  label?: string;
  className?: string;
  children?: ReactNode;
};

const DEFAULT_MAX = 25 * 1024 * 1024; // 25 MB

function filterByAccept(files: File[], accept?: string): File[] {
  if (!accept || accept.trim() === "*" || accept.trim() === "*/*") {
    return files;
  }

  const tokens = accept
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  return files.filter((file) => {
    const name = file.name.toLowerCase();
    const type = (file.type || "").toLowerCase();
    return tokens.some((token) => {
      if (token.startsWith(".")) return name.endsWith(token);
      if (token.endsWith("/*")) {
        const prefix = token.slice(0, -1);
        return type.startsWith(prefix);
      }
      return type === token;
    });
  });
}

export function FileDropzone({
  onFilesChange,
  files: controlledFiles,
  accept,
  maxSizeBytes = DEFAULT_MAX,
  multiple = false,
  disabled = false,
  hint,
  label = "Drop a file here, or browse",
  className = "",
  children,
}: FileDropzoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalFiles, setInternalFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const files = controlledFiles ?? internalFiles;

  const commit = useCallback(
    (next: File[]) => {
      if (controlledFiles === undefined) {
        setInternalFiles(next);
      }
      onFilesChange(next);
    },
    [controlledFiles, onFilesChange]
  );

  const ingest = useCallback(
    (incoming: FileList | File[]) => {
      if (disabled) return;

      const list = Array.from(incoming);
      if (list.length === 0) return;

      const accepted = filterByAccept(list, accept);
      if (accepted.length === 0) {
        setError("That file type is not supported for this tool.");
        return;
      }

      const oversized = accepted.filter((f) => f.size > maxSizeBytes);
      if (oversized.length > 0) {
        const names = oversized.map((f) => f.name).join(", ");
        setError(
          `${names} exceed${oversized.length === 1 ? "s" : ""} the ${formatFileSize(maxSizeBytes)} limit.`
        );
        return;
      }

      setError(null);
      const next = multiple ? [...files, ...accepted] : [accepted[0]];
      commit(next);
    },
    [accept, commit, disabled, files, maxSizeBytes, multiple]
  );

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;
    setDragging(true);
  };

  const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
    if (disabled) return;
    ingest(event.dataTransfer.files);
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) ingest(event.target.files);
    // Allow re-selecting the same file.
    event.target.value = "";
  };

  const clearAll = () => {
    setError(null);
    commit([]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeAt = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    setError(null);
    commit(next);
  };

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  const sizePct = Math.min(100, (totalBytes / maxSizeBytes) * 100);
  const nearLimit = sizePct >= 85;

  return (
    <div className={`space-y-3 ${className}`}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-describedby={error ? `${inputId}-error` : undefined}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => {
          if (!disabled) inputRef.current?.click();
        }}
        className={[
          "relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed p-6 transition sm:p-8",
          "bg-[var(--surface)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
          dragging
            ? "border-[#00E5FF] shadow-[0_0_0_4px_rgba(0,229,255,0.15)]"
            : "border-[var(--border)] hover:border-[#00E5FF88]",
          disabled ? "cursor-not-allowed opacity-60" : "",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br from-[#00E5FF33] to-[#2979FF22] blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-gradient-to-tr from-[#2979FF22] to-[#00E5FF18] blur-2xl" />

        <div className="relative flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#2979FF] text-white shadow-[0_8px_24px_rgba(41,121,255,0.28)]">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 16V4m0 0l-4 4m4-4l4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 14v4a2 2 0 002 2h12a2 2 0 002-2v-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <p className="font-[family-name:var(--font-display)] text-base font-semibold text-[var(--foreground)] sm:text-lg">
            {label}
          </p>
          <p className="mt-1.5 max-w-md text-sm text-[var(--muted)]">
            {hint ??
              `Max ${formatFileSize(maxSizeBytes)}${multiple ? " · multiple files" : ""}`}
          </p>

          <span className="mt-4 inline-flex items-center rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#2979FF] px-4 py-2 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(41,121,255,0.25)] transition hover:brightness-105">
            Browse files
          </span>
        </div>

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          className="sr-only"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={onInputChange}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Visual size budget */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
        <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
          <span className="font-medium text-[var(--muted)]">Size budget</span>
          <span
            className={
              nearLimit
                ? "font-semibold text-amber-500"
                : "font-semibold text-[var(--foreground)]"
            }
          >
            {formatFileSize(totalBytes)}{" "}
            <span className="font-normal text-[var(--muted)]">
              / {formatFileSize(maxSizeBytes)}
            </span>
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--background)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#00E5FF] to-[#2979FF] transition-[width] duration-300 ease-out"
            style={{ width: `${sizePct}%` }}
            role="progressbar"
            aria-valuenow={Math.round(sizePct)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Selected files size versus limit"
          />
        </div>
      </div>

      {error ? (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-500"
        >
          {error}
        </p>
      ) : null}

      {files.length > 0 ? (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
              className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#00E5FF22] to-[#2979FF22] text-xs font-bold text-[var(--accent)]">
                {file.name.split(".").pop()?.slice(0, 4).toUpperCase() || "FILE"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--foreground)]">
                  {file.name}
                </p>
                <p className="text-xs text-[var(--muted)]">
                  {formatFileSize(file.size)}
                  {file.type ? ` · ${file.type}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeAt(index)}
                disabled={disabled}
                className="shrink-0 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs font-semibold text-[var(--muted)] transition hover:border-red-400/50 hover:text-red-500 disabled:opacity-50"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {files.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={clearAll}
            disabled={disabled}
            className="rounded-xl border border-[var(--border)] px-3.5 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-50"
          >
            Clear {files.length > 1 ? "all" : "file"}
          </button>
          {!multiple ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
              className="rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#2979FF] px-3.5 py-2 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-50"
            >
              Replace file
            </button>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
              className="rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#2979FF] px-3.5 py-2 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-50"
            >
              Add more
            </button>
          )}
        </div>
      ) : null}

      {children}
    </div>
  );
}
