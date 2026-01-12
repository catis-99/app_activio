import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { LocalStorageService } from './local-storage.service';

// Interfaces para as entidades da base de dados
export interface User {
    id?: number;
    name: string;
    email: string;
    password_hash: string;
    age: number;
    height: number;
    weight: number;
    goal_weight?: number;
    activity_level: 'Sedentário' | 'Leve' | 'Moderado' | 'Ativo' | 'Muito Ativo';
    gender?: string;
    birthdate?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Activity {
    id?: number;
    user_id: number;
    date: string;
    time: string;
    type: string;
    intensity: 'Baixa' | 'Média' | 'Alta';
    duration: number;
    calories: number;
    location: string;
    notes: string;
    favorite: boolean;
    created_at: string;
    updated_at: string;
}

export interface Badge {
    id?: number;
    name: string;
    description: string;
    icon: string;
    requirement_type: string;
    requirement_value: number;
    points: number;
    category: string;
    created_at: string;
}

export interface Achievement {
    id?: number;
    user_id: number;
    badge_id: number;
    unlocked_at: string;
    progress: number;
    is_completed: boolean;
}

export interface TrainingDay {
    id?: number;
    user_id: number;
    day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
    target_hours: number;
    actual_hours: number;
    date: string;
    created_at: string;
    updated_at: string;
}

export interface WeightEntry {
    id?: number;
    user_id: number;
    weight: number;
    date: string;
    notes?: string;
    created_at: string;
}

export interface ActivityStats {
    id?: number;
    user_id: number;
    activity_type: string;
    total_sessions: number;
    total_hours: number;
    total_calories: number;
    best_session?: number;
    last_session: string;
    created_at: string;
    updated_at: string;
}

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {
    private sqlite: SQLiteConnection;
    private db!: SQLiteDBConnection;
    private dbName = 'activio.db';
    private dbReady: Promise<void>;
    private isInitialized: boolean = false;
    private autoSyncEnabled: boolean = true; // Sync automático habilitado

    private getPlatform(): string {
        const win = window as any;
        if (win.Capacitor) {
            return win.Capacitor.getPlatform();
        }
        return 'web';
    }

    constructor(private localStorageService: LocalStorageService) {
        this.sqlite = new SQLiteConnection(CapacitorSQLite);
        this.dbReady = this.initializeDatabase();
    }

    async initializeDatabase(): Promise<void> {
        try {
            // Detectar plataforma
            const platform = this.getPlatform();
            console.log('Initializing database on platform:', platform);

            if (platform === 'web') {
                // Configuração específica para web
                const jeepEl = document.querySelector('jeep-sqlite');
                if (!jeepEl) {
                    console.error('jeep-sqlite element not found in DOM!');
                    throw new Error('jeep-sqlite element not found! Make sure it is added to index.html: <jeep-sqlite></jeep-sqlite>');
                }

                // Esperar que o custom element esteja definido
                await customElements.whenDefined('jeep-sqlite');
                console.log('jeep-sqlite custom element defined');

                // Inicializar o web store
                await this.sqlite.initWebStore();
                console.log('Web store initialized');
            }

            // Verificar se a conexão já existe
            const isConnection = await this.sqlite.isConnection(this.dbName, false);

            if (isConnection.result) {
                // Recuperar conexão existente
                console.log('Retrieving existing connection');
                this.db = await this.sqlite.retrieveConnection(this.dbName, false);
            } else {
                // Criar nova conexão
                console.log('Creating new connection');
                this.db = await this.sqlite.createConnection(
                    this.dbName,
                    false,
                    'no-encryption',
                    1,
                    false
                );
            }

            // Abrir conexão
            await this.db.open();
            console.log('Database connection opened');

            // Criar tabelas
            await this.createTables();
            console.log('Tables created');

            // Executar migrações
            await this.runMigrations();
            console.log('Migrations completed');

            // Salvar mudanças na web
            if (platform === 'web') {
                await this.sqlite.saveToStore(this.dbName);
                console.log('Database saved to web store');
            }

            this.isInitialized = true;
            console.log('✅ Database initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing database:', error);
            this.isInitialized = false;
            throw error;
        }
    }

    async saveChanges(): Promise<void> {
        const platform = this.getPlatform();
        if (platform === 'web' && this.isInitialized) {
            try {
                await this.sqlite.saveToStore(this.dbName);
            } catch (error) {
                console.error('Error saving to web store:', error);
            }
        }
    }

    private async ensureDbReady(): Promise<void> {
        if (!this.isInitialized) {
            await this.dbReady;
        }
    }

    private async createTables(): Promise<void> {
        const tables = [
            // Tabela de utilizadores
            `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        age INTEGER NOT NULL,
        height REAL NOT NULL,
        weight REAL NOT NULL,
        goal_weight REAL,
        activity_level TEXT CHECK(activity_level IN ('Sedentário', 'Leve', 'Moderado', 'Ativo', 'Muito Ativo')) DEFAULT 'Moderado',
        gender TEXT,
        birthdate TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,

            // Tabela de atividades
            `CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        type TEXT NOT NULL,
        intensity TEXT CHECK(intensity IN ('Baixa', 'Média', 'Alta')) DEFAULT 'Média',
        duration REAL NOT NULL,
        calories INTEGER NOT NULL,
        location TEXT,
        notes TEXT,
        favorite BOOLEAN DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )`,

            // Tabela de badges/conquistas disponíveis
            `CREATE TABLE IF NOT EXISTS badges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        icon TEXT NOT NULL,
        requirement_type TEXT NOT NULL,
        requirement_value REAL NOT NULL,
        points INTEGER DEFAULT 0,
        category TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,

            // Tabela de conquistas desbloqueadas
            `CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        badge_id INTEGER NOT NULL,
        unlocked_at TEXT DEFAULT CURRENT_TIMESTAMP,
        progress REAL DEFAULT 0,
        is_completed BOOLEAN DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (badge_id) REFERENCES badges (id) ON DELETE CASCADE,
        UNIQUE(user_id, badge_id)
      )`,

            // Tabela de dias de treino
            `CREATE TABLE IF NOT EXISTS training_days (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        day_of_week INTEGER NOT NULL CHECK(day_of_week >= 0 AND day_of_week <= 6),
        target_hours REAL NOT NULL,
        actual_hours REAL DEFAULT 0,
        date TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        UNIQUE(user_id, date, day_of_week)
      )`,

            // Tabela de registos de peso
            `CREATE TABLE IF NOT EXISTS weight_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        weight REAL NOT NULL,
        date TEXT NOT NULL,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        UNIQUE(user_id, date)
      )`,

            // Tabela de estatísticas por tipo de atividade
            `CREATE TABLE IF NOT EXISTS activity_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        activity_type TEXT NOT NULL,
        total_sessions INTEGER DEFAULT 0,
        total_hours REAL DEFAULT 0,
        total_calories INTEGER DEFAULT 0,
        best_session REAL,
        last_session TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        UNIQUE(user_id, activity_type)
      )`
        ];

        // Índices para performance
        const indexes = [
            'CREATE INDEX IF NOT EXISTS idx_activities_user_date ON activities(user_id, date)',
            'CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type)',
            'CREATE INDEX IF NOT EXISTS idx_training_days_user_date ON training_days(user_id, date)',
            'CREATE INDEX IF NOT EXISTS idx_weight_entries_user_date ON weight_entries(user_id, date)',
            'CREATE INDEX IF NOT EXISTS idx_achievements_user ON achievements(user_id)',
            'CREATE INDEX IF NOT EXISTS idx_activity_stats_user ON activity_stats(user_id)'
        ];

        // Executar criação das tabelas
        for (const table of tables) {
            await this.db.execute(table);
        }

        // Executar criação dos índices
        for (const index of indexes) {
            await this.db.execute(index);
        }
    }

