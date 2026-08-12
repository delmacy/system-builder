# Dependency Review Checklist

For each edge ask: Is it real or merely sequencing preference? What exact producer output is required? What type of dependency is it? Can a stable contract release the consumer earlier? What proves the gate? Does it create a cycle? Does it unnecessarily serialize independent work? What successors are affected if it slips?

Review this checklist before freezing each near-horizon task DAG.
