# WP-ICON-01 — Biblioteca de ícones e toolbars
Estado: Planning; base7650d06e06d17bb32e6fec16f426d9a5c7c3143f; Addendum020 aceito. #1135 integrado:28 ícones/12 áreas/110 jornadas é predecessor básico.

## Objetivo e jornada
Usuário localiza/seleciona ícone,configura ícone+texto ou ícone compacto com label preservado,compõe toolbar,salva/exporta/reabre a mesma apresentação. Dois consumidores reais usam a mesma biblioteca/primitives,sem copiar geometry/renderizador porStudio.
Toolbars seguem padrões profissionais: compactas,agrupadas,separadores,tooltips/atalhos,active/checked/disabled,keyboard roving e overflow/dropdown/split. Tema atual e nomes acessíveis preservados.

## Biblioteca completa e baseline
Fonte controlada fixadaLucide70562c1ee1c4fdcf736fe97bc893fb8511927934 possui1877 SVG/762249 bytes observados. Source manifest completo retémSHAdeblob. Full catálogo de assets deve ser local/offline.
235 papéis/19 categorias formam matriz de toolbar:233 têm fonte,2 espelhamentos precisam geometry própria. Inclui salvar/salvarcomo/página,alinhamento texto/objetos,fonte±,ordem absoluta/relativa de camadas,arquivos/edição/páginas/desenho/tabelas/mídia/dados/workflow/técnico/permissões.
Identidade/versionamento/aliases estáveis não são labels traduzidos. Preservar28 tokens egeometry existentes. Separar metadata e módulos locais carregados sob demanda; catálogo amplo não deve entrar inteiro no payload inicial do shell ouDOM. Medir bytes/chunks/cache/latência/perfil. Controle de atualização auditável,não upstreamlatest.

## EAP e cadência
| Sprint | Entrega | Exit |
|---|---|---|
| Planning/TASK742 | Add020/EAP/matriz/sourceManifest/readiness e somente primeiraA | próprios checks/merge |
| A/TASK743 | fullassets/235roles/2custom,metadata/busca/load/version e geração verificável | assets/roles/unsafe/missing/version/legacy/render proofs |
| B forecast | toolbarprimitives/presets/galeria/chooser;ícones persistidos e integração real | keyboard/tooltip/active/disabled/overflow,choice→preview→save/export→fresh reopen e dois consumidores |
| C conditional | lacuna indispensável apósBintegrado | explicit construction,sem overflow emReview |
| Review forecast | regressão do goal completo,visual/contratos/portabilidade/reuso/limites/dívida | nenhuma lacuna requerida ocultada |
| Closure forecast | operações/WBS/riscos/evidências/scheduler e retornoWP02 | gate próprio,sem novo comportamento |
Cinco sprints padrão,seis apenas seC necessário. B materializa tarefas de contrato/editor/primitives em ordem própria apósA; não comprometidas agora.

## Semântica e autoridade
Asset identity/version,semantic role egeometry não são command/actionRef/permission. Toolbar despacha callback/command handle existente e trata comando ausente/desabilitado sem sucesso simulado.
Texto-align é distinto de objeto-align;font size dezoom;subir/descer um nível debringfront/sendback. Sibling reorder não pode fingir z-order. Ícones completos não implicam algoritmos de editor de texto/desenho implementados.
SB05Catalogowner não é o catálogo UI de assets. Nenhum backend/dono será criado por esteWP.

## Persistência de composição — readiness real
ButtonProperties hoje admite exatamentevariant/disabled;codec aceita payload1–4 e rejeita campoicon. B deve materializar evolução visualL3 com nova versão de payload e campos exatos de referência/catalogVersion/mode/posição/accessibility,leitura legado1–4,history/undo/redo/dirty/guard/validação/save/import/export/reopen.
A não toca UI/codecs/composição. Não escondericon em metadata não validada. Não fecharWP com chooser transitório. Label canônico permanece quando caption visível é escondida;icon-only usa accessible name/tooltip.
Ref desconhecida/versão indisponível dá estado explícito,preserva draft e não escolhelatest/placeholder silencioso. L4 inesperado necessita ADR antes da construção afetada; objetivo visualL3 já admitido porAdd020.

## Acceptance
100% dos1877 assets disponíveis/verificados/catalogados e235roles resolvidos,incluindo2custom reconhecíveis. Nenhuma lacuna conhecida ocultada por contagem. Licenças/provider/pin/ref estável e update auditável.
Busca PT/EN/categoria,navegação paginada/DOMlimitado,preview16/20/24/32px e densidade/tema atuais. Toolbar grupos/separadores/split/dropdown/overflow,roving/HomeEnd/orientação,tooltip mouse/foco,normal/hover/focus/pressed/checked/disabled. Icon-only tem label acessível/atalho informado.
Composição ícone→preview→save/export→fresh reopen igual e pelo menosdoisconsumidores atuais com comandos corretos. Capturas reais e110predecessores+novospositivos/negativos/missing/unsafe/late/keyboard/narrow. Medidas do perfil,não certificado universal.

## Dependências
WP02 permaneceOPEN na readinessCatalogConstructionB. ICONprioritário e mandatorybeforeWP02Closure. ApósICONqualifiedClosure,retomarWP02 porfreshmain/task commitment e consumir biblioteca. Horizonte23pacotes:22Studios anteriores+1ICON;continua12SuiteModules. ICONnão conclui outroStudio.

## Construction A implementation
Planning#1136 fivechecksPASS integrated8e6f9fe1ffc68cfa24495eafecc35e8ce1e914b9. TASK743 implements1877source+2custom,235roles/261semantic tokens,versionedsearch/load/checksum/cache and16localchunks. Source hashes all1877match;localgeneration--check,strictunsafeSVG rejection,23TSsyntax andactual1879asset load/digest plusPT/role search/tamper/getter/concurrentcache probes passed. These are observed local checks,not full localrepo/browserexecution.
A completion depends on own fullCI/merge; rawgeneratedchunks686748bytes,not compressedbrowserbudget or universalquality claim. ActualReactfullrender/source/role/negative tests added forCI. Bfreshmaterialization mustcovertoolbar/chooser/portablecomposition field,newvisualschema/backwardsread/history/reopen andtwo actualconsumers. WP-ICON-01 andWP02remainOPEN.

## UI Foundation coordinated successor readiness
Addendum021/UIFoundationPlanning#1137 integrated. ICONA providesstableasset/semantic/publicAPI withoutui-core/globalCSS edits. BeforeBmaterialization,reconcileToolbarprimitives andcompositionicon/schemaownershipwithFoundationD/F; one sharedimplementation,no secondregistry/editor. DconsumesqualifiedICONAcontract andICONB integratesusabletoolbar/chooser/persistenceprooffromqualifiedowner; no cycle requiringwholeICONClosurebeforeitsownintegration.
