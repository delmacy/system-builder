# Milestone Dependency Graph

```text
M0 Planning baseline
 |
 +--> M1 Semantic + identity foundations
       |
       +--> M2 Process knowledge captured/versioned/provenanced
             |
             +--> M3 Recipe -> Analysis -> Design proven
                   |
                   +--> M4 Capability/catalog contracts stable
                         |
                         +--> M5 First assembled + validated vertical slice
                               |
                               +--> M6 First autonomous compiled runtime
                                     |
                                     +--> M7 Release/deploy/rollback proven
                                           |
                                           +--> M8 Observe/support loop proven
                                                 |
                                                 +--> M9 Improvement loop proven
```

Cross-cutting foundation lanes (security, contract evolution, architecture fitness, data governance, audit) attach gates to milestones rather than becoming artificial serial milestones themselves.

A milestone may expose several independent READY branches. Sprint generation selects among those branches subject to capacity; milestone order does not force unrelated work into serial execution.
