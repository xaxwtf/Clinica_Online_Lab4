import { Component, Input } from '@angular/core';
import { AuthService } from '../Servicios/auth.service';
import {MatToolbarModule} from '@angular/material/toolbar';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SUsuarios } from '../Servicios/s-usuarios';
import { IUsuarioDB } from '../Models/I_UsuarioDB';
import { Router } from '@angular/router';

@Component({
  selector: 'app-barra-de-usuario',
  imports: [MatToolbarModule, MatMenuModule, MatButtonModule, MatIconModule],
  templateUrl: './barra-de-usuario.html',
  styleUrl: './barra-de-usuario.css'
})
export class BarraDeUsuario {
  @Input() usuario: IUsuarioDB | null = null;

  constructor(private auth: AuthService, private router:Router) {
    
  }
  ngOnInit(){
    console.log(this.usuario);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  irPerfil() {
    this.router.navigate(['/perfil'])
  }
}
