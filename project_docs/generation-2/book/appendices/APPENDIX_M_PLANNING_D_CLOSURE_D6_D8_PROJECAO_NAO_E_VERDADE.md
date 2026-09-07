# Apêndice M — Planning D fecha: experiência, evidência e reconciliação sem criar uma verdade paralela — v1.0.0

**ID editorial:** `APPENDIX_M`  
**Versão editorial:** `1.0.0`  
**Status:** `PUBLISHED`  
**Camada:** compreensão e síntese; não é autoridade de Planning D, Planning E, WBS ou Construction.  
**Data:** 2026-09-07

> `ChapterVersion != ArchitectureRevision != SystemRevision`.

## 1. O problema humano: o que aparece na tela parece verdade

Quando uma empresa troca de sistema, existe uma tentação perigosa: acreditar que a migração terminou quando a nova tela ficou bonita, o dashboard ficou verde e o operador passou a usar o novo painel.

Mas uma interface pode mostrar um estado antigo. Um dashboard pode estar sem dados recentes. Um documento pode ter sido copiado para o novo storage sem que a autoridade sobre ele tenha mudado. Um comando pode aparecer como “concluído” porque o provider respondeu `200 OK`, embora o efeito empresarial ainda esteja `UNKNOWN`. Uma política pode existir no novo sistema enquanto sessões antigas continuam autorizadas pela realidade anterior.

Por isso a parte final de Planning D precisa resolver duas perguntas diferentes:

1. **como apresentar e operar a migração sem criar uma verdade paralela?**
2. **como provar que todas as estratégias D0–D7 são coerentes e realmente fecháveis?**

D6 responde principalmente à primeira pergunta. D7 estende a disciplina a governança, privacidade, comercial, FinOps e derivações analíticas. D8 reconcilia o conjunto e fecha Planning D.

**DECIDIDO:** Planning D está `CLOSED / PASS`. D0–D8 formam uma estratégia coerente de dependências, coexistência, migração, residual drainage e reconciliação. Isso **não** significa que a migração foi executada. Significa que a estratégia de como migrar está decidida e Planning E pode desenhar as provas e critérios de aceitação que demonstrarão o produto.

## 2. D6: uma superfície é uma projeção, não o dono da realidade

A palavra **projeção** aqui significa uma representação derivada de uma verdade que pertence a outro semantic owner.

Um painel de OS pode mostrar que uma ordem está `EM EXECUÇÃO`, mas o painel não se torna o semantic owner do workflow. Uma tela pode mostrar que João possui permissão de aprovação, mas a UI não se torna o semantic owner de Authorization. Um dashboard pode mostrar que um runtime está saudável, mas o dashboard não passa a possuir a verdade de Deployment ou Runtime.

A relação correta é aproximadamente:

```text
semantic owner
     ↓
revisão + evidência + currentness
     ↓
projeção qualificada
     ↓
UI / dashboard / CLI / support bundle
```

Nunca:

```text
UI diz “OK”
     ↓
logo o domínio está OK
```

Essa diferença parece abstrata até surgir uma falha real. Imagine um painel de estoque que ainda mostra 12 peças porque seu cache não sincronizou. Se um operador usa esse número para prometer material a uma OS, a interface não apenas ficou desatualizada: ela influenciou uma decisão empresarial. Por isso currentness, producing revision, population e coverage precisam acompanhar claims operacionais importantes.

## 3. D6-A: antes de enriquecer a experiência, qualifique a evidência

D6 começa pela qualificação comum de evidência, currentness e projeções. A razão é simples: adicionar mais dashboards, telas e automações sobre dados epistemicamente fracos apenas torna a incerteza mais bonita.

Uma claim forte precisa conseguir responder, quando aplicável:

- sobre **qual sujeito semântico** ela fala;
- sob **qual revisão** foi produzida;
- de **qual fonte/provider** veio;
- em que momento foi observada e em que momento passou a valer;
- qual população ela cobre;
- se está `CURRENT`, `STALE`, `PARTIAL`, `UNKNOWN` ou `INCONCLUSIVE`;
- qual provenance e correção/supersession a acompanham;
- qual autoridade/policy é relevante para uma ação protegida.

