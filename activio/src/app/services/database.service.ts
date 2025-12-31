import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

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
    created_at: string;
    updated_at: string;
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
    private db: SQLiteDBConnection;
    private dbName = 'activio.db';

    constructor() {
        this.sqlite = new SQLiteConnection(CapacitorSQLite);
    }

    async initializeDatabase(): Promise<void> {
        try {
            // Criar conexão
            this.db = await this.sqlite.createConnection(
                this.dbName,
                false,
                'no-encryption',
                1,
                false
            );

            // Abrir conexão
            await this.db.open();

            // Criar tabelas
            await this.createTables();

            // Seed inicial
            await this.seedInitialData();

            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Error initializing database:', error);
            throw error;
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

    private async seedInitialData(): Promise<void> {
        // Verificar se já existe dados
        const badgeCount = await this.db.query('SELECT COUNT(*) as count FROM badges');
        if (badgeCount.values?.[0]?.count === 0) {
            await this.seedBadges();
        }

        const userCount = await this.db.query('SELECT COUNT(*) as count FROM users');
        if (userCount.values?.[0]?.count === 0) {
            await this.seedExampleUser();
        }
    }

    private async seedBadges(): Promise<void> {
        const badges = [
            { name: 'Primeiro Passo', description: 'Completou o primeiro treino', icon: '/assets/conquistas/primeiro_passo.svg', requirement_type: 'first_activity', requirement_value: 1, points: 10, category: 'iniciante' },
            { name: 'Sequência de 3 Dias', description: 'Treinou 3 dias seguidos', icon: '/assets/conquistas/3_dias_seguidos.svg', requirement_type: 'streak_days', requirement_value: 3, points: 25, category: 'consistência' },
            { name: 'Sequência de 7 Dias', description: 'Treinou 7 dias seguidos', icon: '/assets/conquistas/7_dias_seguidos.svg', requirement_type: 'streak_days', requirement_value: 7, points: 50, category: 'consistência' },
            { name: 'Sequência de 30 Dias', description: 'Treinou 30 dias seguidos', icon: '/assets/conquistas/30_dias_seguidos.svg', requirement_type: 'streak_days', requirement_value: 30, points: 100, category: 'consistência' },
            { name: '1 Hora de Atividade', description: 'Completou 1 hora de atividade', icon: '/assets/conquistas/1_hora_atividade.svg', requirement_type: 'total_hours', requirement_value: 1, points: 15, category: 'volume' },
            { name: '10 Horas de Atividade', description: 'Completou 10 horas de atividade', icon: '/assets/conquistas/10_horas_atividade.svg', requirement_type: 'total_hours', requirement_value: 10, points: 75, category: 'volume' },
            { name: '100 Horas de Atividade', description: 'Completou 100 horas de atividade', icon: '/assets/conquistas/100_horas_atividade.svg', requirement_type: 'total_hours', requirement_value: 100, points: 200, category: 'volume' },
            { name: '500 Calorias', description: 'Queimou 500 calorias', icon: '/assets/conquistas/500_calorias.svg', requirement_type: 'total_calories', requirement_value: 500, points: 20, category: 'calorias' },
            { name: '1000 Calorias', description: 'Queimou 1000 calorias', icon: '/assets/conquistas/1000_calorias.svg', requirement_type: 'total_calories', requirement_value: 1000, points: 40, category: 'calorias' },
            { name: '5000 Calorias', description: 'Queimou 5000 calorias', icon: '/assets/conquistas/5000_calorias.svg', requirement_type: 'total_calories', requirement_value: 5000, points: 100, category: 'calorias' },
            { name: 'Maratonista', description: 'Completou 5km de corrida', icon: '/assets/conquistas/666_KM.svg', requirement_type: 'running_distance', requirement_value: 5, points: 30, category: 'corrida' },
            { name: 'Meio Maratonista', description: 'Completou 21km de corrida', icon: '/assets/conquistas/meio_maratona.svg', requirement_type: 'running_distance', requirement_value: 21, points: 80, category: 'corrida' },
            { name: 'Maratonista Completo', description: 'Completou 42km de corrida', icon: '/assets/conquistas/maratona_completa.svg', requirement_type: 'running_distance', requirement_value: 42, points: 150, category: 'corrida' },
            { name: 'Força Total', description: 'Levantou 1000kg acumulados', icon: '/assets/conquistas/1000kg.svg', requirement_type: 'weight_lifted', requirement_value: 1000, points: 60, category: 'ginásio' },
            { name: 'Mestre do Fitness', description: 'Alcançou todos os objetivos mensais', icon: '/assets/conquistas/mestre_fitness.svg', requirement_type: 'monthly_goals', requirement_value: 12, points: 300, category: 'mestre' }
        ];

        for (const badge of badges) {
            await this.db.run(
                'INSERT INTO badges (name, description, icon, requirement_type, requirement_value, points, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [badge.name, badge.description, badge.icon, badge.requirement_type, badge.requirement_value, badge.points, badge.category]
            );
        }
    }

    private async seedExampleUser(): Promise<void> {
        // Criar utilizador exemplo
        const userId = await this.createUser({
            name: 'João Silva',
            email: 'joao.silva@email.com',
            password_hash: 'hashed_password_example',
            age: 28,
            height: 175,
            weight: 70,
            goal_weight: 68,
            activity_level: 'Moderado'
        });

        // Adicionar atividades de exemplo
        const activities = [
            {
                user_id: userId,
                date: '2024-12-20',
                time: '07:30',
                type: 'Corrida',
                intensity: 'Alta' as const,
                duration: 0.75,
                calories: 320,
                location: 'Parque da Cidade',
                notes: 'Corrida matinal excelente!',
                favorite: true
            },
            {
                user_id: userId,
                date: '2024-12-19',
                time: '18:00',
                type: 'Ginásio',
                intensity: 'Média' as const,
                duration: 1.5,
                calories: 450,
                location: 'Fitness Center',
                notes: 'Treino de força completo',
                favorite: false
            },
            {
                user_id: userId,
                date: '2024-12-18',
                time: '08:00',
                type: 'Yoga',
                intensity: 'Baixa' as const,
                duration: 1.0,
                calories: 120,
                location: 'Estúdio Local',
                notes: 'Sessão relaxante de yoga',
                favorite: true
            }
        ];

        for (const activity of activities) {
            await this.createActivity(activity);
        }

        // Adicionar registos de peso
        const weightEntries = [
            { user_id: userId, weight: 72, date: '2024-12-01' },
            { user_id: userId, weight: 71.5, date: '2024-12-08' },
            { user_id: userId, weight: 71, date: '2024-12-15' },
            { user_id: userId, weight: 70.5, date: '2024-12-22' },
            { user_id: userId, weight: 70, date: '2024-12-29' }
        ];

        for (const entry of weightEntries) {
            await this.db.run(
                'INSERT INTO weight_entries (user_id, weight, date) VALUES (?, ?, ?)',
                [entry.user_id, entry.weight, entry.date]
            );
        }

        // Adicionar dias de treino da semana atual
        const today = new Date();
        const trainingDays = [
            { day: 1, target: 2.0, actual: 1.5 }, // Monday
            { day: 2, target: 2.5, actual: 2.0 }, // Tuesday
            { day: 3, target: 1.5, actual: 0 },   // Wednesday
            { day: 4, target: 3.0, actual: 0 },   // Thursday
            { day: 5, target: 0, actual: 0 },     // Friday
            { day: 6, target: 3.5, actual: 0 },   // Saturday
            { day: 0, target: 1.5, actual: 1.0 }  // Sunday
        ];

        for (const day of trainingDays) {
            const date = new Date(today);
            date.setDate(today.getDate() - today.getDay() + day.day);
            const dateStr = date.toISOString().split('T')[0];

            await this.db.run(
                'INSERT INTO training_days (user_id, day_of_week, target_hours, actual_hours, date) VALUES (?, ?, ?, ?, ?)',
                [userId, day.day, day.target, day.actual, dateStr]
            );
        }

        // Desbloquear algumas conquistas
        await this.unlockAchievement(userId, 1); // Primeiro Passo
        await this.unlockAchievement(userId, 5); // 1 Hora de Atividade
    }

    // CRUD Operations - Users
    async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
        const result = await this.db.run(
            'INSERT INTO users (name, email, password_hash, age, height, weight, goal_weight, activity_level) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [user.name, user.email, user.password_hash, user.age, user.height, user.weight, user.goal_weight, user.activity_level]
        );
        return result.changes?.lastId || 0;
    }

    async getUserById(id: number): Promise<User | null> {
        const result = await this.db.query('SELECT * FROM users WHERE id = ?', [id]);
        return result.values?.[0] || null;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const result = await this.db.query('SELECT * FROM users WHERE email = ?', [email]);
        return result.values?.[0] || null;
    }

    async updateUser(id: number, updates: Partial<Omit<User, 'id' | 'created_at'>>): Promise<void> {
        const fields = Object.keys(updates);
        const values = Object.values(updates);

        if (fields.length === 0) return;

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const query = `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

        await this.db.run(query, [...values, id]);
    }

    // CRUD Operations - Activities
    async createActivity(activity: Omit<Activity, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
        const result = await this.db.run(
            'INSERT INTO activities (user_id, date, time, type, intensity, duration, calories, location, notes, favorite) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [activity.user_id, activity.date, activity.time, activity.type, activity.intensity, activity.duration, activity.calories, activity.location, activity.notes, activity.favorite ? 1 : 0]
        );

        const activityId = result.changes?.lastId || 0;

        // Atualizar estatísticas
        await this.updateActivityStats(activity.user_id, activity.type, activity.duration, activity.calories);

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
    }

    async deleteActivity(id: number): Promise<void> {
        await this.db.run('DELETE FROM activities WHERE id = ?', [id]);
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
}
