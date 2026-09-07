# Apêndice G — Trust, PKI, currentness e convergência

**Status editorial:** síntese pedagógica de decisão arquitetural já tomada  
**Data:** 2026-09-06  
**Camada:** compreensão; não substitui Planning C nem seus gates  
**Fonte principal:** `project_docs/generation-2/planning/PLANNING_C_C3_11_ENTERPRISE_TRUST_PKI_CERTIFICATE_LIFECYCLE_TARGET.md`

## O problema humano: o certificado está válido; podemos confiar?

Em uma empresa, essa pergunta parece simples. Um servidor apresenta certificado válido, a conexão TLS funciona e o painel da autoridade certificadora está verde. É natural concluir que a relação está segura.

A arquitetura alvo da Generation 2 exige mais cuidado. Um certificado pode ser criptograficamente válido e, ainda assim, não ser aceitável para a finalidade atual. Pode pertencer a uma geração antiga, depender de uma política superseded, ter status de revogação desconhecido, estar sendo usado por um consumidor que ainda não adotou a nova trust bundle ou provar identidade sem provar autorização empresarial.

A separação fundamental é:

```text
criptografia válida
    != identidade canônica
    != confiança atual para este contexto
    != autorização empresarial
    != verdade semântica do conteúdo assinado
```

`DECIDIDO`: C3.11 adota um **Canonical Enterprise Trust & PKI Plane** provider-neutral e qualificado por revisão. Trust deixa de ser um booleano universal e passa a ser uma afirmação contextual, temporal, evidenciada e governada.

## 1. O que mudou em relação à compreensão inicial

Os capítulos iniciais do livro já defendiam que certificado, identidade, autorização e disponibilidade não deveriam ser confundidos. Planning C agora tornou essa direção mais precisa.

Trust passa a possuir identidades canônicas próprias para domínios de confiança, relações de confiança, conjuntos de âncoras, issuers, perfis, chaves lógicas, credenciais, ocorrências de emissão/distribuição/validação/revogação e cohorts residuais.

Isso evita transformar IDs de CA, caminhos de arquivo, thumbprints, serial numbers, nomes Kubernetes ou identificadores de HSM em identidade semântica do System Builder.

```text
provider-native identity
        ↓ mapping / realization
canonical trust identity
        ↓ policy + revision + evidence
qualified trust decision
```

A igualdade de valores também não colapsa identidade. Um serial de certificado, por exemplo, só é significativo dentro do namespace de seu emissor.

## 2. Trust é um vetor de revisões

Uma dificuldade recorrente em sistemas empresariais é tratar mudança como um único `version = 7`. Em PKI isso é especialmente perigoso porque várias dimensões mudam independentemente.

C3.11 qualifica trust por um vetor que pode envolver:

```text
policy revision
× trust-anchor/bundle revision
× issuer generation
× key/credential generation
× revocation/status generation
× provider-binding revision
× consumer-effective generation
× local evidence horizon
```

`DECIDIDO`: não existe uma única versão capaz de provar convergência de trust.

Isso explica por que uma rotação pode estar concluída no provider e incompleta na empresa. A CA já emitiu a geração nova, mas alguns workloads ainda usam a antiga; um site offline ainda possui bundle anterior; um cache de verificação ainda não observou revogação; uma restauração pode ressuscitar material historicamente válido.

## 3. Trust domain não é “lista de certificados confiáveis”

Um **trust domain** é um escopo administrativo e semântico de confiança. Uma **trust relationship** diz quem ou qual domínio pode ser confiado, para qual finalidade, população e conjunto de restrições.

Por isso, importar uma root CA estrangeira não cria automaticamente confiança irrestrita.

`EXEMPLO DIDÁTICO`: uma organização pode aceitar certificados de determinado emissor para autenticar workloads de estoque, mas não para assinar releases. O mesmo certificado pode ser tecnicamente verificável nos dois contextos; somente um deles está autorizado pela relação de confiança aplicável.

A relação pode qualificar finalidade, relying population, gerações aceitas de bundle, policy, name constraints, currentness, horizonte offline, provider realization e intervalo de vigência.

## 4. Emissão não é adoção

A lifecycle decidida por C3.11 preserva fatos diferentes:

```text
request
→ authorize
→ enroll / prove possession
→ issue
→ distribute / materialize
→ consumer observe
→ validate / qualify
→ effective use
→ renew / rotate
→ requalify
→ drain residual cohorts
→ revoke / retire
→ retain evidence
```

