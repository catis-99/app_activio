import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { I18nService } from '../services/i18n.service';

@Component({
    selector: 'app-intro-slider',
    templateUrl: './intro-slider.page.html',
    styleUrls: ['./intro-slider.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule]
})
export class IntroSliderPage implements OnInit {

    constructor(
        private router: Router,
        private i18nService: I18nService
    ) { }

    // Função para traduzir
    t(key: string): string {
        return this.i18nService.t(key);
    }

    ngOnInit() {
    }

    next() {
        this.router.navigateByUrl('/intro-2');
    }

    skip() {
        localStorage.setItem('introSeen', 'true');
        this.router.navigateByUrl('/home');
    }
}
