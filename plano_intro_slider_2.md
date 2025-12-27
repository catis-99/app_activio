# Plano para Corrigir Intro Slider 2

## Problemas Identificados:
1. Imagens não estão aparecendo (intro2.svg e lince_sentado.png)
2. Layout não está correto

## Análise dos Assets Disponíveis:
- intro2.svg ✓ (existe)
- lince_sentado.png ✓ (existe)  
- intro3.svg (disponível)
- slide2.svg (disponível)

## Possíveis Causas:
1. Paths incorretos para os assets
2. CSS positioning causando invisibilidade
3. Imagens não sendo servidas corretamente
4. Z-index ou overlap de elementos

## Plano de Ação:

### 1. Verificar e Corrigir Paths
- Confirmar se os paths estão corretos: `assets/intro/intro2.svg`
- Verificar se os assets estão sendo copiados para build

### 2. Revisar CSS de Posicionamento
- Verificar se `.intro-overlay` está posicionado corretamente
- Ajustar `top`, `left`, `transform` se necessário
- Verificar z-index dos elementos

### 3. Testar Alternativas de Assets
- Tentar usar `slide2.svg` como background
- Experimentar diferentes positions para o overlay

### 4. Layout Responsivo
- Verificar se o layout funciona em diferentes tamanhos de tela
- Ajustar proportions conforme necessário

### 5. Backup Plan
- Se problemas persistirem, usar estrutura similar ao intro-slider-1 que funciona
