# Addendum012 — Station workspace revisions, comparison and conflicts
Date: 2026-10-11 UTC
Status: ACCEPTED effective on validated Planning integration.
Admission: owner requests full WP12 after validated WP11 closure #1090/main1c8f744b.

## Scope, ownership and compatibility
Station owns bounded browser-origin revision retention and comparison through existing replaceable
ArtifactStore. Addendum011 workspace schema/key/folders/files and full snapshot bounds unchanged.
Each revision is another immutable named file; folder/filename/ref remain location metadata. Reuse
ADR0009 and existing codec, caller-owned patch version allocation/provenance. No L4 change/new ADR.
Append revision preserves logical artifactType/artifactId, installed source/base and inert compatible
metadata; uses real prepareEditorArtifact(previous), exact patch successor and predecessor input.
The last retained file in snapshot array order with matching type/id is the retention head (not a
SemVer ordering, publication authority or Git branch). Import remains explicit; imported same-ID
files can change retention head, including an older SemVer, and force revalidation. Reject unstable
pre-release/build predecessor for revision allocation, duplicate version tuple, unchanged graph,
wrong source/identity/provenance, invalid codec or wrong head. Never overwrite any previous file.
Existing imported aliases may retain identical tuples; explicit revision append cannot reuse a tuple.
Expected raw snapshot and selected predecessor file must still match before the existing single-key
write. Best-effort stale detection, not transactional cross-tab CAS. Failure leaves bytes/draft intact.

## Comparison and user decisions
Deterministic data-only JSON pointer diff of complete validated envelopes from the same logical
artifact and source. Sort object keys; compare arrays by authored index. Classify added/removed/changed
with inert before/after values, including identity/version/provenance/schema/payload/extensions.
Bound output to512 changed paths, explicitly mark truncation; no semantic equivalence or merge claim.
File Manager offers retained revision list, revision selection, compare chosen earlier revision and
actual selected-file open/export. Historical revision opening uses existing dirty/pending handoff guards.
Editor offers explicit revision target/name/save against loaded expected workspace/head, no silent
binding to source catalog identity. Prepare current applied graph using selected predecessor metadata;
reject pending fields/replacement. Save revision preserves current draft/accepted checkpoint/history;
it does not mean Save changes or modify legacy per-composition slots. Repeated save requires refresh.
Stale target produces explicit conflict: preserve draft and existing files, refresh targets and review
comparison, or retain an independent copy/portable Save As. Retry must be deliberate; no auto rebase.
Navigation/replacement cancels obsolete target/diff; failures retain prior visible content with mutations
blocked until valid refresh. Labels literal React text; controls keyboard and narrow-layout usable.

## Proof and boundaries
Real editor fields/structure -> codec -> first retained copy -> two immutable revisions -> deterministic
diff -> historical/latest guarded opening and exports; two views stale conflict with no lost bytes.
All68 actual browser predecessors regress. Unit adversarial codec/source/identity/tuple/provenance,
stale/second-read/quota/corrupt/limits/diff metadata and recovery proof.512 path cap explicit.
Bounded WBS21.3.1/21.3.2/21.3.3 and versions/references portion30.1.2 only; no integrity hashes,
collaboration, automatic merge, provider/server/Core/host authority, .process, whole H2/S4 certification.
