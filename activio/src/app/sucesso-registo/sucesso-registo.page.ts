import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-sucesso-registo',
  templateUrl: './sucesso-registo.page.html',
  styleUrls: ['./sucesso-registo.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, CommonModule, FormsModule]
})
export class SucessoRegistoPage implements OnInit {
  userName: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public i18n: I18nService
  ) { }

  ngOnInit() {
    // Obter o nome do utilizador dos parâmetros da rota ou localStorage
    this.route.queryParams.subscribe(params => {
      if (params['name']) {
        this.userName = params['name'];
      } else {
        // Se não vier dos parâmetros, tentar obter do localStorage (registro anterior)
        this.userName = localStorage.getItem('userName') || 'Utilizador';
      }
    });
  }

  // Função para tradução (compatível com template)
  t(key: string): any {
    return this.i18n.t(key);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

}

