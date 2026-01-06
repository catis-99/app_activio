import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import {
    DatabaseService,
    User,
    Activity,
    WeightEntry,
    TrainingDay as DBTrainingDay,
    Badge,
    Achievement
} from './database.service';
import { AuthService } from './auth.service';

export interface TrainingDay {
    label: string;
    hours: number;
}

export interface WeightData {
    start: number;
    current: number;
    goal: number;
}

export interface UserProfile {
    name: string;
    age: number;
    height: number;
    email?: string;
    weight?: number;
    goalWeight?: number;
    gender?: string;
    activityLevel?: string;
    birthdate?: string;
}

export interface UserAuth {
    email: string;
    password: string;
    isLoggedIn: boolean;
    registeredAt?: Date;
    lastLogin?: Date;
}

export interface CalorieEntry {
    date: string;
    consumed: number;
    burned: number;
    goal: number;
    meals?: Meal[];
}

export interface Meal {
    name: string;
    calories: number;
    time: string;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface WorkoutDay {
    date: string;
    exercises: Exercise[];
    duration: number;
    caloriesBurned: number;
    completed: boolean;
}

export interface Exercise {
    name: string;
    sets?: number;
    reps?: number;
    duration?: number;
    calories?: number;
}

export interface ProgressEntry {
    date: string;
    weight: number;
    bodyFat?: number;
    muscleMass?: number;
    measurements?: {
        chest?: number;
        waist?: number;
        hips?: number;
        arms?: number;
        legs?: number;
    };
    photos?: string[];
    notes?: string;
}

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private storageReady: Promise<Storage>;
    private dbInitialized = false;

    constructor(
        private storage: Storage,
        private databaseService: DatabaseService,
        private authService: AuthService
    ) {
        this.storageReady = this.initStorage();
        this.initializeDatabase();
    }

    private async initStorage(): Promise<Storage> {
        await this.storage.create();
        return this.storage;
    }

    private async initializeDatabase(): Promise<void> {
        try {
            await this.databaseService.initializeDatabase();
            this.dbInitialized = true;
        } catch (error) {
            console.error('Failed to initialize database:', error);
        }
    }

    private async getStorage(): Promise<Storage> {
        return this.storageReady;
    }

    private getCurrentUserId(): number {
        const user = this.authService.getCurrentUser();
        return user?.id || 1; // Fallback to 1 for demo
    }

    // ===== AUTHENTICATION & REGISTRATION =====

    async register(email: string, password: string, name?: string): Promise<boolean> {
        const result = await this.authService.register({
            name: name || 'Utilizador',
            email,
            password,
            age: 25,
            height: 170,
            weight: 70,
            activity_level: 'Moderado'
        });
        return result.success;
    }

    async login(email: string, password: string): Promise<boolean> {
        const result = await this.authService.login(email, password);
        return result.success;
    }

    async logout(): Promise<void> {
        await this.authService.logout();
    }

    async getCurrentUser(): Promise<string | null> {
        const user = this.authService.getCurrentUser();
        return user?.email || null;
    }

    async isLoggedIn(): Promise<boolean> {
        return this.authService.isAuthenticated();
    }

    // ===== USER PROFILE =====

    async getUserProfile(): Promise<UserProfile> {
        const user = this.authService.getCurrentUser();
        console.log('🔍 DataService.getUserProfile() - user:', user);

        if (user) {
            const profile = {
                name: user.name,
                age: user.age,
                height: user.height,
                email: user.email,
                weight: user.weight,
                goalWeight: user.goal_weight,
                activityLevel: user.activity_level,
                gender: user.gender,
                birthdate: user.birthdate
            };
            console.log('🔍 DataService.getUserProfile() - retornando profile:', profile);
            return profile;
        }

        // Fallback to localStorage for compatibility
        const storage = await this.getStorage();
        const profile = await storage.get('userProfile');
        console.log('🔍 DataService.getUserProfile() - fallback storage:', profile);
        return profile || { name: '', age: 25, height: 170 };
    }

    async saveUserProfile(profile: UserProfile): Promise<void> {
        console.log('💾 DataService.saveUserProfile() - Recebido:', profile);

        const user = this.authService.getCurrentUser();
        console.log('💾 DataService.saveUserProfile() - Current user:', user);

        if (user) {
            const updates = {
                name: profile.name,
                age: profile.age,
                height: profile.height,
                weight: profile.weight,
                goal_weight: profile.goalWeight,
                activity_level: profile.activityLevel as any,
                gender: profile.gender,
                birthdate: profile.birthdate
            };
            console.log('💾 DataService.saveUserProfile() - Atualizando com:', updates);

            await this.authService.updateProfile(updates);
            console.log('💾 DataService.saveUserProfile() - Atualizado com sucesso');
        } else {
            // Fallback to localStorage
            console.log('💾 DataService.saveUserProfile() - Salvando no localStorage');
            const storage = await this.getStorage();
            await storage.set('userProfile', profile);
        }
    }

