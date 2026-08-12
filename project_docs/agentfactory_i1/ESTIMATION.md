# I1 Provisional Estimation

No calendar promise is made before implementation throughput is calibrated. Use relative planning units (PU).

| WP | O | M | P | Expected PU |
|---|---:|---:|---:|---:|
| I1-01 | 1 | 2 | 3 | 2.00 |
| I1-02 | 2 | 3 | 5 | 3.17 |
| I1-03 | 2 | 3 | 5 | 3.17 |
| I1-04 | 1 | 1 | 2 | 1.17 |
| I1-05 | 1 | 2 | 4 | 2.17 |
| I1-06 | 2 | 4 | 6 | 4.00 |
| I1-07 | 2 | 3 | 5 | 3.17 |
| I1-08 | 1 | 2 | 3 | 2.00 |
| I1-09 | 2 | 3 | 5 | 3.17 |
| I1-10 | 2 | 3 | 5 | 3.17 |
| I1-11 | 1 | 2 | 3 | 2.00 |
| I1-12 | 2 | 4 | 7 | 4.17 |

Likely critical ignition chain: `I1-01 -> I1-02 -> I1-03 -> I1-06 -> I1-07 -> I1-08 -> I1-10 -> I1-11 -> I1-12`, with OpenCode hardening I1-05 joining before I1-06 and GitHub lifecycle I1-09 joining before final proof.

Capture actual implementation, review, CI and rework separately and recalibrate before I2 planning.
