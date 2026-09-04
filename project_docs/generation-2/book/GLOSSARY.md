# Glossário comentado — Generation 2

Este glossário pertence à camada didática do livro. Definições autoritativas continuam nos artefatos de pesquisa, síntese e planejamento.

## A

**Anti-lock-in** — orientação para impedir que a semântica canônica do System Builder dependa desnecessariamente de um fornecedor, protocolo ou mecanismo específico. Não significa evitar providers; significa preservar a possibilidade de substituí-los sem redefinir o negócio.

**APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN** — disposições usadas para descrever o que se sabe sobre um efeito, especialmente uma mutação remota. `UNKNOWN` é importante quando não há evidência suficiente para afirmar se o efeito ocorreu.

## B

**Binding** — vínculo qualificado entre uma necessidade/capability do SB e uma realização/provider admitido. Um binding não torna automaticamente todos os recursos do provider parte da semântica canônica.

## C

**Capability** — capacidade semanticamente coerente do sistema, com problema e responsabilidades próprios. Não é sinônimo de módulo de UI, pacote de código ou produto externo.

**Canonical / canônico** — aquilo que o SB reconhece como representação ou verdade normativa dentro de um domínio. Um dado externo pode ser evidência sem ser automaticamente canônico.

**Coexistência** — período ou condição em que múltiplas revisões, cohorts, providers, runtimes ou representações permanecem simultaneamente relevantes durante evolução/migração.

**ConflictInstance** — ocorrência concreta, observada ou reproduzível, de um conflito em um sistema/revisão/contexto específicos.

**ConflictPattern** — descrição reutilizável de uma composição potencialmente incompatível. Não prova, por si só, que um defeito está manifestado.

## E

**Edge case** — situação válida ou possível situada em limites, combinações incomuns ou condições difíceis do comportamento esperado. Não é necessariamente um bug; serve para testar se as premissas continuam verdadeiras fora do caminho comum.

**Evidence / evidência** — informação usada para sustentar uma afirmação. Para ser confiável arquiteturalmente, precisa ser qualificada quanto a sujeito, origem, revisão, aplicabilidade, atualidade, cobertura e incerteza quando relevantes.

## H

**Happy path** — percurso em que entradas, dependências e participantes se comportam como esperado. É necessário, mas insuficiente para demonstrar robustez.

## I

**Idempotência** — propriedade segundo a qual repetir uma operação dentro das condições qualificadas do seu contrato não produz efeitos adicionais indevidos. Não deve ser presumida universalmente nem apenas porque existe uma chave de idempotência.

**INCONCLUSIVE** — resultado explícito indicando evidência insuficiente para concluir PASS/FAIL, ALLOW/DENY ou outra afirmação forte. Evita transformar ausência de conhecimento em certeza.

## P

**Provider** — sistema, serviço, engine ou mecanismo especializado que realiza parte de uma capability. O SB procura delegar mecânicas maduras sem entregar automaticamente ao provider a propriedade da semântica empresarial.

## Q

**Qualified evidence envelope** — estrutura conceitual que preserva contexto necessário para interpretar evidência: provenance/origem, produtor e revisão, sujeito, aplicabilidade, freshness/currentness, cobertura, incerteza e horizonte relevante.

## R

**Reconcile-before-retry** — princípio segundo o qual um efeito mutante `UNKNOWN` deve ser reconciliado antes de uma repetição potencialmente insegura, salvo quando o contrato qualificado da operação prova que a repetição é segura.

**Revision / revisão** — identidade de uma evolução de definição, política, schema, fórmula, artefato ou outro elemento. Diferentes elementos podem evoluir independentemente, razão pela qual a pesquisa trabalha também com revision vectors.

**Runtime** — parte do sistema materializado que executa trabalho em operação. A visão G2 busca autonomia de runtime sem exigir dependência permanente do Builder para toda execução.

## S

**Semantic owner** — capability ou domínio responsável pelo significado canônico e pelas invariantes de determinada informação/decisão. Um consumidor pode observar ou projetar esse significado sem automaticamente se tornar seu dono.

**Signal / sinal** — indício que pode justificar investigação ou avaliação. `Signal != ConfirmedConflict`: um detector não deve converter suspeita em fato sem evidência suficiente.

**Station** — escopo organizacional/governado dentro da hierarquia `Enterprise → Station → Role → Person`, usado na pesquisa G2 para exposição de capabilities, administração delegada e limites de autoridade.

## V

**Version skew** — coexistência ou interação entre componentes/revisões que não estão na mesma versão. Pode ser legítima ou perigosa dependendo das relações de compatibilidade.
