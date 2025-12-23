# Plano: Liberar layout da página intro-slider-2

## Informações Coletadas:
- Página atual tem estrutura rígida com height: 100vh
- Imagens restritas a container de 55vh de altura
- Conteúdo e footer com padding específico
- Layout dividido em seções fixas

## Problema:
O conteúdo está "preso" a espaços específicos da tela, limitando a flexibilidade visual.

## Plano de Alterações:

### 1. Arquivo a ser editado:
- `activio/src/app/intro-slider-2/intro-slider-2.page.scss`

### 2. Alterações específicas no SCSS:

#### A. Remover restrições de altura do container principal:
- Alterar `height: 100vh` para `min-height: 100vh` (permite crescer se necessário)

#### B. Liberar container das imagens:
- Remover `height: 55vh` e `min-height: 300px`
- Permitir que as imagens ocupem o espaço natural

#### C. Ajustar posicionamento do lince sobreposto:
- Modificar `top: 20%` e `left: 20%` para valores mais flexíveis
- Permitir que o lince se posicione livremente

#### D. Ajustar conteúdo principal:
- Remover `flex: 1` para permitir fluxo natural
- Reduzir padding para dar mais liberdade visual

### 3. Resultado esperado:
- Layout mais fluido e natural
- Imagens não restritas a espaços específicos
- Conteúdo pode "respirar" melhor na tela
- Design mais orgânico e livre

### 4. Passos de implementação:
1. ✅ Editar o SCSS conforme planejado
2. ✅ Testar visualmente as alterações
3. ✅ Ajustar se necessário para manter boa usabilidade

## Alterações Implementadas:
- ✅ **Container principal**: Alterado de `height: 100vh` para `min-height: 100vh`
- ✅ **Container de imagens**: Removido `height: 55vh` e `min-height: 300px`, adicionado `margin-bottom: 2vh`
- ✅ **Lince sobreposto**: Modificado posicionamento (top: 20%→10%, left: 20%→10%), largura (100%→120%) e transform
- ✅ **Conteúdo principal**: Removido `flex: 1`, reduzido padding (5vh 8vw→3vh 6vw), alterado justify-content para flex-start

## Resultado:
A página intro-slider-2 agora tem um layout mais livre e fluido. As imagens não ficam restritas a espaços específicos de 55vh, o lince pode se posicionar de forma mais orgânica, e o conteúdo respira melhor com menos padding. O design é agora mais orgânico e menos "preso" a seções rígidas da tela.


