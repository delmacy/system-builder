# 05 — Catalog

**Objetivo:** manter separados e pesquisáveis o conhecimento de negócio reutilizável e os mecanismos de software disponíveis.

Documentos: [escopo](scope/README.md) · [WBS](WBS.md).

## Serviço proprietário local
ADR-0019/Addendum019 adicionam contratos separados para software e referências de ProcessRevision publicados. O operador configura PostgreSQL, perfil local e fonte confiável; a Station não pode publicar ou aprovar essa fonte. A integração da interface pertence ao Studios WP02.

Execute `npm run catalog:local` após configurar as variáveis `SYSTEM_BUILDER_CATALOG_*` abaixo. O servidor escuta apenas em 127.0.0.1 e informa a porta. Sem configuração válida, falha sem conceder permissões padrão.

| Sufixo | Configuração |
|---|---|
| PROFILE | `local-single-operator` |
| POSTGRES_URL | Banco provisionado pelo operador; tabelas aditivas, sem reset |
| TOKEN | Credencial exclusiva do Catalog com pelo menos 32 caracteres |
| ACTOR / ACTOR_REVISION | Identidade e revisão autorizadas |
| WORKSPACE | Escopo exato do operador e da fonte |
| EXPIRES_AT / REVOKED | Expiração ISO obrigatória; revogação opcional `true` |
| GRANTS | JSON de ações e recursos explicitamente permitidos |
| CORE / STATION / SESSION | Referências exatas do handshake/contexto |
| SOURCE_FILE | Caminho absoluto de snapshot publicado previamente e atestado pelo operador |
| PORT | Inteiro 0–65535; padrão 0 |
| BROWSER_ORIGIN | Origin local exata, quando o navegador deve acessar |

Ações: `catalog.software.register`, `catalog.software.read`, `catalog.business.register`, `catalog.business.read`, `catalog.result.read`. Grants contêm `action` e `resource`; o recurso `*` deve ser uma decisão explícita do operador. Credenciais/grants de Design não concedem acesso a Catalog.

O snapshot possui `contractVersion: "1.0.0"`, `scopeRef`, `sourceAuthorityRef` e `revisions` com `sourceRef` e `input` canônico de CatalogProcessRevisionAdmissionInput. Identidade, publicação, lifecycle e linhagem passam pelo contrato existente. O servidor fixa o digest no início; fonte alterada, ausente ou inelegível bloqueia o uso. Uma geração de configuração/fonte nova exige reinício; isso não publica ou aprova o processo.

POST `/station/handshake`, `/station/command`, `/station/query` usam o protocolo Station existente e Bearer token. Respostas de registro devem ser confirmadas por consulta exata e resultado do comando. Em resposta perdida, consulte o mesmo comando ou repita a requisição idêntica; não gere outra identidade para ocultar resultado desconhecido. Expiração é verificada a cada requisição. Não salve tokens em artefatos/exportações.

Perfil qualificado é local e de um operador. IAM de produção, multi-tenant, TLS remoto, eventos, aprovação remota de negócio e escala não estão certificados. As tabelas novas são `sb_catalog_owner_v1_records`, `sb_catalog_owner_v1_heads` e `sb_catalog_owner_v1_commands`; manter backup consistente do conjunto para preservar entradas e resultados. Não editar registros imutáveis diretamente.
