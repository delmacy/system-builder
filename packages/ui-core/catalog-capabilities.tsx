"use client";
import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "./components.js";

export type EmptyStateProps = HTMLAttributes<HTMLElement> & Readonly<{
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}>;
/** A presentation-only empty state. No workspace or command ownership. */
export function EmptyState({ title, description, icon, action, className, ...props }: EmptyStateProps) {
  return <section {...props} data-slot="empty-state" className={cn("flex min-w-0 flex-col items-center justify-center gap-2 rounded-[var(--sb-radius-panel)] border border-dashed bg-card px-4 py-8 text-center", className)}>
    {icon ? <span aria-hidden="true" className="text-muted-foreground">{icon}</span> : null}
    <h3 className="text-sm font-semibold">{title}</h3>
    {description ? <p className="max-w-prose text-sm text-muted-foreground">{description}</p> : null}
    {action}
  </section>;
}

export type PaginationProps = Omit<HTMLAttributes<HTMLElement>, "onChange"> & Readonly<{
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  previousLabel?: string;
  nextLabel?: string;
}>;
/** Zero-based controlled pagination; bounded buttons never imply data retrieval. */
export function Pagination({ page, pageCount, onPageChange, previousLabel = "Previous page", nextLabel = "Next page", className, ...props }: PaginationProps) {
  if (!Number.isSafeInteger(pageCount) || pageCount < 1 || !Number.isSafeInteger(page) || page < 0 || page >= pageCount) {
    throw new RangeError("Pagination requires a valid zero-based page within a positive pageCount");
  }
  return <nav {...props} data-slot="pagination" aria-label={props["aria-label"] ?? "Pagination"} className={cn("flex flex-wrap items-center gap-2 text-xs", className)}>
    <button type="button" className="rounded-[var(--sb-radius-control)] border px-2 py-1 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring" disabled={page === 0} onClick={() => onPageChange(page - 1)}>{previousLabel}</button>
    <output aria-live="polite" className="text-muted-foreground">Page {page + 1} of {pageCount}</output>
    <button type="button" className="rounded-[var(--sb-radius-control)] border px-2 py-1 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring" disabled={page === pageCount - 1} onClick={() => onPageChange(page + 1)}>{nextLabel}</button>
  </nav>;
}
