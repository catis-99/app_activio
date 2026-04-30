import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ThemeService } from './services/theme.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private themeService = inject(ThemeService);
  private storage = inject(Storage);


  async ngOnInit() {
    // Initialize theme on app start
    this.themeService.loadTheme();

    // Initialize storage
    await this.storage.create();

    console.log('App inicializado - começando do zero sem dados de exemplo');
  }
}