Cada seta pode falhar independentemente.

Uma API da CA responder `200 OK` à emissão não prova que o certificado chegou ao workload. Um Secret montado não prova reload. Um handshake bem-sucedido prova uma interação qualificada, não convergência de toda a Fleet.

Essa distinção é a versão de trust de uma regra que atravessa toda a G2:

```text
desired != materialized != observed != effective != converged
```

## 5. Currentness: “era válido” não responde “é confiável agora”

**Currentness** é a qualidade de a evidência ser suficientemente atual para a decisão que está sendo tomada.

C3.11 define a validação como uma ocorrência (`TrustValidationOccurrence`), e não como verdade eterna. Ela registra contexto: credencial, bundle usado, issuer generation, tempo, policy/profile, finalidade, status de revogação, freshness, verifier, provider binding, provenance e disposição.

As disposições preservam pelo menos:

- `VALID_FOR_CONTEXT`;
- `INVALID`;
- `INCONCLUSIVE`.

`VALID_FOR_CONTEXT` não significa “verdadeiro para sempre”. Significa que as verificações qualificadas tiveram sucesso para aquele contexto e tempo.

## 6. UNKNOWN não pode virar VALID por conveniência

Revogação é um bom exemplo de problema epistemológico: às vezes o sistema sabe que uma credencial foi revogada; às vezes possui evidência de que não estava revogada em determinado horizonte; às vezes não consegue descobrir.

A arquitetura preserva essa diferença:

```text
NOT_REVOKED_AS_OF_EVIDENCE
REVOKED
UNKNOWN / INCONCLUSIVE
STALE / EXPIRED_EVIDENCE
```

`DECIDIDO`: `revocation unknown != valid`.

A policy superior pode escolher fail-closed, degradação bounded ou fonte alternativa. O plano de PKI não deve falsificar conhecimento convertendo ausência de evidência em confiança positiva.

Isso conecta trust diretamente aos capítulos sobre `UNKNOWN`, reconciliation e evidence currentness.

## 7. Assinatura válida não prova verdade

Uma assinatura digital responde a uma pergunta criptográfica: determinados bytes verificam contra determinada chave/credencial no contexto utilizado?

Ela não responde automaticamente:

- o conteúdo assinado é verdadeiro?
- o conteúdo ainda é atual?
- o signer tinha autoridade empresarial?
- a afirmação está completa?
- o artefato foi admitido como release?

Portanto:

```text
signature verified != claim true
attestation authentic != state currently authoritative
```

Isso é especialmente importante para provenance, SBOM, evidência operacional e IA. PKI pode provar relações criptográficas; o semantic owner do conteúdo continua responsável pelo significado da alegação.

## 8. Offline não significa trust congelado indefinidamente

Sites, Stations ou runtimes podem operar desconectados. C3.11 permite verificação local somente dentro de uma **Qualified Local Closure** explícita.

Ela delimita material retido, classes elegíveis, horizonte máximo de currentness, pressupostos de relógio, fontes locais de status, contextos proibidos, retenção de evidência e obrigação de requalificação no reconnect.

A desconexão não estende validade de certificado, policy, revogação ou autoridade.

```text
offline capability
    != timeless trust
```

Depois do horizonte permitido, a resposta pode precisar tornar-se `INCONCLUSIVE` ou fail-closed.

## 9. Rotação é um problema de população

Trocar material no provider é apenas o início. Uma rotação segura precisa observar quem adotou a nova geração e quem continua capaz de produzir efeitos com a antiga.

Esses remanescentes são **residual trust cohorts**.

Exemplos:

- workload que não reiniciou;
- verifier com bundle antigo;
- Station offline;
- conexão ou sessão longa;
- cache de status;
- ambiente restaurado de backup;
- recurso residual do provider anterior.

O fechamento exige que esses cohorts sejam drenados, expirados, revogados, fenced ou explicitamente dispositionados segundo policy bounded.

```text
new material issued != consumers adopted
new anchor distributed != old anchor drained
```

## 10. Revogar é diferente de eliminar autoridade efetiva

Revogação atravessa vários planos:

```text
canonical revocation state
→ CA/status publication
→ provider state
→ verifier caches
→ sessions/connections
→ offline consumers
→ downstream copies
→ observed residual exposure
```

Uma mutação externa pode resultar em `APPLIED`, `NOT_APPLIED`, `PARTIAL` ou `UNKNOWN`. Se o efeito remoto for `UNKNOWN`, a regra transversal continua: reconciliar antes de repetir, salvo quando idempotência/deduplicação estiver qualificada.