**DECIDIDO:** informação antiga que não possui essa qualificação pode continuar existindo como evidência legacy/bounded. O SB não deve inventar metadados retroativamente para promovê-la artificialmente a evidência G2 forte.

Essa regra é uma forma de honestidade epistemológica: “não sei” é melhor que precisão fabricada.

## 4. UI e low-code: editar uma tela não transfere semantic ownership

D6 preserva os predecessores fortes de generated views do SB atual, mas não os reinterpreta silenciosamente como o modelo completo da Generation 2.

A arquitetura alvo separa o modelo semântico da experiência de sua realização por renderer/provider. Isso permite que uma mesma intenção seja materializada em tecnologias diferentes sem entregar o significado ao framework visual.

Durante coexistência, uma Experience revision nova pode referenciar declarações antigas como input de compatibilidade. Porém transformação, lossiness e lineage permanecem explícitos.

O ponto mais importante aparece quando low-code ou IA altera algo que parece visual, mas na realidade toca outro domínio.

**EXEMPLO DIDÁTICO:** alguém arrasta no Canvas um botão “Aprovar OS” para a tela do técnico. A operação visual é trivial. A consequência semântica não é. Se esse botão implicar nova permissão, mudança de workflow ou escrita de dados, a proposta deve ser encaminhada aos semantic owners correspondentes.

Assim:

```text
editar apresentação
        !=
receber autoridade para mudar domínio
```

`UI interaction intent != durable business effect`.

## 5. AGWS: visibilidade, personalização e autoridade continuam separadas

Adaptive Governed Work Surfaces (AGWS) acrescenta uma composição governada das superfícies segundo Enterprise, Station, Role e Person.

Isso não transforma a superfície em ACL.

```text
surface visible != authorized
catalog discoverable != Station exposed
personalized != delegated
```

Uma pessoa pode enxergar um comando que, no momento da execução, é negado por Authorization. Idealmente a experiência reduz esse atrito, mas a segurança não pode depender da invisibilidade do botão.

Durante migração, roles e convenções organizacionais legacy entram como claims/candidates até adoção explícita. O fato de um grupo antigo se chamar `supervisores` não prova equivalência com a Role canônica `Supervisor`.

## 6. Documentos e storage: copiar bytes não move a fonte de verdade

D6 aplica a mesma disciplina aos documentos e mídias.

Um objeto possui diferenças importantes entre:

- identidade canônica;
- conteúdo/revisão imutável;
- metadata revision;
- provider realization;
- cópia/cache/backup/export;
- estado de transferência/disponibilidade;
- evidência de integridade e disposição.

Um `object key`, path, ETag ou hash pode ser evidência/identificador de realização. Ele não precisa ser a identidade semântica do documento.

**EXEMPLO DIDÁTICO:** a empresa migra anexos de OS do provider A para o provider B. Todos os arquivos foram copiados e os hashes conferem. Isso prova bastante sobre integridade, mas ainda não prova que a migração fechou. O provider A pode manter cópias, backups ou multipart fragments; caches podem continuar servindo versões anteriores; retention ou legal hold podem exigir conservação intencional; consumers podem continuar apontando para URLs antigas.

Logo:

```text
copy complete != authority transfer
logical delete != all-copy destruction
```

A população de cópias residuais precisa de disposição explícita.

## 7. Observabilidade: dashboard silencioso não significa sistema saudável

D6 preserva `DeploymentObservation` e `Finding` como uma família de evidência legacy útil, mas não os renomeia artificialmente para alertas ou incidentes.

A arquitetura alvo separa:

```text
telemetry/evidence
      ↓
qualification/currentness
      ↓
operational assessment
      ↓
signal / condition / alert
      ↓
incident
      ↓
response / reconciliation
```

Essas palavras não são sinônimos.

