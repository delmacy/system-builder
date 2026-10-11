import { decodeCompositionArtifact, type ArtifactStore, type CompositionArtifact } from "../../../../packages/station-editor/index.js";
import { resolveEditorCatalogEntry } from "./station-editor-catalog.js";
import { readEditorArtifact, type CompositionFileInput } from "./station-editor-files.js";

export const WORKSPACE_KEY = "station:artifact-workspace:v1";
export const WORKSPACE_ROOT = "folder:root";
export const WORKSPACE_LIMITS = Object.freeze({ bytes: 4_194_304, folders: 16, files: 48, depth: 8, name: 80 });
export interface WorkspaceFolder { readonly ref: string; readonly parentRef: string | null; readonly name: string }
export interface WorkspaceFile { readonly ref: string; readonly folderRef: string; readonly name: string; readonly text: string }
export interface ArtifactWorkspace {
  readonly schemaVersion: 1; readonly revision: number;
  readonly folders: readonly WorkspaceFolder[]; readonly files: readonly WorkspaceFile[];
}
export type WorkspaceResult =
  | { readonly accepted: true; readonly workspace: ArtifactWorkspace; readonly storedText: string | null }
  | { readonly accepted: false; readonly reason: "invalid-workspace" | "size-limit" | "storage-unavailable" | "storage-conflict" | "invalid-operation" };
export type WorkspaceIntent =
  | Readonly<{ type: "create-folder"; ref: string; parentRef: string; name: string }>
  | Readonly<{ type: "append-file"; ref: string; folderRef: string; name: string; text: string }>;
