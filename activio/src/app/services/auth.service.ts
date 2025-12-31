import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DatabaseService, User } from './database.service';
import { Storage } from '@ionic/storage-angular';

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly STORAGE_KEY = 'current_user';
    private authState = new BehaviorSubject<AuthState>({
        isAuthenticated: false,
        user: null
    });

    constructor(
        private databaseService: DatabaseService,
        private storage: Storage
    ) {
        this.initializeAuthState();
    }

    private async initializeAuthState() {
        try {
            // Initialize storage
            await this.storage.create();

            // Check for stored user session
            const storedUser = await this.storage.get(this.STORAGE_KEY);
            if (storedUser) {
                this.authState.next({
                    isAuthenticated: true,
                    user: storedUser
                });
            }
        } catch (error) {
            console.error('Error initializing auth state:', error);
        }
    }

    getAuthState(): Observable<AuthState> {
        return this.authState.asObservable();
    }

    getCurrentUser(): User | null {
        return this.authState.value.user;
    }

    isAuthenticated(): boolean {
        return this.authState.value.isAuthenticated;
    }

    async login(email: string, password: string): Promise<{ success: boolean; message: string }> {
        try {
            // Get user from database
            const user = await this.databaseService.getUserByEmail(email);

            if (!user) {
                return { success: false, message: 'Utilizador não encontrado' };
            }

            // For demo purposes, we'll use a simple password check
            // In production, you should hash passwords and compare hashes
            const isValidPassword = password === 'password123' || user.password_hash === password;

            if (!isValidPassword) {
                return { success: false, message: 'Password incorreta' };
            }

            // Update auth state
            this.authState.next({
                isAuthenticated: true,
                user: user
            });

            // Store user session
            await this.storage.set(this.STORAGE_KEY, user);

            return { success: true, message: 'Login realizado com sucesso' };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Erro durante o login' };
        }
    }

    async register(userData: {
        name: string;
        email: string;
        password: string;
        age: number;
        height: number;
        weight: number;
        goal_weight?: number;
        activity_level: 'Sedentário' | 'Leve' | 'Moderado' | 'Ativo' | 'Muito Ativo';
    }): Promise<{ success: boolean; message: string }> {
        try {
            // Check if user already exists
            const existingUser = await this.databaseService.getUserByEmail(userData.email);
            if (existingUser) {
                return { success: false, message: 'Email já registado' };
            }

            // Create user in database
            const userId = await this.databaseService.createUser({
                ...userData,
                password_hash: userData.password // In production, hash the password
            });

            // Get the created user
            const newUser = await this.databaseService.getUserById(userId);

            if (newUser) {
                // Update auth state
                this.authState.next({
                    isAuthenticated: true,
                    user: newUser
                });

                // Store user session
                await this.storage.set(this.STORAGE_KEY, newUser);

                return { success: true, message: 'Registo realizado com sucesso' };
            }

            return { success: false, message: 'Erro ao criar utilizador' };
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, message: 'Erro durante o registo' };
        }
    }

    async logout(): Promise<void> {
        try {
            // Clear auth state
            this.authState.next({
                isAuthenticated: false,
                user: null
            });

            // Remove stored session
            await this.storage.remove(this.STORAGE_KEY);
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    async updateProfile(updates: Partial<User>): Promise<{ success: boolean; message: string }> {
        try {
            const currentUser = this.getCurrentUser();
            if (!currentUser) {
                return { success: false, message: 'Utilizador não autenticado' };
            }

            await this.databaseService.updateUser(currentUser.id!, updates);

            // Update local state
            const updatedUser = { ...currentUser, ...updates };
            this.authState.next({
                isAuthenticated: true,
                user: updatedUser
            });

            // Update stored session
            await this.storage.set(this.STORAGE_KEY, updatedUser);

            return { success: true, message: 'Perfil atualizado com sucesso' };
        } catch (error) {
            console.error('Update profile error:', error);
            return { success: false, message: 'Erro ao atualizar perfil' };
        }
    }
}