O fechamento de revogação é, portanto, population-aware. Um comando bem-sucedido não prova que toda capacidade residual de confiar ou atuar desapareceu.

## 11. Trocar de CA/provider não é trocar URL

O anti-lock-in da G2 não promete que providers são idênticos. A substituição precisa requalificar semântica.

Entre as dimensões relevantes estão hierarquia, perfis, HSM/exportabilidade, emissão, status/revogação, bundle distribution, overlap, runtime integration, audit/provenance, comportamento offline, quotas, isolamento e cleanup residual.

```text
same protocol/API feature != semantic equivalence
```

Pode ser necessário coexistir com dois providers durante a migração. Recursos, credenciais, caches e responders antigos continuam como cohorts residuais até receberem disposição explícita.

## 12. Restore pode ressuscitar trust antigo

Backup e restore atravessam **trust epochs**.

Um snapshot pode trazer de volta anchors removidos, certificados antigos, allowlists, revocation caches ou provider bindings superseded. Restaurar bytes com sucesso não prova que o estado restaurado continua confiável.

```text
restored trust material != currently qualified trust material
```

Depois do restore, as revisões relevantes precisam ser confrontadas com o estado atual e requalificadas antes de declarar recuperadas operações dependentes de trust.

Uma assinatura histórica pode continuar verificável sob evidência histórica sem que a antiga credencial recupere autoridade para novos atos.

## 13. Onde a PKI termina

Uma boa arquitetura também é definida pelo que ela **não** possui.

O plano de Trust/PKI não se torna owner de:

- identidade humana canônica;
- autorização empresarial;
- armazenamento genérico de secrets;
- deployment/runtime orchestration;
- governance/compliance assessment;
- provider cutover mechanics genéricos;
- todo controle de segurança;
- verdade física;
- verdade semântica de qualquer conteúdo assinado.

Essa contenção impede uma capability tecnicamente poderosa de absorver autoridade indevida.

## 14. Como isso conversa com o System Builder

Para o SB, a consequência prática é profunda: confiança deixa de ser configuração periférica e passa a participar da composição verificável do sistema.

Um sistema materializado precisa conseguir explicar, dentro do escopo aplicável:

```text
quem/qual domínio é confiado?
para quê?
por qual policy/revisão?
com qual material/geração?
qual verifier observou?
quando?
com qual evidência de currentness?
qual provider realizou?
quem ainda está na geração antiga?
qual é a condição de fechamento?
```

Isso não obriga o Builder a ficar online. Ao contrário: a Qualified Local Closure é justamente uma forma de declarar o que o runtime precisa reter para operar autonomamente sem inventar confiança durante desconexão.

## 15. Limites e trade-offs

Mais qualificação produz mais fidelidade, mas também mais estado, evidência e reconciliação. Uma arquitetura que rastreia gerações, consumers e currentness é mais complexa que um campo `trusted=true`.

O ganho é evitar certezas falsas.

Há ainda decisões futuras de implementação: representação concreta, armazenamento, APIs, providers escolhidos, mecanismos de distribuição, protocolos e topologia operacional pertencem a Planning D/E e Construction, não a este apêndice.

`DECIDIDO` aqui significa arquitetura alvo no escopo C3.11, não implementação concluída.

## O que você deve guardar deste apêndice

Trust na G2 é **contextual, revisionado, temporal, evidenciado e population-aware**.

As cinco separações mais importantes são:

```text
certificate valid != currently trusted for context
trust != business authorization
issued != consumer-effective
revocation requested != residual trust eliminated
signature verified != semantic truth
```

A consequência maior é que PKI deixa de ser apenas “certificados e TLS”. Ela se torna um plano semântico de confiança capaz de explicar identidade, geração, finalidade, currentness, adoção, revogação, coexistência, offline operation, provider substitution, recovery e fechamento por evidência — sem usurpar os semantic owners vizinhos.

## Referências internas autoritativas consultadas

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`
- `project_docs/generation-2/planning/PLANNING_C_C3_11_ENTERPRISE_TRUST_PKI_CERTIFICATE_LIFECYCLE_TARGET.md`
- `project_docs/generation-2/book/chapters/CHAPTER_15_SEGURANCA_CONFIANCA_PKI_SECRETS_RECUPERACAO.md` — versão editorial anterior usada para identificar o delta pedagógico; não é fonte arquitetural autoritativa.
