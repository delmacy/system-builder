# Apêndice C — Elicitação: entender antes de modelar

Status editorial: `EM PESQUISA / SÍNTESE DIDÁTICA BOUNDED`

> Este apêndice é uma camada de compreensão. Não cria uma 29ª capability, não decide Planning C e não transforma a hipótese de Elicitation Knowledge Base em arquitetura aprovada.

## O problema humano: responder perguntas não significa ter entendido a empresa

Imagine uma empresa dizendo: “quando uma OS é concluída, o cliente recebe um e-mail”. A frase parece simples. Um sistema convencional pode convertê-la rapidamente em requisito, tela, workflow e integração SMTP. Mas ainda não sabemos quem pode concluir a OS, o que significa “concluída”, se existe aprovação posterior, qual endereço é válido, o que acontece se o envio falhar, se o cliente pode recusar comunicações, qual evidência comprova o envio, se há múltiplas filiais ou se o processo real difere do procedimento escrito.

Esse é o problema que a pesquisa atual chama de **Elicitation & System Understanding**: obter informação suficiente para compreender um sistema empresarial sem confundir fluência da conversa com resolução semântica.

A desigualdade didática central é:

```text
pergunta respondida
    != conceito resolvido
    != evidência suficiente
    != contradição eliminada
    != artefato pronto para implementação
    != sistema pronto para produção
```

Uma entrevista pode terminar. O entendimento pode continuar incompleto.

## Elicitação não é um formulário gigante

**EM PESQUISA:** a direção mais forte atualmente não é um questionário estático, mas uma base versionada de conhecimento de elicitação — uma *Elicitation Knowledge Base* (EKB). Ela representaria perguntas, aplicabilidade, contexto, evidência esperada, follow-ups, ambiguidades, contradições, provenance e os artefatos que dependem de cada resposta.

A diferença é importante. Um formulário pergunta “qual é o prazo da OS?” e guarda “48 horas”. Uma abordagem orientada a entendimento pergunta também: 48 horas corridas ou úteis? A partir de qual evento? Há pausa aguardando cliente? Quem pode alterar o prazo? Qual documento ou sistema comprova a regra? Ela vale para todas as filiais? Desde quando? O que ocorre em feriados? O SLA contratado diverge da prática operacional?

A pergunta é apenas uma porta de entrada para conceitos.

## QuestionDefinition não é QuestionOccurrence

Uma pergunta reutilizável precisa ser separada de sua ocorrência concreta.

`QuestionDefinition` representa algo como “qual é o tempo máximo aceitável para indisponibilidade?”. Ela pode ter identidade estável, revisão, propósito, condições de aplicabilidade, evidência esperada e regras de follow-up.

`QuestionOccurrence` é essa pergunta aplicada, por exemplo, ao sistema de estoque da Empresa A, site Canoas, revisão operacional R7, respondida pelo responsável de operações em determinada data e sustentada por determinado contrato.

Assim:

```text
QuestionDefinition != QuestionOccurrence != Answer != Finding != Decision
```

Sem essa separação, alterar a pergunta global pode reescrever silenciosamente o significado de respostas históricas; copiar uma resposta entre clientes pode parecer conhecimento validado; e uma resposta antiga pode continuar sendo tratada como atual mesmo após mudança do processo.

## Nem toda informação é do mesmo tipo

Um dos pontos mais importantes da pesquisa é preservar o **tipo epistemológico** da informação — isto é, o que sabemos sobre a natureza daquela afirmação.

“João afirma que o estoque fecha às 18h” pode ser uma `Claim` (alegação). “O log registra fechamento às 19h12 nos últimos 20 dias” é evidência observada. “Vamos assumir 18h até validar” é uma `Assumption`. “A partir da próxima revisão, o fechamento oficial será 19h” pode ser uma `Decision`, desde que tomada pela autoridade competente. “Precisamos impedir movimentações após o fechamento” pode ser um `Requirement`.

Misturar tudo em uma coluna chamada “requisito” destrói informação.

A pesquisa considera úteis categorias como fato, alegação, suposição, candidato inferido, decisão, requisito, restrição, pergunta aberta, conflito, desconhecido, fora de escopo e diferido. Essas categorias ainda pertencem à pesquisa e não devem ser lidas como taxonomia arquitetural aprovada.

Especialmente:

