import { Injectable } from '@angular/core';

export interface Translation {
    [key: string]: string | string[] | Translation;
}

export interface LanguageData {
    [lang: string]: Translation;
}

@Injectable({
    providedIn: 'root'
})
export class I18nService {
    private readonly LANGUAGE_KEY = 'appLanguage';
    private currentLanguage = 'pt'; // padrão é português

    // Dados de tradução
    private translations: LanguageData = {
        pt: {
            // Navegação
            nav: {
                home: 'Home',
                progresso: 'Progresso',
                conquistas: 'Conquistas',
                perfil: 'Perfil'
            },

            // Home
            home: {
                welcome: 'Bem vinda,',
                workoutDays: 'Dias de Treino',
                burnedCalories: 'Calorias Queimadas',
                createActivity: 'Criar atividade',
                activitySummary: 'Resumo de Atividade',
                week: 'Semana',
                month: 'Mês',
                thisWeek: 'Esta Semana',
                december: 'Dezembro'
            },

            // Calendário e Dias
            calendario: {
                days: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                thisWeek: 'Esta Semana'
            },

            // Progresso
            progresso: {
                title: 'Progresso',
                favoriteActivities: 'Atividades Favoritas',
                activitiesByMonth: 'Atividades por mês',
                trainedTime: 'Tempo Treinado',
                week: 'Semana',
                hours: 'Horas',
                peso: 'Peso',
                semana1: 'Semana 1',
                semana2: 'Semana 2',
                semana3: 'Semana 3',
                semana4: 'Semana 4'
            },

            // Conquistas
            conquistas: {
                title: 'Conquistas',
                totalEarned: 'Total conquistadas',
                recentActivity: 'Atividade recente',
                viewAll: 'Ver todas'
            },

            // Perfil
            profile: {
                title: 'Perfil',
                editProfile: 'Editar Perfil',
                edit: 'Editar',
                name: 'Nome',
                height: 'Altura',
                currentWeight: 'Peso atual',
                goalWeight: 'Peso objetivo',
                age: 'Idade',
                weight: 'Peso',
                account: 'Conta',
                personalInfo: 'Informação Pessoal',
                achievements: 'Conquistas',
                history: 'Histórico',
                progress: 'Progresso',
                others: 'Outros',
                contacts: 'Contactos',
                privacyPolicy: 'Política de Privacidade',
                settings: 'Configurações'
            },

            // Configurações
            settings: {
                title: 'Configurações',
                theme: 'Tema',
                darkLightMode: 'Modo escuro/claro',
                notifications: 'Notificações',
                popups: 'Pop-ups',
                dailySummary: 'Resumo diário',
                weeklySummary: 'Resumo semanal',
                language: 'Idioma',
                information: 'Informações',
                developedBy: 'Desenvolvida por alunos',
                forDiscipline: 'para a disciplina de SMINT',
                portuguese: 'Português',
                english: 'Inglês'
            },

            // Criar Atividade
            criarAtividade: {
                title: 'Criar Atividade',
                back: 'Voltar',
                activityType: 'Tipo de Atividade',
                duration: 'Duração',
                date: 'Data',
                notes: 'Notas',
                create: 'Criar',
                time: 'Horário',
                schedule: 'Agendar',
                details: 'Detalhes',
                chooseActivity: 'Escolher atividade',
                intensity: 'Intensidade',
                calories: 'Calorias',
                location: 'Local',
                save: 'Guardar',
                update: 'Atualizar',
                close: 'Fechar'
            },

            // Lista de Atividades
            listaAtividades: {
                title: 'Minhas Atividades',
                emptyTitle: 'Nenhuma atividade ainda',
                emptyDescription: 'Comece a criar atividades para ver seu progresso aqui',
                noActivities: 'Nenhuma atividade encontrada',
                allActivities: 'Todas as Atividades',
                intensity: 'Intensidade'
            },

            // Registro
            registro: {
                title: 'Olá!',
                createAccount: 'Criar Conta',
                name: 'Nome Completo',
                phone: 'Telemóvel',
                email: 'Email',
                password: 'Palavra Passe',
                confirmPassword: 'Confirmar palavra passe',
                haveAccount: 'Já tem conta?',
                loginHere: 'Entrar aqui',
                privacyPolicy: 'Política de Privacidade',
                termsOfUse: 'Termos de Utilização',
                termsAccept: 'Ao continuar, aceita a nossa',
                and: 'e os'
            },

            // Login
            login: {
                title: 'Olá,',
                subtitle: 'Bem-vindo de novo',
                email: 'Email',
                password: 'Palavra Passe',
                forgotPassword: 'Esqueceu a sua palavra passe?',
                login: 'Iniciar Sessão',
                noAccount: 'Ainda não tem conta?',
                register: 'Registar'
            },

            // Completar Perfil
            completarperfil: {
                title: 'Completar Perfil',
                subtitle: 'Adicione suas informações para personalizar sua experiência',
                gender: 'Gênero',
                chooseGender: 'Escolher gênero',
                male: 'Masculino',
                female: 'Feminino',
                other: 'Outro',
                preferNotToSay: 'Prefiro não informar',
                age: 'Idade',
                birthdate: 'Data de nascimento',
                height: 'Altura',
                weight: 'Peso',
                goalWeight: 'Peso objetivo',
                save: 'Salvar',
                next: 'Próximo',
                back: 'Voltar'
            },

            // Bem-vindo
            welcome: {
                title: 'Activio',
                subtitle: 'Sua jornada de fitness começa aqui',
                getStarted: 'Começar',
                haveAccount: 'Já tem conta?',
                login: 'Entrar'
            },

            // Intro Slider
            intro: {
                slide1: {
                    title: 'Bem-vinda ao Activio',
                    description: 'Sua companion pessoal para uma vida mais ativa e saudável'
                },
                slide2: {
                    title: 'Acompanhe seu progresso',
                    description: 'Monitore suas atividades e veja como evolui dia a dia'
                },
                slide3: {
                    title: 'Alcance seus objetivos',
                    description: 'Defina metas e conquiste medalhas ao longo do caminho'
                },
                next: 'Próximo',
                previous: 'Anterior',
                getStarted: 'Começar'
            },



            // Atividades
            atividades: {
                football: 'Futebol',
                caminhar: 'Caminhar',
                saltarCord: 'Saltar à corda',
                ciclismo: 'Ciclismo',
                atletismo: 'Atletismo',
                ginasio: 'Ginásio',
                natacao: 'Natação',
                yoga: 'Yoga'
            },

            // Intensidade
            intensidade: {
                baixa: 'Baixa',
                media: 'Média',
                alta: 'Alta',
                todas: 'Todas'
            },

            // Peso
            peso: {
                title: 'Peso',
                inicio: 'Início',
                atual: 'Atual',
                objetivo: 'Objetivo'
            },

            // Sucesso de Registro
            sucessoRegisto: {
                title: 'Bem-vinda,',
                readyMessage: 'Está tudo pronto! Vamos alcançar os teus objetivos juntos.',
                buttonText: 'Começar'
            }
        },

        en: {
            // Navigation
            nav: {
                home: 'Home',
                progresso: 'Progress',
                conquistas: 'Achievements',
                perfil: 'Profile'
            },

            // Home
            home: {
                welcome: 'Welcome,',
                workoutDays: 'Workout Days',
                burnedCalories: 'Burned Calories',
                createActivity: 'Create activity',
                activitySummary: 'Activity Summary',
                week: 'Week',
                month: 'Month',
                thisWeek: 'This Week',
                december: 'December'
            },

            // Calendário e Dias
            calendario: {
                days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                thisWeek: 'This Week'
            },

            // Progress
            progresso: {
                title: 'Progress',
                favoriteActivities: 'Favorite Activities',
                activitiesByMonth: 'Activities by month',
                trainedTime: 'Trained Time',
                week: 'Week',
                hours: 'Hours',
                peso: 'Weight',
                semana1: 'Week 1',
                semana2: 'Week 2',
                semana3: 'Week 3',
                semana4: 'Week 4'
            },

            // Achievements
            conquistas: {
                title: 'Achievements',
                totalEarned: 'Total earned',
                recentActivity: 'Recent activity',
                viewAll: 'View all'
            },

            // Profile
            profile: {
                title: 'Profile',
                editProfile: 'Edit Profile',
                edit: 'Edit',
                name: 'Name',
                height: 'Height',
                currentWeight: 'Current weight',
                goalWeight: 'Goal weight',
                age: 'Age',
                weight: 'Weight',
                account: 'Account',
                personalInfo: 'Personal Information',
                achievements: 'Achievements',
                history: 'History',
                progress: 'Progress',
                others: 'Others',
                contacts: 'Contacts',
                privacyPolicy: 'Privacy Policy',
                settings: 'Settings'
            },

            // Settings
            settings: {
                title: 'Settings',
                theme: 'Theme',
                darkLightMode: 'Dark/Light mode',
                notifications: 'Notifications',
                popups: 'Pop-ups',
                dailySummary: 'Daily summary',
                weeklySummary: 'Weekly summary',
                language: 'Language',
                information: 'Information',
                developedBy: 'Developed by students',
                forDiscipline: 'for the SMINT discipline',
                portuguese: 'Portuguese',
                english: 'English'
            },

            // Create Activity
            criarAtividade: {
                title: 'Create Activity',
                back: 'Back',
                activityType: 'Activity Type',
                duration: 'Duration',
                date: 'Date',
                notes: 'Notes',
                create: 'Create',
                time: 'Time',
                schedule: 'Schedule',
                details: 'Details',
                chooseActivity: 'Choose activity',
                intensity: 'Intensity',
                calories: 'Calories',
                location: 'Location',
                save: 'Save',
                update: 'Update',
                close: 'Close'
            },

            // Activity List
            listaAtividades: {
                title: 'My Activities',
                emptyTitle: 'No activities yet',
                emptyDescription: 'Start creating activities to see your progress here',
                noActivities: 'No activities found',
                allActivities: 'All Activities',
                intensity: 'Intensity'
            },

            // Register
            registro: {
                title: 'Register',
                name: 'Full name',
                email: 'Email',
                password: 'Password',
                confirmPassword: 'Confirm password',
                createAccount: 'Create account',
                haveAccount: 'Already have an account?',
                loginHere: 'Login here',
                privacyPolicy: 'Privacy Policy',
                termsOfUse: 'Terms of Use'
            },

            // Login
            login: {
                title: 'Hello,',
                subtitle: 'Welcome back',
                email: 'Email',
                password: 'Password',
                forgotPassword: 'Forgot your password?',
                login: 'Sign In',
                noAccount: "Don't have an account?",
                register: 'Register'
            },

            // Complete Profile
            completarperfil: {
                title: 'Complete Profile',
                subtitle: 'Add your information to personalize your experience',
                gender: 'Gender',
                chooseGender: 'Choose gender',
                male: 'Male',
                female: 'Female',
                other: 'Other',
                preferNotToSay: 'Prefer not to say',
                age: 'Age',
                birthdate: 'Birthdate',
                height: 'Height',
                weight: 'Weight',
                goalWeight: 'Goal weight',
                save: 'Save',
                next: 'Next',
                back: 'Back'
            },

            // Welcome
            welcome: {
                title: 'Activio',
                subtitle: 'Your fitness journey starts here',
                getStarted: 'Get Started',
                haveAccount: 'Already have an account?',
                login: 'Login'
            },

            // Intro Slider
            intro: {
                slide1: {
                    title: 'Welcome to Activio',
                    description: 'Your personal companion for a more active and healthy life'
                },
                slide2: {
                    title: 'Track your progress',
                    description: 'Monitor your activities and see how you evolve day by day'
                },
                slide3: {
                    title: 'Reach your goals',
                    description: 'Set goals and earn medals along the way'
                },
                next: 'Next',
                previous: 'Previous',
                getStarted: 'Get Started'
            },



            // Atividades
            atividades: {
                football: 'Football',
                caminhar: 'Walking',
                saltarCord: 'Jump rope',
                ciclismo: 'Cycling',
                atletismo: 'Athletics',
                ginasio: 'Gym',
                natacao: 'Swimming',
                yoga: 'Yoga'
            },

            // Intensidade
            intensidade: {
                baixa: 'Low',
                media: 'Medium',
                alta: 'High',
                todas: 'All'
            },

            // Peso
            peso: {
                title: 'Weight',
                inicio: 'Start',
                atual: 'Current',
                objetivo: 'Goal'
            },

            // Success Registration
            sucessoRegisto: {
                title: 'Welcome,',
                readyMessage: 'Everything is ready! Let\'s achieve your goals together.',
                buttonText: 'Get Started'
            }
        }
    };