Um **signal** é um indício. Uma **condition** é uma condição avaliada sob uma regra. Um **alert** é uma ocorrência governada que exige atenção conforme política. Um **incident** é uma identidade operacional própria, com lifecycle e coordenação.

`signal != confirmed conflict != alert != incident`.

Também não existe segurança em interpretar ausência de alerta como prova de saúde. Um collector pode estar parado. Uma métrica pode cobrir apenas 60% dos workers. Um dashboard pode estar usando dados stale.

Por isso:

```text
quiet dashboard != healthy system
```

## 8. Operador: ergonomia não pode falsificar convergência

Uma boa ferramenta operacional deve reduzir carga cognitiva. Isso não lhe dá permissão para simplificar estados semanticamente diferentes em “sucesso”.

D6 permite que o operador veja estados como:

```text
waiting
partial
unknown
reconciling
blocked
```

Isso é melhor que um falso verde.

Considere um comando de rotação de secret. A CLI pode receber `accepted` do provider. O operador talvez prefira ler “concluído”. Mas a realidade pode ser:

```text
rotation requested
      ↓
provider accepted
      ↓
new secret available
      ↓
consumers adopting
      ↓
old consumers still active
      ↓
residual cohort draining
```

Nesse ponto, chamar a operação de “concluída” destruiria exatamente a informação necessária para operar com segurança.

`command/provider acknowledgement != applied/effective/converged/validated outcome`.

## 9. D7: relatórios, compliance, billing e analytics também não viram shadow truth

D7 leva o princípio de não fortalecimento para áreas onde números parecem particularmente convincentes.

Um relatório de compliance não é a política. Uma fatura não é usage evidence. Um invoice do cloud provider não é automaticamente custo normalizado. Um gráfico não é a população completa. Uma correlação não é causalidade.

D7 preserva separações como:

```text
policy != decision != enforcement != evidence != assessment
measured usage != qualified usage != rated != billed != invoiced != paid
provider invoice != normalized cost evidence != customer-commercial truth
derived != canonical source truth
```

Isso importa para o System Builder porque uma plataforma empresarial tende naturalmente a concentrar dashboards. Sem essas fronteiras, a camada analítica pode se transformar silenciosamente em uma segunda fonte de verdade.

### 9.1 Mesmo número não significa mesmo significado

Dois valores `100` podem representar R$ 100, 100 horas, 100 itens ou uma pontuação adimensional. Mesmo duas quantias monetárias podem usar moedas, datas de câmbio ou políticas de arredondamento diferentes.

D7 exige que derivações preservem unidade, dimensão, população, janela temporal, uncertainty e transformation lineage.

`same number != same semantic meaning`.

### 9.2 Missing não vira zero

Se parte do usage não chegou, faturar zero por default pode ser tão errado quanto inventar consumo. O estado correto pode ser `PARTIAL` ou `UNKNOWN` até qualificação/reconciliação.

Essa regra é uma manifestação do princípio geral:

> uma transformação não pode fortalecer seus inputs sem uma prova que autorize esse fortalecimento.

## 10. D8: fechar a estratégia não é declarar a migração concluída

D8 pergunta se D0–D7 são mutuamente coerentes, operacionalmente fecháveis e suficientemente explícitos para permitir que Planning E desenhe provas do produto.

A resposta autoritativa foi **sim**.

Mas D8 faz uma distinção crucial:

```text
migration strategy CLOSED/PASS
              !=
migration executed
              !=
product proof passed
              !=
construction complete
```

Planning D decidiu a rota. Planning E precisa decidir como demonstrar, por evidência mensurável, que o produto realiza o que a arquitetura promete.

## 11. O protocolo de movimento da fonte de verdade

D8 reconcilia um padrão que aparece repetidamente em Planning D:

```text
1. identificar a autoridade atual
2. estabelecer identidade/revisão alvo
3. qualificar a tradução
4. shadow / comparar
5. expor divergência, PARTIAL e UNKNOWN
6. admitir o writer alvo
7. fence ou coexistir explicitamente o writer antigo
8. transferir autoridade de forma explícita
9. drenar residual cohorts
10. reconciliar
11. fechar
```

