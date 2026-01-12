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
                // Verify user still exists in database
                const dbUser = await this.databaseService.getUserById(storedUser.id);
                if (dbUser) {
                    this.authState.next({
                        isAuthenticated: true,
                        user: dbUser
                    });
                } else {
                    // User deleted from DB, clear storage
                    await this.storage.remove(this.STORAGE_KEY);
                }
            }
        } catch (error) {
            console.error('Error initializing auth state:', error);
            await this.storage.remove(this.STORAGE_KEY);
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

            // Compare passwords
            // IMPORTANTE: Em produção deves usar bcrypt para comparar hashes
            // Por agora compara diretamente (não recomendado para produção real)
            const isValidPassword = user.password_hash === password;

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
            return { success: false, message: 'Erro durante o login. Verifica a tua ligação.' };
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
            let existingUser = null;
            try {
                existingUser = await this.databaseService.getUserByEmail(userData.email);
            } catch (error) {
                // Se der erro ao procurar, assume que não existe (DB pode não estar pronta)
                console.log('Could not check existing user, proceeding with registration:', error);
                existingUser = null;
            }
            
            if (existingUser) {
                return { success: false, message: 'Email já registado' };
            }

            // Create user in database
            // IMPORTANTE: Em produção deves usar bcrypt para hash da password
            const userId = await this.databaseService.createUser({
                ...userData,
                password_hash: userData.password // ATENÇÃO: hash isto em produção!
            });

            // Get the newly created user
            const newUser = await this.databaseService.getUserById(userId);

            if (!newUser) {
                return { success: false, message: 'Erro ao criar utilizador' };
            }

            // Update auth state
            this.authState.next({
                isAuthenticated: true,
                user: newUser
            });

            // Store user session
            await this.storage.set(this.STORAGE_KEY, newUser);

            return { success: true, message: 'Registo realizado com sucesso' };
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, message: 'Erro durante o registo. Tenta novamente.' };
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

            // Update in database
            await this.databaseService.updateUser(currentUser.id!, updates);

            // Get updated user from database
            const updatedUser = await this.databaseService.getUserById(currentUser.id!);

            if (!updatedUser) {
                return { success: false, message: 'Erro ao atualizar perfil' };
            }

            // Update local state
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