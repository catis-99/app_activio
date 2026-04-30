import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage {

  user = {
    nome: '',
    email: '',
    peso: 65,
    altura: 180
  };

  saveProfile() {
    console.log('Perfil guardado:', this.user);
    // Aqui podes ligar a um service ou Firebase / API
  }
}