Esse protocolo evita uma falha clássica de migração: **dual-write acidental virar dual-truth**.

O sistema pode coexistir com duas realizações. Isso não significa que existem dois semantic owners canônicos para a mesma verdade.

## 12. Residual cohort: o que ainda pode mudar a realidade depois do cutover?

D8 dá uma definição operacional particularmente útil para fechamento:

> uma migração não pode ser considerada fechada enquanto uma população residual aplicável ainda puder produzir, autorizar, observar, rotear, cobrar, reter, expor ou de outra forma afetar materialmente o comportamento sem uma disposição terminal explícita.

Essa população pode incluir:

- workflows em andamento;
- mensagens, retries, DLQs e callbacks;
- bindings/providers antigos;
- grants, sessões e credentials;
- artefatos, deployments e clients antigos;
- secret/config caches;
- backups, indexes e exports;
- policies e waivers antigos;
- delayed usage e billing windows;
- aggregates produzidos de inputs superseded;
- Stations desconectadas.

Disposições terminais podem ser, conforme o owner: drained, fenced, expired, revoked, superseded, aceito sob escopo/horizonte explícito ou manualmente reconciliado.

O ponto não é que tudo precise desaparecer. O ponto é que nada materialmente relevante permaneça **sem explicação**.

## 13. Migração é um workload: filas podem impedir o fechamento

Reconciliation, redrive, backfill, copy, correction propagation e residual drain consomem capacidade.

Se a taxa de chegada de trabalho é `λ` e a capacidade média de serviço é `μ`, a razão simplificada

```text
ρ = λ / μ
```

pode ajudar a raciocinar sobre estabilidade **somente dentro das hipóteses declaradas do modelo**.

Mesmo `ρ < 1` não prova tolerância a burst, ausência de starvation ou prazo aceitável de drenagem. Por isso D8 carrega para Planning E evidências como queue depth, oldest age, retry amplification, blocked-owner age, quotas, reconnect bursts e headroom.

Uma fila curta com itens muito antigos pode representar dívida operacional severa. Assim:

```text
low queue depth != low reconciliation debt
```

## 14. Local, Station e Fleet: agregação não apaga a minoria desconhecida

Em uma arquitetura federada, a visão central pode estar atual enquanto uma Station está offline há horas.

Portanto:

```text
Fleet aggregate != local truth
```

Uma maioria saudável não autoriza esconder uma minoria crítica `UNKNOWN`.

Quando uma Station reconecta, pode atravessar revisões de policy, trust, configuration, workflow e provider. Também pode trazer efeitos atrasados ou duplicados. Reconexão é uma fronteira de reconciliação, não uma regra de `latest wins`.

## 15. Rollback não é máquina do tempo

D8 mantém uma das conclusões mais importantes da pesquisa: rollback não deve ser presumido como inverso semântico.

Voltar a versão do código pode ser fácil. Desfazer uma cobrança enviada, um e-mail recebido, uma exclusão propagada, uma alteração física, uma revogação de trust ou uma decisão empresarial pode ser impossível ou exigir outro processo.

Assim Planning E precisa distinguir:

- rollback onde reversibilidade foi qualificada;
- abort antes do efeito;
- roll-forward;
- compensation quando válida no domínio;
- manual reconciliation;
- residual disposition.

A pergunta deixa de ser “tem botão de rollback?” e passa a ser “**o que exatamente é reversível sob este sujeito, revisão, efeito e horizonte?**”.

## 16. Production Readiness não é feature completeness

D8 preserva uma separação que deve permanecer visível nas próximas fases.

Uma feature pode funcionar e ainda não estar pronta para produção.

Production Readiness Coverage precisa considerar, separadamente:

```text
OBSERVABILITY
OWNERSHIP
FAILURE_HANDLING
RECOVERY
CAPACITY
CURRENTNESS
SECURITY
RECONCILIATION
CHANGE_SAFETY
COST
DOCUMENTATION
```

