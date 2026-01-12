import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ThemeService } from './services/theme.service';
import { Storage } from '@ionic/storage-angular';
import { DataSyncService } from './services/data-sync.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(
    private themeService: ThemeService,
    private storage: Storage,
    private dataSyncService: DataSyncService
  ) { }

  async ngOnInit() {
    // Initialize theme on app start
    this.themeService.loadTheme();

    // Initialize storage
    await this.storage.create();

    // Load initial data from JSON files (first time only)
    try {
      await this.dataSyncService.loadInitialData();
      console.log('Dados iniciais carregados do projeto');
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
    }
  }
}
