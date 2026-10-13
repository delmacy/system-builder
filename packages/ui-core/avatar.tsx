"use client";

import { useState, type HTMLAttributes } from "react";
import { cn } from "./components.js";

export type AvatarProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & Readonly<{
  name: string;
  src?: string;
  initials?: string;
  size?: "sm" | "md" | "lg";
}>;

/** Visual identity only; fall back when remote media fails. */
export function Avatar({ name, src, initials, size = "md", className, ...props }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const fallback = initials ?? name.trim().split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase() ?? "").join("");
  const imageAvailable = Boolean(src && failedSrc !== src);
  return <span {...props} data-slot="avatar" role="img" aria-label={name}
    className={cn("inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted font-medium text-muted-foreground",
      size === "sm" ? "size-7 text-xs" : size === "lg" ? "size-12 text-lg" : "size-9 text-sm", className)}>
    {imageAvailable ? <img src={src} alt="" className="size-full object-cover" onError={() => setFailedSrc(src ?? null)} /> : <span aria-hidden="true">{fallback || "?"}</span>}
  </span>;
}
