# TODO - Light Version com cores invertidas

## Objetivo
Pôr na light version a mesma estrutura da dark, mas com cores invertidas:
- Details cards a preto
- Texto principal a branco
- Escolhas laterais (ícones e labels) a verde

## Tarefas

### 1. Atualizar variables.scss ✅
- [x] Adicionar variáveis CSS para a light version:
  - `--detail-card-bg-light`: fundo preto (#1a1a1a)
  - `--detail-text-light`: texto branco (#ffffff)
  - `--detail-icon-light`: verde #C6FF00
  - `--detail-value-light`: verde #C6FF00

### 2. Atualizar criar-atividade.page.scss ✅
- [x] Adicionar estilos `:host-context(body.light)` para:
  - .detail-item: usar --detail-card-bg-light
  - .detail-icon, .detail-label: usar --detail-icon-light
  - .detail-value, .chevron-icon: usar --detail-value-light
  - .detail-input: texto branco

### 3. Verificar global.scss ✅
- [x] Ajustar estilos de texto para permitir cores personalizadas nos detail-items

## Progresso

### Concluído
- ✅ Análise do código existente
- ✅ Definição do plano com o utilizador
- ✅ Modificar variables.scss
- ✅ Modificar criar-atividade.page.scss
- ✅ Verificar global.scss

