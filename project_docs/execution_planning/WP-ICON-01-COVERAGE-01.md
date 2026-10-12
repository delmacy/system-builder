# WP-ICON-01 — matriz de cobertura

Esta é a baseline verificável do pacote, não uma declaração de implementação. Referência Lucide fixada: 70562c1ee1c4fdcf736fe97bc893fb8511927934,1877 SVGs.235 papéis semânticos em19 categorias;233 com fonte existente e2 inversões de objetos exigindo desenho vetorial próprio. Dados completos em WP-ICON-01-COVERAGE-01.json.

| Categoria | Papéis obrigatórios | Exemplos |
|---|---:|---|
| files | 16 | Novo arquivo, Abrir, Salvar, Salvar como |
| editing | 13 | Desfazer, Refazer, Recortar, Copiar |
| typography | 16 | Negrito, Itálico, Sublinhado, Tachado |
| paragraph | 12 | Alinhar texto à esquerda, Centralizar texto, Alinhar texto à direita, Justificar |
| alignment | 10 | Alinhar objetos à esquerda, Centralizar objetos horizontalmente, Alinhar objetos à direita, Alinhar objetos no topo |
| layers | 13 | Camadas, Adicionar camada, Remover camada, Trazer para frente |
| transform | 14 | Mover, Redimensionar, Girar à esquerda, Girar à direita |
| pages | 13 | Página, Adicionar página, Duplicar página, Remover página |
| layout | 10 | Grade, Guias, Encaixar na grade, Linha |
| drawing | 19 | Selecionar, Seleção retangular, Seleção livre, Seleção automática |
| view | 10 | Ampliar, Reduzir, Ajustar página, Ajustar seleção |
| tables | 15 | Inserir tabela, Propriedades da tabela, Adicionar linha, Remover linha |
| media | 11 | Imagem, Inserir imagem, Galeria, Vídeo |
| links | 8 | Adicionar vínculo, Remover vínculo, Abrir link externo, Anexar |
| charts | 8 | Gráfico de colunas, Gráfico de barras, Gráfico de linhas, Gráfico de setores |
| data | 10 | Banco de dados, Nova entidade, Consultar dados, Importar dados |
| workflow | 15 | Processo, Estado ou nó, Transição, Decisão ou ramificação |
| technical | 12 | Código, Terminal, Compilar, Pacote |
| security | 10 | Protegido, Desbloqueado, Permissões, Acesso negado |

## Exemplos do proprietário — bloqueiam fechamento se ausentes
- `file.save`: Salvar → `save`.
- `page.document`: Página → `file`.
- `text.align-center`: Centralizar texto → `text-align-center`.
- `text.align-right`: Alinhar texto à direita → `text-align-end`.
- `font.increase`: Aumentar fonte → `a-arrow-up`.
- `font.decrease`: Diminuir fonte → `a-arrow-down`.
- `layer.bring-front`: Trazer para frente → `bring-to-front`.
- `layer.send-back`: Enviar para trás → `send-to-back`.
- `layer.raise`: Subir uma camada → `layers-arrow-up`.
- `layer.lower`: Descer uma camada → `layers-arrow-down`.

## Critério de completude
100% dos1877 assets da fonte controlada disponíveis pelo catálogo com identidade/digest/preview,100% dos235 papéis resolvidos com rótulo e grupo, nenhuma lacuna conhecida ocultada e nenhuma regressão nos28 tokens integrados. Os2 espelhamentos custom não podem virar setas genéricas como substituto. Ampliação da matriz por gaps de ferramentas reais é permitida por mudança explícita da task, nunca ignorando uma categoria. Catálogo amplo é a fonte; pacote semântico é a interface de toolbars, não uma seleção arbitrária de28 ícones.

## Requisitos de consumo
Separar alinhamento de texto de objetos; ordem absoluta de camada de mover apenas um nível; tamanho de fonte de zoom; arquivo de página. Presets por contexto: documento/texto, layout/página, camadas/desenho, dados e workflow/Studio. Tokens não concedem permissão nem declaram o comando implementado. Em toolbars reais, comando indisponível é desabilitado e explicado; não inventar simulação de sucesso.

## Validação visual e de interação
Grade pesquisável em português/inglês/categoria, páginas renderizadas limitadas; previews16/20/24/32px e temas atuais. Icon-only possui nome acessível, tooltip em hover/foco, atalho quando houver. Toolbar compacta tem grupos/separadores, estados normal/hover/focus/active/disabled, menus de overflow/dropdown/split, teclado roving e orientação. Medir bytes/chunks/DOM/latência no perfil declarado; catálogo completo não deve ser importado todo na abertura do shell. Capturas reais da galeria e toolbars; teclado e persistência/reabertura do ícone em composição exigem prova própria.