    // ===== TRAINING DAYS =====

    async getTrainingDays(): Promise<TrainingDay[]> {
        if (!this.dbInitialized) {
            return this.getTrainingDaysFromStorage();
        }

        try {
            const userId = this.getCurrentUserId();
            const days = await this.databaseService.getTrainingDays(userId);

            // Convert database format to app format
            const weekLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
            const trainingData: TrainingDay[] = weekLabels.map((label, index) => {
                const day = days.find(d => d.day_of_week === index);
                return {
                    label,
                    hours: day?.actual_hours || 0
                };
            });

            return trainingData;
        } catch {
            return this.getTrainingDaysFromStorage();
        }
    }

    private async getTrainingDaysFromStorage(): Promise<TrainingDay[]> {
        const storage = await this.getStorage();
        const days = await storage.get('trainingDays');
        return days || [
            { label: 'Seg', hours: 2 },
            { label: 'Ter', hours: 2.5 },
            { label: 'Qua', hours: 1.5 },
            { label: 'Qui', hours: 3 },
            { label: 'Sex', hours: 0 },
            { label: 'Sáb', hours: 3.5 },
            { label: 'Dom', hours: 1.5 }
        ];
    }

    async saveTrainingDays(days: TrainingDay[]): Promise<void> {
        const storage = await this.getStorage();
        await storage.set('trainingDays', days);
    }

    async addTrainingHours(dayLabel: string, hours: number): Promise<void> {
        const days = await this.getTrainingDays();
        const day = days.find(d => d.label === dayLabel);
        if (day) {
            day.hours += hours;
            await this.saveTrainingDays(days);
        }
    }

    // ===== WEIGHT DATA =====

    async getWeightData(): Promise<WeightData> {
        if (!this.dbInitialized) {
            return this.getWeightDataFromStorage();
        }

        try {
            const userId = this.getCurrentUserId();
            const user = this.authService.getCurrentUser();
            const entries = await this.databaseService.getWeightEntries(userId, 10);

            if (entries.length === 0 || !user) {
                return this.getWeightDataFromStorage();
            }

            return {
                start: entries[entries.length - 1]?.weight || user.weight,
                current: entries[0]?.weight || user.weight,
                goal: user.goal_weight || user.weight - 5
            };
        } catch {
            return this.getWeightDataFromStorage();
        }
    }

    private async getWeightDataFromStorage(): Promise<WeightData> {
        const storage = await this.getStorage();
        const data = await storage.get('weightData');
        return data || { start: 68, current: 63, goal: 58 };
    }

    async saveWeightData(data: WeightData): Promise<void> {
        const storage = await this.getStorage();
        await storage.set('weightData', data);
    }

    async updateWeight(current: number): Promise<void> {
        if (this.dbInitialized) {
            const userId = this.getCurrentUserId();
            await this.databaseService.addWeightEntry({
                user_id: userId,
                weight: current,
                date: new Date().toISOString().split('T')[0]
            });
        }

        const data = await this.getWeightData();
        data.current = current;
        await this.saveWeightData(data);
    }

    // ===== CALORIES MANAGEMENT =====

    async getCaloriesForDate(date: string): Promise<CalorieEntry> {
        const storage = await this.getStorage();
        const entry = await storage.get(`calories_${date}`);
        return entry || {
            date,
            consumed: 0,
            burned: 0,
            goal: 2000,
            meals: []
        };
    }

    async saveCaloriesForDate(entry: CalorieEntry): Promise<void> {
        const storage = await this.getStorage();
        await storage.set(`calories_${entry.date}`, entry);
    }

    async addMeal(date: string, meal: Meal): Promise<void> {
        const entry = await this.getCaloriesForDate(date);
        entry.meals = entry.meals || [];
        entry.meals.push(meal);
        entry.consumed += meal.calories;
        await this.saveCaloriesForDate(entry);
    }

    async getCaloriesHistory(days: number = 7): Promise<CalorieEntry[]> {
        const storage = await this.getStorage();
        const history: CalorieEntry[] = [];
        const today = new Date();

        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const entry = await storage.get(`calories_${dateStr}`);
            if (entry) {
                history.push(entry);
            }
        }

