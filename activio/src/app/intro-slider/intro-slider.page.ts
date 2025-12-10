import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-intro-slider',
    templateUrl: './intro-slider.page.html',
    styleUrls: ['./intro-slider.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule]
})
export class IntroSliderPage implements OnInit {

    constructor(private router: Router) { }

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
