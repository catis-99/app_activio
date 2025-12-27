# Plano de Adaptação da Home Page com home.png

## Análise do Estado Atual
- A home page atual tem um design limpo com cards de informação, categorias e atividades
- O arquivo home.png existe em assets/ e precisa ser integrado
- Outras páginas do app já usam imagens usando `<img src="assets/...">`

## Estratégia de Integração

### Opção 1: Hero Image Section (RECOMENDADA)
- Adicionar uma seção hero no topo do conteúdo com a imagem home.png
- Manter o design responsivo e limpo
- Posicionar acima dos cards de informação

### Opção 2: Background Image para Info Cards
- Usar a imagem como background sutil para a seção de cards
- Manter a legibilidade do texto

### Opção 3: Imagem de Destaque no Header
- Adicionar a imagem no header como logo/branding

## Plano de Implementação (Opção 1 - Hero Image)

### 1. Modificações no HTML (home.page.html)
- Adicionar seção hero após o ion-header e antes dos info-cards
- Incluir a imagem com styling apropriado
- Manter toda a estrutura existente

### 2. Modificações no SCSS (home.page.scss)
- Adicionar estilos para a seção hero
- Garantir responsividade
- Manter consistência com o design atual

### 3. Estrutura Proposta:
```html
<ion-header>...</ion-header>

<ion-content [fullscreen]="true">
  <!-- Hero Section com home.png -->
  <div class="hero-section">
    <img src="assets/home.png" alt="Activio Home" class="hero-image">
  </div>
  
  <div class="home-container">
    <!-- Resto do conteúdo existente -->
  </div>
</ion-content>
```

## Benefícios da Solução
- Mantém toda a funcionalidade existente
- Adiciona elemento visual atrativo
- Segue padrões do app
- Design responsivo
- Fácil implementação

## Status - COMPLETO ✅
- ✅ Análise do código atual
- ✅ Definição da estratégia  
- ✅ Recriação completa da home page baseada na estrutura da imagem home.png
- ✅ Tema preto implementado (#000000 fundo, #1a1a1a cards)
- ✅ Verde usado para coerência visual (#22c55e)
- ✅ Header "Activio" removido
- ✅ "Olá, tudo bem?" no topo com botão notificações à direita
- ✅ Dois cards principais: "Workout Days" e "Calorias Queimadas"
- ✅ Card "Criar Atividade" simplificado (sem subtexto, botão + à direita)
- ✅ Calendário com pontinhos verdes por baixo dos dias ativos
- ✅ Navegação verde clara: home, progresso, +, estatísticas, perfil
- ✅ Imagem home.png removida (apenas para análise de estrutura)
- ✅ Validação da implementação

## Implementação Final ✅
A home page foi **completamente recriada** seguindo exatamente as especificações fornecidas:

### Características Implementadas:
- **Layout Otimizado**: 
  - Header "Olá, tudo bem?" no topo (sem "Activio")
  - Botão de notificações à direita (cor verde)
  - Subtitle "Vamos treinar hoje?" abaixo
- **Tema Preto**: Fundo preto (#000000) com cards cinza escuro (#1a1a1a)
- **Verde para Coerência**: Gradientes verdes (#22c55e) em todos os elementos ativos
- **Dois Cards Principais**: 
  - "Workout Days" - 5 (Esta semana) - ícone calendário
  - "Calorias Queimadas" - 1,850 kcal (hoje) - ícone chama
- **Card Criar Atividade**: Layout simplificado, apenas título + botão + verde à direita
- **Calendário Avançado**: 
  - Dias com texto acima e pontinho verde por baixo
  - Dias ativos: texto branco + pontinho verde
  - Dias inativos: texto cinza + pontinho transparente
- **Navegação Verde Clara**: 5 botões na ordem: Home, Progresso, +, Estatísticas, Perfil
- **Design Limpo**: Layout minimalista e organizado conforme especificações
