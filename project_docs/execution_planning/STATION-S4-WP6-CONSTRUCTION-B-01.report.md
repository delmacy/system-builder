# WP6 Construction B Report 01 — TASK-669
Date: 2026-10-11 UTC
Base: main@dc4e7b80fa1c1f0514fc052a0176d045ce0388e0, A #1061
State: proof implemented on Sprint branch; exact-head validation and integration required
Four exact TASK paths; separate materialization then one authoritative TASK commit. No product optimizer/API/schema/dependency changes.

## Delivered and observed local proof
Checked-in scripts/benchmark-station-editor-history.ts measures the two actual installed compositions plus source-owned registry fixtures with 256-node direct-child/deep-chain graphs and 50 actual API-produced edit snapshots. Same script for baseline and optimized modules; setup/copy construction excluded, measurement assertions included. Five warmups, 30 measured samples per operation/shape/batch, three batches. Nearest-rank median/p95. Each fixture digest/count/snapshot and runtime/protocol field matched across all twelve paired rows.
89/89 editor product tests PASS (83 A/predecessor plus six new max-bound 51-edit/50-undo-redo, oldest non-target tampering, fully warmed past-only prototype authority and both installed checkpoint/codec/fresh-session cases). No wall-clock assertions in product tests. Station production build PASS. npm run verify passed lint/typecheck then environmental tsx IPC listen EPERM; not full local success. Direct tasks (662 specs), architecture and docs PASS. Build output preserved outside source scan and generated next-env changes restored. Local browser not executed; all triggered CI gates and 37 actual browser journeys required before integration.

## Reproducible paired measurement
Node v24.19.0, Linux x64, AMD EPYC 9V74 80-Core Processor; sequential local processes on same environment. Baseline is packages/station-editor/history.ts at pre-optimization main 0fbd63a3966230924f20191ef7ed90bba55ae9d6, reconstructed into /tmp/wp6-baseline-history.ts with import paths redirected to unchanged predecessor modules. Only imports redirected; algorithm unchanged. Verified unchanged graph/session/codec/registry/dependency authority blobs against that base.
Commands from repository root:
- node --import tsx scripts/benchmark-station-editor-history.ts --history-module /tmp/wp6-baseline-history.ts > /tmp/wp6-paired-baseline.json
- node --import tsx scripts/benchmark-station-editor-history.ts > /tmp/wp6-paired-optimized.json
The temporary baseline can be recreated with git show 0fbd63a3:packages/station-editor/history.ts and resolving its alias/relative imports to the checked-out unchanged source modules. The script accepts only an optional --history-module path; workload parameters are fixed and versioned. Intermediate JSON is reproducible scratch; complete numeric results are retained below.

## Outcome and limits
Across all max-bound batches: warm undo median 125.364–229.787 ms -> 4.091–6.166 ms (29.86–38.13x); warm redo 125.244–228.868 ms -> 6.379–10.478 ms (18.99–21.85x). Every paired median exceeds the plan's 2x target. Changed/rejected warm edits also improve; checkpoint cost is essentially unchanged.
Cold caller-copy undo still performs full history validation: optimized max-bound medians approximately 129–231 ms, comparable to baseline 130–237 ms. This is intentional fail-closed behavior, not skipped trust work or a universal speed promise. Initial source snapshots and current graph/session remain fully validated.
Heap deltas are uncollected process allocations with possible GC, not retained-memory/leak certification. Weak certificates have one context per owned graph and no strong global snapshot collection; future wider-catalog/long-session memory profiling remains separate. Existing 50/256/byte/token/depth/caller-registry bounds remain unchanged. No broad catalog or full editor promotion.
Optional C should not be promoted if exact-head regression and independent Review confirm this admitted goal; Review/Closure remain forecast until B validated merge.

## Complete paired timing evidence
Milliseconds; speedup is baseline median / optimized median. Values rounded for reporting only; comparison used full precision.