```text
repetição != verdade
confiança da IA != autoridade
resposta preenchida != evidência suficiente
UNKNOWN != campo vazio
N/A != pergunta desnecessária sem justificativa
```

## A IA começa propondo, não decretando

Uma IA pode ler documentos, detectar lacunas, sugerir perguntas, comparar respostas e propor decomposições. Isso é extremamente útil para o System Builder porque o espaço de perguntas empresariais é grande e contextual.

Mas a facilidade de produzir texto cria um risco: uma conversa convincente pode encerrar cedo demais a investigação.

**EM PESQUISA:** output inferido por IA começa como candidato, não como verdade canônica. Mandatory gates, restrições de tipo semântico e unresolveds de alta severidade não devem desaparecer porque o modelo “pareceu entender”.

Isso conecta diretamente este apêndice ao Capítulo 21: IA pode aumentar a capacidade intelectual da elicitação sem receber semantic ownership.

## O ciclo adaptativo

Uma forma pedagógica de visualizar a hipótese atual é:

```text
contexto e escopo
      ↓
fontes e stakeholders
      ↓
perguntas aplicáveis
      ↓
respostas + evidências
      ↓
classificação do que sabemos
      ↓
ambiguidades / contradições / lacunas
      ↓
follow-ups e rotas entre capabilities
      ↓
artefatos derivados
      ↓
avaliação de suficiência
      ↓
reabertura quando a realidade muda
```

O ciclo é adaptativo porque uma resposta muda as próximas perguntas. Se uma empresa diz que uma integração é “instantânea”, surgem perguntas sobre atraso aceitável, timeout, fila, rate limit, retry, reconciliação e currentness. Se ela informa que há operação offline, aparecem questões diferentes sobre sincronização, conflitos e autoridade durante desconexão.

## Quem sabe o quê?

Outro erro comum é tratar um único gerente como fonte universal da verdade. Process owner, operador real, suporte, segurança, privacidade, finanças, responsável por provider, auditor e sistema observado podem conhecer partes diferentes — e podem discordar legitimamente.

Uma OS pode ser descrita pelo gestor como “sempre aprovada pelo supervisor”, enquanto os logs mostram fechamento direto em determinado turno. O comportamento observado é evidência do estado atual, mas não prova que esse comportamento seja o desejado.

Essa distinção é crucial no **brownfield**, quando já existe sistema/processo anterior:

```text
comportamento existente != requisito desejado
```

O System Mirroring deve aprender com a realidade sem canonizar automaticamente todos os seus acidentes históricos.

## Greenfield e brownfield pedem estratégias diferentes

Em um cenário **greenfield**, no qual o sistema ainda não existe, IA pode ajudar a propor decomposição inicial; Wizards podem conduzir validação; especialistas podem editar modelos diretamente. O risco principal é preencher lacunas com suposições plausíveis.

Em **brownfield**, documentos, telas, bancos, logs, formulários, APIs, configurações e comportamento observado tornam-se evidência de primeira classe. A IA pode sugerir mapeamentos; humanos validam significado e ownership; Wizards concentram-se em contradições e espaços não cobertos.

A analogia útil é a de um investigador: entrevista testemunhas, mas também olha documentos e vestígios. A analogia deixa de valer quando sugere que existe necessariamente uma única “verdade escondida”: empresas podem possuir políticas concorrentes, exceções legítimas e decisões ainda abertas.

## Master Wizard, sub-wizards e expert-direct

**HIPÓTESE DE ARQUITETURA / EM PESQUISA:** uma experiência possível separa um Master Wizard, responsável por contexto, escopo, fontes e cobertura, de sub-wizards especializados por capability. Um especialista poderia trabalhar diretamente em modelos estruturados sem percorrer uma conversa artificial.

O objetivo não é criar 28 formulários isolados. Perguntas atravessam boundaries. Uma entrevista de workflow pode descobrir regra de retenção; Privacy/Data Governance continua sendo o owner adequado. Uma entrevista de UI pode revelar uma regra de aprovação; UI não passa a ser dona da autorização.

Portanto:

```text
descobrir um conceito != tornar-se seu semantic owner
```

## De respostas para artefatos, sem apagar a origem

Elicitação pode alimentar User Stories, Use Cases, cenários, requisitos, restrições, acceptance criteria, semantic models e futuras obrigações de Product Proof. Porém o artefato derivado não deve apagar a origem nem a incerteza.