    constructor() {
        console.log('I18nService constructor chamado');
        console.log('Traduções disponíveis:', Object.keys(this.translations));
        this.loadLanguage();
    }

    private loadLanguage() {
        const savedLanguage = localStorage.getItem(this.LANGUAGE_KEY);
        console.log('Idioma carregado do localStorage:', savedLanguage);

        if (savedLanguage && this.translations[savedLanguage]) {
            this.currentLanguage = savedLanguage;
        } else {
            // Definir idioma padrão se não houver salvamento
            this.currentLanguage = 'pt';
            this.saveLanguage();
            console.log('Idioma padrão definido:', this.currentLanguage);
        }

        console.log('Idioma atual definido:', this.currentLanguage);
        console.log('Exemplo de tradução home.welcome:', this.translations[this.currentLanguage]['home']);
    }

    private saveLanguage() {
        localStorage.setItem(this.LANGUAGE_KEY, this.currentLanguage);
    }

    getCurrentLanguage(): string {
        return this.currentLanguage;
    }

    setLanguage(language: string): void {
        if (this.translations[language]) {
            this.currentLanguage = language;
            this.saveLanguage();
            console.log('Idioma alterado para:', language);

            // Recarregar a página para aplicar as traduções
            setTimeout(() => {
                window.location.reload();
            }, 50);
        }
    }

    translate(key: string): string | string[] | Translation {
        const keys = key.split('.');
        let translation: any = this.translations[this.currentLanguage];

        for (const k of keys) {
            if (translation && typeof translation === 'object' && k in translation) {
                translation = translation[k];
            } else {
                console.warn(`Translation not found for key: ${key}`);
                return key; // Retorna a chave se não encontrar a tradução
            }
        }

        // Permitir string, array ou objeto
        if (typeof translation === 'string' || Array.isArray(translation)) {
            return translation;
        }

        console.warn(`Translation for key "${key}" is not a string or array:`, translation);
        return key;
    }

    t(key: string): any {
        const result = this.translate(key);
        return result;
    }

    private notifyLanguageChange() {
        // Dispara evento personalizado para notificar mudança de idioma
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.currentLanguage }
        }));

        // Aguarda um pouco para que os componentes possam processar o evento
        setTimeout(() => {
            // Forçar recarregamento da página para garantir que tudo seja atualizado
            window.location.reload();
        }, 100);
    }

    getAvailableLanguages(): string[] {
        return Object.keys(this.translations);
    }

    getLanguageName(language: string): string {
        const names: { [key: string]: string } = {
            'pt': 'Português',
            'en': 'English'
        };
        return names[language] || language;
    }
}