| Shape | Batch | Operation | Before median | Before p95 | After median | After p95 | Median ratio |
|---|---:|---|---:|---:|---:|---:|---:|
| example | 1 | undo | 2.942698 | 3.655725 | 0.118404 | 0.318087 | 24.853x |
| example | 1 | redo | 2.919354 | 4.286690 | 0.164862 | 0.285859 | 17.708x |
| example | 1 | changed | 2.899295 | 3.820256 | 0.173965 | 0.287312 | 16.666x |
| example | 1 | rejected | 2.954165 | 5.037573 | 0.183038 | 0.302684 | 16.140x |
| example | 1 | checkpoint | 0.020750 | 0.044856 | 0.019028 | 0.024486 | 1.090x |
| example | 1 | coldUndo | 2.990988 | 4.378515 | 3.016556 | 3.961312 | 0.992x |
| example | 2 | undo | 2.955578 | 4.789784 | 0.110512 | 0.171131 | 26.744x |
| example | 2 | redo | 2.804846 | 3.916627 | 0.152244 | 0.445704 | 18.423x |
| example | 2 | changed | 2.919504 | 4.487695 | 0.155978 | 0.220723 | 18.717x |
| example | 2 | rejected | 2.935238 | 4.772394 | 0.160876 | 0.246702 | 18.245x |
| example | 2 | checkpoint | 0.019068 | 0.022483 | 0.016414 | 0.018347 | 1.162x |
| example | 2 | coldUndo | 2.957009 | 3.481639 | 2.807179 | 3.246103 | 1.053x |
| example | 3 | undo | 3.245643 | 4.406967 | 0.109651 | 0.370414 | 29.600x |
| example | 3 | redo | 3.627292 | 4.992676 | 0.153446 | 0.344375 | 23.639x |
| example | 3 | changed | 3.179586 | 4.747116 | 0.154307 | 0.267112 | 20.606x |
| example | 3 | rejected | 3.041504 | 4.268974 | 0.156840 | 0.206974 | 19.392x |
| example | 3 | checkpoint | 0.019038 | 0.092406 | 0.016474 | 0.030174 | 1.156x |
| example | 3 | coldUndo | 3.127439 | 4.218991 | 2.879285 | 3.637618 | 1.086x |
| button-group | 1 | undo | 2.759339 | 3.408191 | 0.119164 | 0.174807 | 23.156x |
| button-group | 1 | redo | 2.775883 | 3.396474 | 0.157381 | 0.233853 | 17.638x |
| button-group | 1 | changed | 2.807640 | 3.369224 | 0.163140 | 0.321191 | 17.210x |
| button-group | 1 | rejected | 2.923740 | 3.854747 | 0.175407 | 0.437172 | 16.668x |
| button-group | 1 | checkpoint | 0.018797 | 0.067208 | 0.017356 | 0.063954 | 1.083x |
| button-group | 1 | coldUndo | 3.011078 | 3.556879 | 2.890992 | 3.430864 | 1.042x |
| button-group | 2 | undo | 2.800991 | 3.742643 | 0.118503 | 0.182338 | 23.636x |
| button-group | 2 | redo | 2.794861 | 4.778062 | 0.158742 | 0.258650 | 17.606x |
| button-group | 2 | changed | 2.831586 | 3.416323 | 0.161938 | 0.265349 | 17.486x |
| button-group | 2 | rejected | 2.836482 | 3.816801 | 0.163931 | 0.370113 | 17.303x |
| button-group | 2 | checkpoint | 0.018357 | 0.024486 | 0.016554 | 0.033619 | 1.109x |
| button-group | 2 | coldUndo | 2.841721 | 4.435649 | 2.936919 | 3.966239 | 0.968x |
| button-group | 3 | undo | 2.857353 | 4.006760 | 0.115029 | 0.139434 | 24.840x |
| button-group | 3 | redo | 2.721524 | 5.027178 | 0.151162 | 0.469228 | 18.004x |
| button-group | 3 | changed | 2.763596 | 6.285849 | 0.153596 | 0.238921 | 17.993x |
| button-group | 3 | rejected | 2.767391 | 3.665069 | 0.160275 | 0.399406 | 17.267x |
| button-group | 3 | checkpoint | 0.018577 | 0.021902 | 0.016434 | 0.035221 | 1.130x |
| button-group | 3 | coldUndo | 2.818426 | 4.968382 | 2.898193 | 3.284340 | 0.972x |
| children | 1 | undo | 125.363670 | 138.187732 | 4.197719 | 5.091711 | 29.865x |
| children | 1 | redo | 125.655552 | 142.033074 | 6.487169 | 7.664005 | 19.370x |
| children | 1 | changed | 125.257047 | 132.589135 | 6.300705 | 7.277829 | 19.880x |
| children | 1 | rejected | 124.344437 | 135.799407 | 5.854871 | 7.014482 | 21.238x |
| children | 1 | checkpoint | 0.832422 | 1.215754 | 0.824039 | 0.958767 | 1.010x |
| children | 1 | coldUndo | 130.215974 | 145.898946 | 129.769948 | 154.974721 | 1.003x |
| children | 2 | undo | 125.668819 | 134.831765 | 4.115008 | 6.394453 | 30.539x |
| children | 2 | redo | 125.243950 | 134.151337 | 6.595578 | 9.165498 | 18.989x |
| children | 2 | changed | 125.141696 | 135.509620 | 6.578883 | 7.708100 | 19.022x |
| children | 2 | rejected | 125.122999 | 139.204487 | 5.939635 | 6.765146 | 21.066x |
| children | 2 | checkpoint | 0.824280 | 0.988911 | 0.818541 | 1.067066 | 1.007x |
| children | 2 | coldUndo | 130.519197 | 147.353662 | 133.483477 | 140.279324 | 0.978x |
| children | 3 | undo | 127.783899 | 135.352678 | 4.090873 | 4.637444 | 31.236x |
| children | 3 | redo | 126.213865 | 134.144555 | 6.379461 | 7.442159 | 19.784x |
| children | 3 | changed | 127.432624 | 137.246906 | 6.424937 | 7.134118 | 19.834x |
| children | 3 | rejected | 127.807586 | 132.641887 | 5.707685 | 6.921337 | 22.392x |
| children | 3 | checkpoint | 0.835967 | 1.151009 | 0.813984 | 1.212639 | 1.027x |
| children | 3 | coldUndo | 131.003978 | 138.350222 | 129.244823 | 140.403697 | 1.014x |
| chain | 1 | undo | 229.787409 | 264.555732 | 6.137636 | 6.979972 | 37.439x |
| chain | 1 | redo | 227.391605 | 243.345260 | 10.431376 | 12.880759 | 21.799x |
| chain | 1 | changed | 228.601910 | 244.448940 | 10.487317 | 14.010908 | 21.798x |
| chain | 1 | rejected | 228.460260 | 246.550353 | 9.589711 | 10.892082 | 23.823x |
| chain | 1 | checkpoint | 0.877247 | 1.128376 | 0.858910 | 1.158800 | 1.021x |
| chain | 1 | coldUndo | 231.396959 | 243.179835 | 227.983070 | 251.068703 | 1.015x |
| chain | 2 | undo | 225.639485 | 253.556109 | 6.166368 | 7.592290 | 36.592x |
| chain | 2 | redo | 228.612907 | 254.138996 | 10.464975 | 11.846202 | 21.846x |
| chain | 2 | changed | 227.246733 | 248.397409 | 10.340612 | 13.845786 | 21.976x |
| chain | 2 | rejected | 226.383441 | 240.545561 | 10.056777 | 12.976711 | 22.511x |
| chain | 2 | checkpoint | 0.874523 | 1.193832 | 0.871568 | 1.066505 | 1.003x |
| chain | 2 | coldUndo | 232.257481 | 259.253688 | 231.329478 | 252.342457 | 1.004x |
| chain | 3 | undo | 229.058295 | 250.374670 | 6.007835 | 7.037075 | 38.127x |
| chain | 3 | redo | 228.867903 | 243.688997 | 10.478184 | 12.051683 | 21.842x |
| chain | 3 | changed | 229.318773 | 243.474552 | 10.408392 | 11.611157 | 22.032x |
| chain | 3 | rejected | 227.590649 | 267.370335 | 9.697268 | 11.004808 | 23.470x |
| chain | 3 | checkpoint | 0.873782 | 1.201292 | 0.862846 | 1.001890 | 1.013x |
| chain | 3 | coldUndo | 237.372349 | 256.722773 | 224.758685 | 257.256204 | 1.056x |

