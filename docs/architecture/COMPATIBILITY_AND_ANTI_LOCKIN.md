# Compatibility-first and Anti-lock-in Architecture

## Principle

**Interoperability before replacement. Replaceable by design.**

System Builder should integrate into an organization's current landscape rather than require an all-at-once platform migration.

## Two dimensions

### Vertical interoperability — client landscape

A generated system may coexist with ERP, CRM, legacy databases, spreadsheets, manual processes and external APIs. Only the targeted process needs modernization.

### Horizontal interoperability — SB suite

A third-party tool may replace a System Builder stage if it can consume/produce the relevant open contract.

## Open by architecture

Open-source licensing alone does not prevent practical lock-in. The platform must also provide:

- portable data;
- documented schemas;
- stable APIs/contracts;
- replaceable connectors;
- externalized secrets/configuration;
- reproducible releases;
- autonomous client runtimes;
- self-hosting path;
- backup/restore/export tooling;
- documented extension points.

## Runtime emancipation

A client runtime must not require a live System Builder license/service to perform ordinary business operations. Builder manages definitions/releases; runtime executes the published product.

## Integration abstraction

Business need: `notify.requester`.

Possible implementations: email, WhatsApp, SMS, push or external automation. BusinessRecipe should describe the need while SystemDefinition selects the technical implementation.

## Commercial implication

Customers should stay because service is valuable, not because migration is artificially impossible.
