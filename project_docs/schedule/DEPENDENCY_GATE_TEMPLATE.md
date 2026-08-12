# Dependency Gate Template

```yaml
dependency_gate:
  id: GATE-<producer>-<consumer>
  producer: WP-...
  consumer: WP-...
  type: REQUIRES | CONTRACT_REQUIRES | DATA_REQUIRES | RUNTIME_REQUIRES | VALIDATION_REQUIRES
  required_output: <named artifact/schema/contract/runtime/evidence>
  verification: <test/check/evidence reference>
  status: UNSATISFIED | SATISFIED | WAIVED
  waiver_change_request: null
```

Waivers require explicit change/risk acceptance and must not be silently assumed by an executor.