A cadeia candidata é:

```text
Source/Evidence
      ↓
Answer/Finding
      ↓
Requirement/Constraint
      ↓
Story / Use Case / Scenario
      ↓
Semantic Model
      ↓
Capability / Workflow / Data / Authority / Provider ...
      ↓
Acceptance Criterion
      ↓
Test / Product Proof
      ↓
Runtime Evidence
```

Essa rastreabilidade é muitos-para-muitos e qualificada por revisão. Uma ligação significa uma relação declarada — não causalidade, autoridade ou prova automática. Isso se conecta ao Apêndice A: provenance ajuda a responder “de onde veio?”, mas não transforma a origem em prova de correção.

## O perigo do falso completo

O sistema pode parecer 95% completo porque quase todas as perguntas receberam texto, enquanto uma única lacuna crítica continua aberta: quem pode aprovar pagamento, qual é a fonte oficial de identidade, como reconciliar um efeito externo `UNKNOWN`, quem responde por um provider indisponível ou como restaurar dados após corrupção.

Por isso, suficiência não deve ser reduzida a média simples de respostas preenchidas.

Perguntas de *negative space* ajudam a procurar justamente o que não apareceu espontaneamente: quem não foi ouvido? O que acontece antes e depois do happy path? O que falha, repete, atrasa, concorre ou cruza revisões? Qual efeito externo é presumido mas não evidenciado? Qual `N/A` não tem justificativa? Qual documentação está velha? Qual artefato gerado perdeu sua fonte?

## Elicitação e operabilidade são diferentes, mas se encontram

O Apêndice B mostrou que feature completeness não equivale a production readiness. A elicitação precisa carregar essa preocupação desde cedo.

Perguntar “o sistema envia e-mail?” descobre comportamento. Perguntar “como sabemos que o envio funciona ponta a ponta, como detectamos degradação, quem responde, quanto atraso é aceitável e como reconciliamos resultado desconhecido?” investiga operabilidade.

Assim, a lente de operabilidade não substitui elicitação funcional; ela a atravessa.

## O que isso muda na visão do System Builder

O System Builder não pode ser pensado apenas como máquina que transforma respostas em código. A ambição de espelhar uma empresa exige preservar o caminho entre observação, afirmação, evidência, interpretação, decisão, modelo e materialização.

Isso torna o processo menos “mágico”, mas muito mais confiável. A automação continua desejável; o que muda é o lugar onde ela atua. Ela ajuda a encontrar, organizar, confrontar e materializar conhecimento sem fabricar certeza onde a empresa ainda possui dúvida.

## Limitações e estado atual

**EM PESQUISA:** Elicitation & System Understanding é uma hipótese transversal material. Não foi promovida a capability canônica adicional. A pesquisa ainda precisa decidir, em gates posteriores, se suas partes serão metodologia, infraestrutura de authoring/knowledge base, analyzer, provider boundary, projeção ou até `DO NOT BUILD`.

Nada neste apêndice autoriza implementação de EKB, Master Wizard, taxonomy de informação ou coverage score. Esses nomes ajudam a compreender hipóteses pesquisadas.

## O que você deve guardar deste apêndice

Entender uma empresa não é completar um questionário. É construir conhecimento versionado e rastreável sobre conceitos, fontes, evidências, contradições, incertezas e decisões. Perguntas são instrumentos; respostas são evidências ou alegações com tipos diferentes; IA é assistente; semantic owners continuam sendo necessários; comportamento legado não é automaticamente requisito; e “completo” só é defensável quando as dimensões relevantes foram suficientemente resolvidas.

A ideia mais curta é:

```text
elicitar não é coletar texto;
elicitar é reduzir incerteza sem esconder o que ainda não sabemos.
```

## Referências internas principais

- `project_docs/generation-2/research/ELICITATION_SYSTEM_UNDERSTANDING_METHODOLOGY_RESEARCH.md`
- `project_docs/generation-2/research/ELICITATION_QUESTION_TAXONOMY.md`
- `project_docs/generation-2/research/ELICITATION_ARTIFACTS_TRACEABILITY_RESEARCH.md`
- `project_docs/generation-2/research/ELICITATION_COVERAGE_SUFFICIENCY_RESEARCH.md`
- `project_docs/generation-2/research/OPERABILITY_ELICITATION_LENS_RESEARCH.md`
- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`
