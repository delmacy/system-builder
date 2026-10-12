# Studios WP02 — Catalog Studio Planning
Formal WP-05.3.3-STUDIOS-A; SS.1.2; base94146158bd0ad45f3ee764aab01c254b02d740ec; 2026-10-12.
Status: PLANNING IMPLEMENTED; CONSTRUCTION BLOCKED ON OWNER CONTRACT/ADR DECISION.
Owner asks execute Catalog Studio after shared foundation WP01 closed. WP01Closure#1127 integrated,107Chromium/111heavy0skip/4foundationtests. Existing component-editor source catalog is not SB05 Business/Software Catalog.
## Goal
Builder registers/queries one eligible entry of each catalog, reuses an exact version, and sees deterministic duplicate/incompatible/denied rejection. Business knowledge and software mechanism ownership remain distinct; shared Station shell does not become Catalog owner.
## Current factual census
SoftwareCatalogRegistry register/list/resolveCatalogCandidates public APIs and replaceable CatalogRecordStorage/PostgresCatalogRecordStorage exist. Software fields capability/provider/version/dependencies/dependencyRequirements/compatibility, deterministic ordering and exact/minimum resolution reused unchanged.
Existing business/process knowledge contracts and Catalog admitCatalogProcessRevision/evaluateCatalogKnowledgePromotionAdmission enforce existing canonical lineage/human promotion boundaries. They are admission results, not a durable Business registry/read/list/auth/result ingress.
PostgresCatalogRecordStorage writes cache first and queues SQL ON CONFLICT DO UPDATE until explicit flush; startup reconstructs state. It does not prove atomic immutable/CAS multiwriter admission or durable command idempotency/resultlookup. Do not wrap it and certify ACCEPTED before transaction/readback.
Existing generic StationGateway/StationCorePort is public; concrete local owner port/HTTP binds only Design candidate actions/query. Searches/review of Catalog public files, P6/P17/P18 proof surfaces and gateway found no Catalog authenticated register/list/exact/result binding ready for this Studio. No absence claim from guessed paths or no UI.
## Readiness O1–O5
O1 partial software public domain APIs; public versioned twofamily owneraction/query/result/error contract notready.
O2 existing semantic admission reused; server operation eligibility/classified knowledge/trusted proof resolution and catalog immutable/duplicate/concurrency semantics need owner qualification.
O3 software PG provider exists, but authenticated actual ingress/durable atomic resultledger/restart/readback unknownresponse qualification notready.
O4 scopebaselineAdd018 accepted; new Catalog ownercontract/adapter architecture requires proposed ADR0019 decision before product implementation.
O5 actual eligible Business source/admission evidence must be resolved through existing qualified owner contracts, not caller-injected approved booleans or fabricated human decisions. Missing upstream service gets explicit prerequisite.
## Separate prerequisite
CATALOG-OWNER-WP1 proposal in CATALOG-OWNER-WP1-PLAN-01.md owns public service/durable/auth/Gateway qualification. It cannot be hidden in Station construction. ADR0019 proposed, not accepted. No product Construction TASK committed. After explicit acceptance, fresh owned Planning materializes exact paths/schema/proof for its firstConstruction only.
## Station forecasts after owner qualification
A: public Catalog client/state/controller, strict complete response/owner/context/version verification, bounded registration forms/query/filter/selection; no private producer import. Positive/negative tests through actual owner.
B: install Catalog area in shared Studios and existing launcher/route, Business/Software separate lists/details, exactversion reuse/reference export; local pending form preservation, denied/stale/invalid/timeout/unknown/resultrecover/reopen/restart. Extend107 actual predecessor browser journeys through real Gateway/owner/Postgres.
C: only if postB freshgoalproof indispensable gap.
Review: actual growing browser→API→data→response proof, contracts/privacy/auth/compatibility/limits/debt; no overflow implementation.
Closure: plan/operations/WBS/contracts/risks/scheduler with bounded actual evidence.
## Acceptance and limits
No Business entry without actual eligible source and canonical admission; confidential payload not copied into a public list. No type conflation or latestfallback. Only authenticated is not authorized; local Design grant not Catalog grant. Duplicate immutable identity and incompatible request reject deterministically; permission/session/scope/action evaluated server-side. Receipt alone not persistence, query exact/readback/durable result recover mandatory.
Limits/fields/pagination/browser/performance matrix selected in owned Planning before code, including boundary cases and previous limits; no fabricated numeric throughput or production certificate.
## Decision required
Accept/revise ADR0019 and explicit Catalog owner prerequisite. Current user execution request authorizes Planning; AGENTS architecture/contract escalation prevents silently committing this unaccepted public surface. No generic owner/productionIAM/multitenancy/collaboration or new semantic promotion rules admitted.