const bytes = (text: string) => new TextEncoder().encode(text).length;
function exact(value: unknown, keys: readonly string[]): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value) ||
      ![Object.prototype, null].includes(Object.getPrototypeOf(value))) return false;
  const own = Reflect.ownKeys(value);
  return own.length === keys.length && keys.every(key => Object.hasOwn(value, key)) && own.every(key => {
    const d = Object.getOwnPropertyDescriptor(value, key);
    return typeof key === "string" && !!d && Object.hasOwn(d, "value") && d.enumerable;
  });
}
export function validWorkspaceName(name: unknown, file = false): name is string {
  return typeof name === "string" && name === name.trim() && name !== "." && name !== ".." &&
    [...name].length >= 1 && [...name].length <= WORKSPACE_LIMITS.name &&
    !/[/\\]|\p{Cc}|\p{Cs}/u.test(name) && (!file || name.endsWith(".composition.json"));
}
function ref(value: unknown, kind: "folder" | "file"): value is string {
  return typeof value === "string" && new RegExp("^" + kind + ":[A-Za-z0-9_-]{1,80}$").test(value);
}
function freeze(workspace: ArtifactWorkspace): ArtifactWorkspace {
  return Object.freeze({ ...workspace, folders: Object.freeze(workspace.folders.map(f => Object.freeze({ ...f }))),
    files: Object.freeze(workspace.files.map(f => Object.freeze({ ...f }))) });
}
export function emptyArtifactWorkspace(): ArtifactWorkspace {
  return freeze({ schemaVersion: 1, revision: 0, folders: [{ ref: WORKSPACE_ROOT, parentRef: null, name: "Workspace" }], files: [] });
}
/** Metadata locations do not replace logical artifact identity; each file invokes the real codec. */
export function parseArtifactWorkspace(text: string | null): WorkspaceResult {
  if (text === null) return { accepted: true, workspace: emptyArtifactWorkspace(), storedText: null };
  if (typeof text !== "string") return { accepted: false, reason: "invalid-workspace" };
  if (bytes(text) > WORKSPACE_LIMITS.bytes) return { accepted: false, reason: "size-limit" };
  try {
    const data: unknown = JSON.parse(text);
    if (!exact(data, ["schemaVersion", "revision", "folders", "files"]) || data.schemaVersion !== 1 ||
        !Number.isSafeInteger(data.revision) || (data.revision as number) < 0 || !Array.isArray(data.folders) ||
        !Array.isArray(data.files) || data.folders.length < 1 || data.folders.length > WORKSPACE_LIMITS.folders ||
        data.files.length > WORKSPACE_LIMITS.files) return { accepted: false, reason: "invalid-workspace" };
    const folders: WorkspaceFolder[] = [], files: WorkspaceFile[] = [];
    const refs = new Set<string>(), names = new Set<string>(), revisions = new Map<string, string>();
    const unique = (id: string, parent: string | null, name: string) => {
      const key = JSON.stringify([parent, name.toLowerCase()]);
      if (refs.has(id) || names.has(key)) throw Error("duplicate");
      refs.add(id); names.add(key);
    };
    for (const item of data.folders) {
      if (!exact(item, ["ref", "parentRef", "name"]) || !ref(item.ref, "folder") || !validWorkspaceName(item.name) ||
          !(item.parentRef === null || ref(item.parentRef, "folder"))) throw Error("folder");
      if (item.ref === WORKSPACE_ROOT ? item.parentRef !== null || item.name !== "Workspace" : item.parentRef === null) throw Error("root");
      unique(item.ref, item.parentRef, item.name);
      folders.push({ ref: item.ref, parentRef: item.parentRef, name: item.name });
    }
    if (!folders.some(f => f.ref === WORKSPACE_ROOT)) throw Error("root");
    const byRef = new Map(folders.map(f => [f.ref, f]));
    for (const folder of folders) {
      const seen = new Set<string>(); let current: WorkspaceFolder | undefined = folder;
      while (current) {
        if (seen.has(current.ref) || seen.size >= WORKSPACE_LIMITS.depth) throw Error("depth/cycle");
        seen.add(current.ref);
        if (current.parentRef === null) break;
        current = byRef.get(current.parentRef);
        if (!current) throw Error("disconnected");
      }
    }
    for (const item of data.files) {
      if (!exact(item, ["ref", "folderRef", "name", "text"]) || !ref(item.ref, "file") ||
          !ref(item.folderRef, "folder") || !byRef.has(item.folderRef) || !validWorkspaceName(item.name, true) ||
          typeof item.text !== "string") throw Error("file");
      const artifact = decodeCompositionArtifact(item.text, resolveEditorCatalogEntry);
      if (!artifact.accepted) throw Error("artifact");
      const tuple = JSON.stringify([artifact.document.artifactType, artifact.document.artifactId, artifact.document.artifactVersion]);
      if (revisions.has(tuple) && revisions.get(tuple) !== artifact.text) throw Error("identity tuple conflict");
      revisions.set(tuple, artifact.text);
      unique(item.ref, item.folderRef, item.name);
      files.push({ ref: item.ref, folderRef: item.folderRef, name: item.name, text: item.text });
    }
    return { accepted: true, workspace: freeze({ schemaVersion: 1, revision: data.revision as number, folders, files }), storedText: text };
  } catch { return { accepted: false, reason: "invalid-workspace" }; }
}
export function loadArtifactWorkspace(store: ArtifactStore): WorkspaceResult {
  try { return parseArtifactWorkspace(store.getItem(WORKSPACE_KEY)); }
  catch { return { accepted: false, reason: "storage-unavailable" }; }
}
/** Full candidate validation before one native setItem; stale-read guard is not a cross-tab CAS. */
export function mutateArtifactWorkspace(store: ArtifactStore, expectedText: string | null, intent: WorkspaceIntent): WorkspaceResult {
  try {
    const keys = exact(intent, ["type", "ref", "parentRef", "name"]) ? "folder" :
      exact(intent, ["type", "ref", "folderRef", "name", "text"]) ? "file" : null;
    if (!keys || (keys === "folder" ? intent.type !== "create-folder" : intent.type !== "append-file"))
      return { accepted: false, reason: "invalid-operation" };
    if (!validWorkspaceName(intent.name, intent.type === "append-file") ||
        !ref(intent.ref, intent.type === "create-folder" ? "folder" : "file") ||
        (intent.type === "create-folder" ? !ref(intent.parentRef, "folder") :
          !ref(intent.folderRef, "folder") || typeof intent.text !== "string"))
      return { accepted: false, reason: "invalid-operation" };
    const current = loadArtifactWorkspace(store);
    if (!current.accepted) return current;
    if (current.storedText !== expectedText) return { accepted: false, reason: "storage-conflict" };
    if (current.workspace.revision === Number.MAX_SAFE_INTEGER) return { accepted: false, reason: "invalid-operation" };
    const candidate: ArtifactWorkspace = { ...current.workspace, revision: current.workspace.revision + 1,
      folders: intent.type === "create-folder" ? [...current.workspace.folders, { ref: intent.ref, parentRef: intent.parentRef, name: intent.name }] : current.workspace.folders,
      files: intent.type === "append-file" ? [...current.workspace.files, { ref: intent.ref, folderRef: intent.folderRef, name: intent.name, text: intent.text }] : current.workspace.files };
    const text = JSON.stringify(candidate);
    const validated = parseArtifactWorkspace(text);
    if (!validated.accepted) return validated;
    if (store.getItem(WORKSPACE_KEY) !== expectedText) return { accepted: false, reason: "storage-conflict" };
    store.setItem(WORKSPACE_KEY, text);
    return validated;
  } catch { return { accepted: false, reason: "storage-unavailable" }; }
}
export function workspaceDocument(file: WorkspaceFile): CompositionArtifact | null {
  const result = decodeCompositionArtifact(file.text, resolveEditorCatalogEntry);
  return result.accepted ? result.document : null;
}
export async function readWorkspaceComposition(file: CompositionFileInput & { readonly name: string }) {
  if (!validWorkspaceName(file.name, true)) return { accepted: false as const, reason: "invalid-filename" as const };
  return readEditorArtifact(file);
}