Um percentual único pode esconder uma dimensão crítica. Por isso um workflow funcional sem recovery, uma integração sem timeout/reconciliation ou um dashboard sem freshness continuam não prontos mesmo que o happy path esteja completo.

## 17. O que muda agora: Planning E pergunta “como provamos?”

Com Planning D fechado, o projeto entrou em `PLANNING_E_PRODUCT_PROOF_ACCEPTANCE`.

A mudança de pergunta é profunda:

```text
Planning C: como deve ser a arquitetura?
Planning D: como chegamos lá sem perder verdade/autoridade?
Planning E: que provas mensuráveis demonstram que o produto realmente cumpre isso?
```

Planning E não deve tratar `CLOSED / PASS` de Planning D como implementação pronta. Pelo contrário: D8 entrega uma lista de proof obligations, incluindo semantic owner/revision preservation, no-shadow-truth, source-of-truth transfer, residual cohort disposition, `UNKNOWN` reconciliation, provider substitution, Local/Station/Fleet currentness, production readiness, capacity/drainability e fechamento com evidência effective/converged/validated quando aplicável.

**EM PESQUISA/PLANEJAMENTO:** a forma final dos product proofs e critérios de aceitação pertence a Planning E. Este apêndice não antecipa suas decisões.

## 18. Relação com os capítulos existentes

O fechamento de Planning D não invalida a primeira edição do livro, mas torna algumas explicações historicamente incompletas.

Os candidatos mais fortes a revisão bounded são:

- **CHAPTER_13**: agora existe estratégia decidida para coexistência, source-of-truth movement, residual cohorts, rollback/roll-forward e closure;
- **CHAPTER_14**: observability/operations ganhou uma posição explícita na migração e no fechamento;
- **CHAPTER_23**: a descrição das fases está materialmente desatualizada, pois Planning C e D já fecharam e Planning E está ativa;
- **CHAPTER_22**: o ciclo ponta a ponta pode futuramente incorporar a passagem arquitetura → migração → product proof.

Isso sugere revisão **MINOR**, não necessariamente MAJOR: as teses centrais permanecem, mas o projeto agora possui decisões autoritativas que ampliam e tornam mais precisas explicações antes prospectivas.

## 19. O que você deve guardar deste apêndice

Planning D não é um plano para “trocar tecnologia”. É uma estratégia para **mover significado, autoridade, efeitos e populações de uma realidade para outra sem criar duas verdades silenciosas**.

A UI não é a verdade porque mostra algo. O dashboard não é a verdade porque está verde. O provider não é a verdade porque respondeu sucesso. A cópia não se torna canônica porque chegou ao destino. O relatório não fortalece inputs incompletos. O cutover não termina enquanto populações antigas ainda conseguem afetar a realidade sem disposição.

A fórmula mental mais útil é:

```text
visível != verdadeiro
aceito != efetivo
novo != convergido
cutover != drain
reconciliação != remediação
estratégia fechada != migração executada
```

E a consequência para a próxima fase é direta:

> se Planning C decidiu **o que o System Builder deve ser** e Planning D decidiu **como chegar lá sem perder coerência**, Planning E precisa decidir **como provar que o produto realmente satisfaz essas promessas**.

---

## Referências autoritativas consultadas

Este apêndice sintetiza, sem substituí-los:

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`;
- `project_docs/generation-2/planning/PLANNING_D_D6_EXPERIENCE_DOCUMENTS_OBSERVABILITY_OPERATIONS.md`;
- `project_docs/generation-2/planning/PLANNING_D_D7_GOVERNANCE_ECONOMICS_ANALYTICAL_DERIVATIONS.md`;
- `project_docs/generation-2/planning/PLANNING_D_D8_ARCHITECTURE_RECONCILIATION_MIGRATION_CLOSURE.md`;
- decisões D0–D5 herdadas e o fechamento de Planning C;
- `project_docs/generation-2/book/appendices/APPENDIX_L_PLANNING_D_D2_D5_MIGRATION_COEXISTENCE.md`.

Em caso de divergência, os artefatos autoritativos de pesquisa/planejamento prevalecem sobre esta síntese editorial.