## Fixture and allocation observations

| Shape | Batch | Fixture SHA-256 | Before heap delta (bytes) | After heap delta (bytes) |
|---|---:|---|---:|---:|
| example | 1 | a9c2ed2293e935b6d7295ca789df2b283642d685094c8aebe52fc99dd86aea75 | -1320448 | 3820712 |
| example | 2 | a9c2ed2293e935b6d7295ca789df2b283642d685094c8aebe52fc99dd86aea75 | 2625552 | 4611000 |
| example | 3 | a9c2ed2293e935b6d7295ca789df2b283642d685094c8aebe52fc99dd86aea75 | -10222856 | 3363808 |
| button-group | 1 | 61c38e795bada947d3ad8f3bbea75ae783c5a8a436ced9cfbcafbb8accfaefa7 | -12452728 | 1236992 |
| button-group | 2 | 61c38e795bada947d3ad8f3bbea75ae783c5a8a436ced9cfbcafbb8accfaefa7 | -14846512 | -718304 |
| button-group | 3 | 61c38e795bada947d3ad8f3bbea75ae783c5a8a436ced9cfbcafbb8accfaefa7 | 1877416 | -1833792 |
| children | 1 | 7ccf120a1b6f1f6e2053e1268fe3e5d79b2d9dcac9f99a1115d02616faa5cb36 | 71977192 | 67546336 |
| children | 2 | 7ccf120a1b6f1f6e2053e1268fe3e5d79b2d9dcac9f99a1115d02616faa5cb36 | 1396984 | 122298600 |
| children | 3 | 7ccf120a1b6f1f6e2053e1268fe3e5d79b2d9dcac9f99a1115d02616faa5cb36 | 125700160 | -9713120 |
| chain | 1 | 9d419c3f14892b2c495875f58697d7fced463095fc7715b24f7db3835d1af97b | -30103000 | -49259128 |
| chain | 2 | 9d419c3f14892b2c495875f58697d7fced463095fc7715b24f7db3835d1af97b | -24449360 | 35893240 |
| chain | 3 | 9d419c3f14892b2c495875f58697d7fced463095fc7715b24f7db3835d1af97b | -25772704 | -43523360 |
