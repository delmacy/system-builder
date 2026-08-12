# Escopo — Identity / Organization / Authorization

## Inclui
Person/actor/user identities, organizations/units, memberships, roles, permissions, responsibilities, delegation e authorization evaluation hooks.

## Não inclui
Codificar regras específicas de cada negócio no IAM core.

## Entradas
Identity data, organizational model, role/permission definitions e auth provider bindings.

## Saídas
Identity/organization graph e decisões/claims de autorização.

## Critério de conclusão
Atores sem login, usuários com múltiplos papéis e estruturas organizacionais são representáveis de forma explícita.