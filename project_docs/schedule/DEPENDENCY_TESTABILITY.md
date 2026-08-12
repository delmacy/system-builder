# Dependency Testability

Prefer gates that can be checked automatically: schema/contract test passes, artifact exists with expected version, migration succeeds, service health check passes, validation report is green.

Human approval gates remain explicit where judgment is genuinely required. Avoid vague gates such as 'module seems ready'.
