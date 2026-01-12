import { Injectable } from '@angular/core';

interface MockUser {
    id: number;
    name: string;
    email: string;
    password: string;
    phone?: string;
    age?: number;
    height?: number;
    weight?: number;
}

@Injectable({
    providedIn: 'root'
})
export class MockAuthService {
    private USERS_KEY = 'activio_users';
    private CURRENT_USER_KEY = 'activio_current_user';

    constructor() {
        this.initializeMockData();
    }

    private initializeMockData() {
        // Inicializar com um usuário de teste se não existir
        const users = this.getUsers();
        if (users.length === 0) {
            const testUser: MockUser = {
                id: 1,
                name: 'Utilizador Teste',
                email: 'teste@teste.com',
                password: '123456',
                phone: '912345678',
                age: 25,
                height: 170,
                weight: 70
            };
            this.saveUser(testUser);
            console.log('Mock user created: teste@teste.com / 123456');
        }
    }

    private getUsers(): MockUser[] {
        const usersJson = localStorage.getItem(this.USERS_KEY);
        return usersJson ? JSON.parse(usersJson) : [];
    }

    private saveUsers(users: MockUser[]): void {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }

    private saveUser(user: MockUser): void {
        const users = this.getUsers();
        const existingIndex = users.findIndex(u => u.id === user.id);
        
        if (existingIndex >= 0) {
            users[existingIndex] = user;
        } else {
            user.id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
            users.push(user);
        }
        
        this.saveUsers(users);
    }

    async register(email: string, password: string, name: string): Promise<{ success: boolean; message: string }> {
        try {
            console.log('MockAuth: Registering user', { email, name });
            
            const users = this.getUsers();
            
            // Check if user already exists
            const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (existingUser) {
                console.log('MockAuth: User already exists');
                return { success: false, message: 'Email já registado' };
            }

            // Create new user
            const newUser: MockUser = {
                id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
                name,
                email,
                password, // In production, this should be hashed!
                age: 25,
                height: 170,
                weight: 70
            };

            this.saveUser(newUser);
            console.log('MockAuth: User registered successfully', newUser.id);
            
            return { success: true, message: 'Utilizador registado com sucesso' };
        } catch (error) {
            console.error('MockAuth: Registration error', error);
            return { success: false, message: 'Erro ao registar utilizador' };
        }
    }

    async login(email: string, password: string): Promise<{ success: boolean; message: string; user?: MockUser }> {
        try {
            console.log('MockAuth: Login attempt', { email });
            
            const users = this.getUsers();
            const user = users.find(u => 
                u.email.toLowerCase() === email.toLowerCase() && 
                u.password === password
            );

            if (!user) {
                console.log('MockAuth: Invalid credentials');
                return { success: false, message: 'Email ou password incorretos' };
            }

            // Save current user session
            localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
            console.log('MockAuth: Login successful', user.id);
            
            return { success: true, message: 'Login realizado com sucesso', user };
        } catch (error) {
            console.error('MockAuth: Login error', error);
            return { success: false, message: 'Erro ao fazer login' };
        }
    }

    async logout(): Promise<void> {
        localStorage.removeItem(this.CURRENT_USER_KEY);
        console.log('MockAuth: User logged out');
    }

    getCurrentUser(): MockUser | null {
        const userJson = localStorage.getItem(this.CURRENT_USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    }

    isAuthenticated(): boolean {
        return this.getCurrentUser() !== null;
    }

    async getUserByEmail(email: string): Promise<MockUser | null> {
        const users = this.getUsers();
        return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    }

    async updateUser(updates: Partial<MockUser>): Promise<void> {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            console.error('MockAuth: No user logged in to update');
            return;
        }

        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex >= 0) {
            // Update user in array
            users[userIndex] = { ...users[userIndex], ...updates };
            this.saveUsers(users);
            
            // Update current user session
            localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(users[userIndex]));
            console.log('MockAuth: User updated successfully', users[userIndex]);
        }
    }
}
