import { execFileSync } from "node:child_process";

export function git(args: string[], root = process.cwd()): string {
  return execFileSync("git", args, { cwd: root, encoding: "utf8", windowsHide: true }).trim();
}
export function changedPaths(baseCommit: string, root = process.cwd()): string[] {
  const groups = [
    git(["diff", "--name-only", `${baseCommit}...HEAD`], root),
    git(["diff", "--name-only"], root),
    git(["diff", "--name-only", "--cached"], root),
    git(["ls-files", "--others", "--exclude-standard"], root),
  ];
  return [...new Set(groups.flatMap((value) => value.split(/\r?\n/)).filter(Boolean))].sort();
}
