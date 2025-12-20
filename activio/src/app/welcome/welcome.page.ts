import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class WelcomePage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  start() {
    this.router.navigate(['/intro']);
  }

}