        return history;
    }

    // ===== WORKOUT DAYS =====

    async getWorkoutForDate(date: string): Promise<WorkoutDay | null> {
        const storage = await this.getStorage();
        return await storage.get(`workout_${date}`);
    }

    async saveWorkout(workout: WorkoutDay): Promise<void> {
        const storage = await this.getStorage();
        await storage.set(`workout_${workout.date}`, workout);
    }

    async getWorkoutHistory(days: number = 30): Promise<WorkoutDay[]> {
        const storage = await this.getStorage();
        const history: WorkoutDay[] = [];
        const today = new Date();

        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const workout = await storage.get(`workout_${dateStr}`);
            if (workout) {
                history.push(workout);
            }
        }

        return history;
    }

    async completeWorkout(date: string): Promise<void> {
        const workout = await this.getWorkoutForDate(date);
        if (workout) {
            workout.completed = true;
            await this.saveWorkout(workout);
        }
    }

    // ===== PROGRESS TRACKING =====

    async getProgressForDate(date: string): Promise<ProgressEntry | null> {
        const storage = await this.getStorage();
        return await storage.get(`progress_${date}`);
    }

    async saveProgress(progress: ProgressEntry): Promise<void> {
        const storage = await this.getStorage();
        await storage.set(`progress_${progress.date}`, progress);

        // Also save to database if available
        if (this.dbInitialized && progress.weight) {
            const userId = this.getCurrentUserId();
            await this.databaseService.addWeightEntry({
                user_id: userId,
                weight: progress.weight,
                date: progress.date,
                notes: progress.notes
            });
        }
    }

    async getProgressHistory(days: number = 90): Promise<ProgressEntry[]> {
        const storage = await this.getStorage();
        const history: ProgressEntry[] = [];
        const today = new Date();

        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const progress = await storage.get(`progress_${dateStr}`);
            if (progress) {
                history.push(progress);
            }
        }

        return history.sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    }

    async getLatestProgress(): Promise<ProgressEntry | null> {
        const history = await this.getProgressHistory(365);
        return history.length > 0 ? history[history.length - 1] : null;
    }

    // ===== STATISTICS & ANALYTICS =====

    async getWeeklyStats(): Promise<{
        totalWorkouts: number;
        totalCaloriesBurned: number;
        totalCaloriesConsumed: number;
        averageWeight: number;
        workoutStreak: number;
    }> {
        const workouts = await this.getWorkoutHistory(7);
        const calories = await this.getCaloriesHistory(7);
        const progress = await this.getProgressHistory(7);

        const completedWorkouts = workouts.filter(w => w.completed);
        const totalCaloriesBurned = completedWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
        const totalCaloriesConsumed = calories.reduce((sum, c) => sum + c.consumed, 0);
        const averageWeight = progress.length > 0
            ? progress.reduce((sum, p) => sum + p.weight, 0) / progress.length
            : 0;

        return {
            totalWorkouts: completedWorkouts.length,
            totalCaloriesBurned,
            totalCaloriesConsumed,
            averageWeight,
            workoutStreak: this.calculateStreak(workouts)
        };
    }

    private calculateStreak(workouts: WorkoutDay[]): number {
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 365; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            const dateStr = checkDate.toISOString().split('T')[0];

            const workout = workouts.find(w => w.date === dateStr);
            if (workout && workout.completed) {
                streak++;
            } else if (i > 0) {
                break;
            }
        }

        return streak;
    }

    // ===== ACTIVITY STATS =====

    async getActivityStats(): Promise<{ [key: string]: number }> {
        const storage = await this.getStorage();
        const stats = await storage.get('activityStats');
        return stats || {};
    }

    async incrementActivity(activity: string): Promise<void> {
        const storage = await this.getStorage();
        const stats = await this.getActivityStats();
        stats[activity] = (stats[activity] || 0) + 1;
        await storage.set('activityStats', stats);
    }

    // ===== CLEAR DATA =====

    async clearAll(): Promise<void> {
        const storage = await this.getStorage();
        await storage.clear();

        if (this.dbInitialized) {
            await this.databaseService.clearAllData();
        }
    }

    async clearUserData(): Promise<void> {
        const storage = await this.getStorage();
        const currentUser = await this.getCurrentUser();

        if (currentUser) {
            await storage.remove(`user_${currentUser}`);
            await storage.remove('currentUser');
        }

        await storage.remove('userProfile');
        await storage.remove('activityStats');
    }
}

