# Parallel Dependency Example

```text
Subject/User identity -> Authentication -> Authorization-dependent feature

Capability Registry -> Catalog resolution -> Assembly consumer
```

If there is no edge between the two chains, Capability Registry can progress while Authentication is still underway. Sequential execution may choose not to exploit that opportunity, but the dependency model remains correct and future parallel agents can.
