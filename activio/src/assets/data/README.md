# Sistema de Dados Partilhados - Activio

## 📁 Estrutura

```
src/assets/data/
├── badges.json      # Conquistas/badges do app
└── seed-data.json   # Dados iniciais (usuário padrão, atividades exemplo)
```

## 🎯 Como Funciona

### 1. **Arquivos JSON** (Guardados no GitHub)
- Contêm dados **iniciais** e **compartilhados**
- Todos que clonam o projeto recebem estes dados
- Podem ser editados e commitados

### 2. **SQLite** (Local no dispositivo)
- Armazena dados **durante o uso** do app
- Criado a partir dos arquivos JSON na primeira execução
- Dados de cada usuário ficam apenas no seu dispositivo

## 🔄 Fluxo de Dados

```
1. Usuário abre app pela primeira vez
   ↓
2. DataSyncService carrega dados dos arquivos JSON
   ↓
3. Dados são inseridos no SQLite local
   ↓
4. App usa SQLite para operações normais
   ↓
5. Mudanças ficam apenas no dispositivo
```

## 📝 Adicionar Novos Dados

### Adicionar Badge
Edite `badges.json`:
```json
{
  "id": 7,
  "name": "Novo Badge",
  "description": "Descrição do badge",
  "icon": "trophy-outline",
  "requirement_type": "activities_completed",
  "requirement_value": 20,
  "points": 100,
  "category": "atividades"
}
```

### Adicionar Tipo de Atividade
Edite `seed-data.json`:
```json
{
  "name": "Boxe",
  "icon": "accessibility-outline",
  "defaultCaloriesPerHour": 700
}
```

## 🔧 Serviços

### DataSyncService

```typescript
// Carregar dados iniciais (automático na primeira vez)
await dataSyncService.loadInitialData();

// Forçar recarregar dados do JSON
await dataSyncService.loadInitialData(true);

// Resetar para dados iniciais
await dataSyncService.resetToInitialData();

// Exportar dados atuais para JSON
const json = await dataSyncService.exportData();

// Verificar se dados foram carregados
if (dataSyncService.isDataLoaded()) {
  console.log('Dados já inicializados');
}
```

## 🚀 Inicialização

O serviço deve ser chamado no `app.component.ts`:

```typescript
async ngOnInit() {
  await this.dataSyncService.loadInitialData();
}
```

## 💾 Backup e Restauração

### Fazer Backup
```typescript
const data = await dataSyncService.exportData();
// Salvar 'data' em arquivo ou enviar para servidor
```

### Restaurar
1. Edite os arquivos JSON em `assets/data/`
2. Commit e push para GitHub
3. Outros usuários fazem pull
4. Execute: `dataSyncService.resetToInitialData()`

## ⚠️ Importante

- **Dados iniciais**: Compartilhados via GitHub
- **Dados do usuário**: Apenas no dispositivo local
- **Commits**: Só fazer commit de mudanças nos JSON, não do SQLite
- **Sincronização entre dispositivos**: Não implementada (precisa backend)

## 🔐 Gitignore

O arquivo `.gitignore` já deve ignorar:
```
# Databases locais
*.db
*.sqlite
*.sqlite3

# Capacitor/Ionic storage
.ionic/
www/
```

## 📱 Plataformas

- ✅ **Web**: Usa IndexedDB
- ✅ **iOS**: Usa SQLite nativo
- ✅ **Android**: Usa SQLite nativo

Todos recebem dados iniciais dos mesmos arquivos JSON!
