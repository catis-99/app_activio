import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-intro-slider-3',
    templateUrl: './intro-slider-3.page.html',
    styleUrls: ['./intro-slider-3.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule]
})
export class IntroSlider3Page implements OnInit {

    constructor(private router: Router) { }

    ngOnInit() {
    }

    start() {
        localStorage.setItem('introSeen', 'true');
        this.router.navigateByUrl('/home');
    }

    skip() {
        localStorage.setItem('introSeen', 'true');
        this.router.navigateByUrl('/home');
    }

    back() {
        this.router.navigateByUrl('/intro-2');
    }
}