    private async runMigrations(): Promise<void> {
        try {
            // Migração: adicionar gender e birthdate à tabela users
            // Verificar se as colunas já existem
            const tableInfo = await this.db.query('PRAGMA table_info(users)');
            const columns = tableInfo.values?.map((row: any) => row.name) || [];

            if (!columns.includes('gender')) {
                await this.db.execute('ALTER TABLE users ADD COLUMN gender TEXT');
                console.log('Coluna gender adicionada');
            }

            if (!columns.includes('birthdate')) {
                await this.db.execute('ALTER TABLE users ADD COLUMN birthdate TEXT');
                console.log('Coluna birthdate adicionada');
            }
        } catch (error) {
            console.error('Erro nas migrações:', error);
        }
    }






    // CRUD Operations - Users
    async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
        await this.ensureDbReady();
        const result = await this.db.run(
            'INSERT INTO users (name, email, password_hash, age, height, weight, goal_weight, activity_level) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [user.name, user.email, user.password_hash, user.age, user.height, user.weight, user.goal_weight, user.activity_level]
        );
        await this.saveChanges();
        return result.changes?.lastId || 0;
    }

    async getUserById(id: number): Promise<User | null> {
        await this.ensureDbReady();
        const result = await this.db.query('SELECT * FROM users WHERE id = ?', [id]);
        if (!result.values || result.values.length === 0) {
            return null;
        }
        return result.values[0] || null;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        await this.ensureDbReady();
        // Usar LOWER() para pesquisa case-insensitive
        const result = await this.db.query('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email]);
        // Garantir que retornamos null quando não há resultados
        if (!result.values || result.values.length === 0) {
            return null;
        }
        return result.values[0] || null;
    }

    async updateUser(id: number, updates: Partial<Omit<User, 'id' | 'created_at'>>): Promise<void> {
        const fields = Object.keys(updates);
        const values = Object.values(updates);

        if (fields.length === 0) return;

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const query = `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

        await this.db.run(query, [...values, id]);
        await this.saveChanges();
    }

    // CRUD Operations - Activities
    async createActivity(activity: Omit<Activity, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
        await this.ensureDbReady();
        const result = await this.db.run(
            'INSERT INTO activities (user_id, date, time, type, intensity, duration, calories, location, notes, favorite) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [activity.user_id, activity.date, activity.time, activity.type, activity.intensity, activity.duration, activity.calories, activity.location, activity.notes, activity.favorite ? 1 : 0]
        );

        const activityId = result.changes?.lastId || 0;

        // Atualizar estatísticas
        await this.updateActivityStats(activity.user_id, activity.type, activity.duration, activity.calories);

        await this.saveChanges();
        return activityId;
    }

    async getActivities(userId: number, limit?: number, offset?: number): Promise<Activity[]> {
        let query = 'SELECT * FROM activities WHERE user_id = ? ORDER BY date DESC, time DESC';
        const params: any[] = [userId];

        if (limit) {
            query += ' LIMIT ?';
            params.push(limit);
        }

        if (offset) {
            query += ' OFFSET ?';
            params.push(offset);
        }

        const result = await this.db.query(query, params);
        return result.values || [];
    }

    async getActivityById(id: number): Promise<Activity | null> {
        const result = await this.db.query('SELECT * FROM activities WHERE id = ?', [id]);
        return result.values?.[0] || null;
    }

    async updateActivity(id: number, updates: Partial<Omit<Activity, 'id' | 'created_at'>>): Promise<void> {
        const fields = Object.keys(updates);
        const values = Object.values(updates);

        if (fields.length === 0) return;

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const query = `UPDATE activities SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

        await this.db.run(query, [...values, id]);
        await this.saveChanges();
    }

    async deleteActivity(id: number): Promise<void> {
        await this.db.run('DELETE FROM activities WHERE id = ?', [id]);
        await this.saveChanges();
    }

    // Activity Statistics
    private async updateActivityStats(userId: number, activityType: string, duration: number, calories: number): Promise<void> {
        // Verificar se já existe estatística para este tipo
        const existing = await this.db.query(
            'SELECT * FROM activity_stats WHERE user_id = ? AND activity_type = ?',
            [userId, activityType]
        );

        if (existing.values && existing.values.length > 0) {
            // Atualizar estatísticas existentes
            const stats = existing.values[0];
            await this.db.run(
                `UPDATE activity_stats SET
          total_sessions = total_sessions + 1,
          total_hours = total_hours + ?,
          total_calories = total_calories + ?,
          best_session = MAX(best_session, ?),
          last_session = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
                [duration, calories, duration, new Date().toISOString(), stats.id]
            );
        } else {
            // Criar nova estatística
            await this.db.run(
                'INSERT INTO activity_stats (user_id, activity_type, total_sessions, total_hours, total_calories, best_session, last_session) VALUES (?, ?, 1, ?, ?, ?, ?)',
                [userId, activityType, duration, calories, duration, new Date().toISOString()]
            );
            await this.saveChanges();
        }

    }

    async getActivityStats(userId: number): Promise<ActivityStats[]> {
        const result = await this.db.query('SELECT * FROM activity_stats WHERE user_id = ?', [userId]);
        return result.values || [];
    }

    // Training Days
    async getTrainingDays(userId: number, weekStart?: string): Promise<TrainingDay[]> {
        let query = 'SELECT * FROM training_days WHERE user_id = ?';
        const params: any[] = [userId];

        if (weekStart) {
            query += ' AND date >= ?';
            params.push(weekStart);
        }

        query += ' ORDER BY date ASC';

        const result = await this.db.query(query, params);
        return result.values || [];
    }

    async updateTrainingDay(userId: number, dayOfWeek: number, date: string, actualHours: number): Promise<void> {
        await this.db.run(
            'UPDATE training_days SET actual_hours = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND day_of_week = ? AND date = ?',
            [actualHours, userId, dayOfWeek, date]
        );
    }

    // Weight Entries
    async getWeightEntries(userId: number, limit?: number): Promise<WeightEntry[]> {
        let query = 'SELECT * FROM weight_entries WHERE user_id = ? ORDER BY date DESC';
        const params: any[] = [userId];

        if (limit) {
            query += ' LIMIT ?';
            params.push(limit);
        }

        const result = await this.db.query(query, params);
        return result.values || [];
    }

    async addWeightEntry(entry: Omit<WeightEntry, 'id' | 'created_at'>): Promise<number> {
        const result = await this.db.run(
            'INSERT INTO weight_entries (user_id, weight, date, notes) VALUES (?, ?, ?, ?)',
            [entry.user_id, entry.weight, entry.date, entry.notes]
        );
        return result.changes?.lastId || 0;
    }

    // Achievements/Badges
    async getBadges(): Promise<Badge[]> {
        const result = await this.db.query('SELECT * FROM badges ORDER BY points ASC');
        return result.values || [];
    }

    async getUserAchievements(userId: number): Promise<Achievement[]> {
        const result = await this.db.query(
            `SELECT a.*, b.name, b.description, b.icon, b.points
       FROM achievements a
       JOIN badges b ON a.badge_id = b.id
       WHERE a.user_id = ?
       ORDER BY a.unlocked_at DESC`,
            [userId]
        );
        return result.values || [];
    }

    async unlockAchievement(userId: number, badgeId: number): Promise<void> {
        await this.db.run(
            'INSERT OR REPLACE INTO achievements (user_id, badge_id, progress, is_completed) VALUES (?, ?, 100, 1)',
            [userId, badgeId]
        );
    }

    async insertBadge(badge: Omit<Badge, 'id'>): Promise<number> {
        const result = await this.db.run(
            `INSERT INTO badges (name, description, icon, requirement_type, requirement_value, points, category, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                badge.name,
                badge.description,
                badge.icon,
                badge.requirement_type,
                badge.requirement_value,
                badge.points,
                badge.category,
                badge.created_at || new Date().toISOString()
            ]
        );
        return result.changes?.lastId || 0;
    }

    async getBadgeById(id: number): Promise<Badge | null> {
        const result = await this.db.query('SELECT * FROM badges WHERE id = ?', [id]);
        return result.values?.[0] || null;
    }

    async getAllBadges(): Promise<Badge[]> {
        const result = await this.db.query('SELECT * FROM badges ORDER BY points ASC');
        return result.values || [];
    }

    // Utility methods
    async closeConnection(): Promise<void> {
        if (this.db) {
            await this.sqlite.closeConnection(this.dbName, false);
        }
    }

    async clearAllData(): Promise<void> {
        const tables = ['activities', 'achievements', 'training_days', 'weight_entries', 'activity_stats'];
        for (const table of tables) {
            await this.db.execute(`DELETE FROM ${table}`);
        }
    }

    // ==================== SYNC COM LOCAL STORAGE ====================

    /**
     * Habilita ou desabilita o sync automático
     */
    setAutoSync(enabled: boolean): void {
        this.autoSyncEnabled = enabled;
        console.log(`Sync automático: ${enabled ? 'ATIVADO' : 'DESATIVADO'}`);
    }

    /**
     * Sincroniza TODAS as atividades do SQLite para o LocalStorage
     */
    async syncToLocalStorage(): Promise<void> {
        try {
            console.log('🔄 Iniciando sync SQLite → LocalStorage...');

            // Sincronizar atividades (assumindo user_id = 1)
            const activities = await this.getActivities(1);
            await this.localStorageService.saveActivities(activities);

            // Sincronizar usuário (assumindo user_id = 1)
            const user = await this.getUserById(1);
            if (user) {
                await this.localStorageService.saveUser(user);
            }

            // Sincronizar histórico de peso
            const weightHistory = await this.getWeightEntries(1);
            await this.localStorageService.saveWeightHistory(weightHistory);

            console.log('✅ Sync completo!');
        } catch (error) {
            console.error('❌ Erro no sync:', error);
            throw error;
        }
    }

    /**
     * Restaura dados do LocalStorage para o SQLite
     */
    async restoreFromLocalStorage(): Promise<void> {
        try {
            console.log('🔄 Restaurando dados do LocalStorage...');

            // Verificar se há dados
            if (!this.localStorageService.hasData()) {
                console.log('⚠️ Nenhum dado no LocalStorage');
                return;
            }

            // Restaurar atividades
            const activities = await this.localStorageService.getActivities();
            for (const activity of activities) {
                // Verifica se já existe antes de inserir
                const exists = await this.getActivityById(activity.id!);
                if (!exists) {
                    await this.createActivity(activity);
                }
            }

            // Restaurar usuário
            const user = await this.localStorageService.getUser();
            if (user) {
                const existingUser = await this.getUserById(user.id!);
                if (!existingUser) {
                    await this.createUser(user);
                }
            }

            console.log('✅ Dados restaurados!');
        } catch (error) {
            console.error('❌ Erro ao restaurar:', error);
            throw error;
        }
    }

    /**
     * Cria um backup completo em formato JSON
     */
    async createBackup(): Promise<string> {
        return await this.localStorageService.createBackup();
    }

    /**
     * Restaura dados de um backup JSON
     */
    async restoreBackup(backupJson: string): Promise<void> {
        await this.localStorageService.restoreBackup(backupJson);
        // Após restaurar no LocalStorage, sincroniza para o SQLite
        await this.restoreFromLocalStorage();
    }

    /**
     * Download do backup como arquivo
     */
    async downloadBackup(): Promise<void> {
        // Primeiro sincroniza dados atuais
        await this.syncToLocalStorage();
        // Depois faz o download
        await this.localStorageService.downloadBackup();
    }

    /**
     * Informações sobre o armazenamento
     */
    getStorageInfo() {
        return this.localStorageService.getStorageSize();
    }

    /**
     * Última data de sincronização
     */
    getLastSyncDate(): Date | null {
        return this.localStorageService.getLastSync();
    }
}

