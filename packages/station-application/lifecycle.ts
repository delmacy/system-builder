import { createApplicationManifest, type ApplicationManifest } from "./index";

export type ApplicationLifecycleRef = Readonly<{ applicationId: string; versionRef: string; revisionRef: string }>;
export type ApplicationLifecycleSnapshot = Readonly<{ lifecycle: ApplicationLifecycleRef; manifest: ApplicationManifest }>;

function nonEmpty(value: string, label: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${label} must be non-empty`);
  return normalized;
}

function normalizeLifecycleRef(ref: ApplicationLifecycleRef): ApplicationLifecycleRef {
  const applicationId = nonEmpty(ref.applicationId, "lifecycle application id");
  const versionRef = nonEmpty(ref.versionRef, "lifecycle version ref");
  const revisionRef = nonEmpty(ref.revisionRef, "lifecycle revision ref");
  if (versionRef === revisionRef) throw new Error("lifecycle version and revision refs must be unambiguous");
  return Object.freeze({ applicationId, versionRef, revisionRef });
}

function canonicalManifest(manifest: ApplicationManifest): ApplicationManifest {
  return createApplicationManifest({ id: manifest.id, componentRegistryRef: manifest.componentRegistryRef, tools: manifest.tools, contributions: manifest.contributions });
}

export function snapshotApplication(manifest: ApplicationManifest, lifecycleRef: ApplicationLifecycleRef): ApplicationLifecycleSnapshot {
  const lifecycle = normalizeLifecycleRef(lifecycleRef);
  if (lifecycle.applicationId !== manifest.id) throw new Error("lifecycle application identity is incompatible with manifest identity");
  return Object.freeze({ lifecycle, manifest: canonicalManifest(manifest) });
}

export function reopenApplicationSnapshot(snapshot: ApplicationLifecycleSnapshot, currentRef: ApplicationLifecycleRef): ApplicationManifest {
  const snapshotRef = normalizeLifecycleRef(snapshot.lifecycle);
  const current = normalizeLifecycleRef(currentRef);
  if (snapshotRef.applicationId !== snapshot.manifest.id || current.applicationId !== snapshot.manifest.id) throw new Error("lifecycle application identity is unknown or incompatible");
  if (snapshotRef.versionRef !== current.versionRef || snapshotRef.revisionRef !== current.revisionRef) throw new Error("application lifecycle snapshot is stale");
  return canonicalManifest(snapshot.manifest);
}
