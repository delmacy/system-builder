import { isIconToken } from "@system-builder/ui-icons";
import type { WindowDefinition } from "@system-builder/station-windowing";

import type { AppManifest, LaunchPolicy, ToolManifest } from "./types.js";

function token(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string`);
  }
  return value.trim();
}

function stringList(value: unknown, label: string): readonly string[] {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array`);
  return Object.freeze([...new Set(value.map((entry) => token(entry, `${label} entry`)))]);
}

function launchPolicy(value: unknown): LaunchPolicy {
  if (value !== "SINGLETON" && value !== "MULTI_INSTANCE") {
    throw new Error("app launchPolicy must be SINGLETON or MULTI_INSTANCE");
  }
  return value;
}

function icon(value: unknown) {
  const normalized = token(value, "icon");
  if (!isIconToken(normalized)) throw new Error(`unknown semantic icon token: ${normalized}`);
  return normalized;
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value as Record<string, unknown>;
}

function assertKnownFields(
  source: Record<string, unknown>,
  allowed: readonly string[],
  label: string,
): void {
  const allowedSet = new Set(allowed);
  for (const key of Object.keys(source)) {
    if (!allowedSet.has(key)) throw new Error(`${label} contains unsupported field: ${key}`);
  }
}

export function normalizeToolManifest(input: unknown): ToolManifest {
  const source = record(input, "tool manifest");
  assertKnownFields(
    source,
    ["id", "name", "icon", "supportedSurfaces", "commands", "lazyLoad"],
    "tool manifest",
  );

  if (typeof source.lazyLoad !== "boolean") {
    throw new Error("tool manifest lazyLoad must be boolean");
  }

  return Object.freeze({
    id: token(source.id, "tool manifest id"),
    name: token(source.name, "tool manifest name"),
    icon: icon(source.icon),
    supportedSurfaces: stringList(source.supportedSurfaces, "tool manifest supportedSurfaces"),
    commands: stringList(source.commands, "tool manifest commands"),
    lazyLoad: source.lazyLoad,
  });
}

function normalizeWindowDefinition(input: unknown): WindowDefinition {
  const source = record(input, "window definition");
  assertKnownFields(
    source,
    ["id", "appRef", "title", "icon", "defaultSize", "minSize", "multiInstance", "resizable", "commands"],
    "window definition",
  );

  const parseSize = (value: unknown, label: string) => {
    const size = record(value, label);
    const width = size.width;
    const height = size.height;
    if (
      typeof width !== "number" ||
      !Number.isFinite(width) ||
      width <= 0 ||
      typeof height !== "number" ||
      !Number.isFinite(height) ||
      height <= 0
    ) {
      throw new Error(`${label} must contain positive finite width/height`);
    }
    return Object.freeze({ width, height });
  };

  if (typeof source.multiInstance !== "boolean") throw new Error("window multiInstance must be boolean");
  if (typeof source.resizable !== "boolean") throw new Error("window resizable must be boolean");

  return Object.freeze({
    id: token(source.id, "window definition id"),
    appRef: token(source.appRef, "window appRef"),
    title: token(source.title, "window title"),
    icon: icon(source.icon),
    defaultSize: parseSize(source.defaultSize, "window defaultSize"),
    minSize: parseSize(source.minSize, "window minSize"),
    multiInstance: source.multiInstance,
    resizable: source.resizable,
    commands: stringList(source.commands, "window commands"),
  });
}

export function normalizeAppManifest(input: unknown): AppManifest {
  const source = record(input, "app manifest");
  assertKnownFields(
    source,
    ["id", "name", "description", "icon", "launchPolicy", "windows", "commands", "tools"],
    "app manifest",
  );

  if (!Array.isArray(source.windows) || source.windows.length === 0) {
    throw new Error("app manifest must declare at least one window");
  }
  if (!Array.isArray(source.tools)) throw new Error("app manifest tools must be an array");

  const id = token(source.id, "app manifest id");
  const windows = source.windows.map(normalizeWindowDefinition);

  for (const window of windows) {
    if (window.appRef !== id) {
      throw new Error(`window ${window.id} appRef ${window.appRef} does not match app ${id}`);
    }
  }

  const windowIds = new Set<string>();
  for (const window of windows) {
    if (windowIds.has(window.id)) throw new Error(`duplicate window definition id in app ${id}: ${window.id}`);
    windowIds.add(window.id);
  }

  const tools = source.tools.map(normalizeToolManifest);
  const toolIds = new Set<string>();
  for (const tool of tools) {
    if (toolIds.has(tool.id)) throw new Error(`duplicate tool manifest id in app ${id}: ${tool.id}`);
    toolIds.add(tool.id);
  }

  return Object.freeze({
    id,
    name: token(source.name, "app manifest name"),
    ...(source.description === undefined ? {} : { description: token(source.description, "app manifest description") }),
    icon: icon(source.icon),
    launchPolicy: launchPolicy(source.launchPolicy),
    windows: Object.freeze(windows),
    commands: stringList(source.commands, "app manifest commands"),
    tools: Object.freeze(tools),
  });
}
