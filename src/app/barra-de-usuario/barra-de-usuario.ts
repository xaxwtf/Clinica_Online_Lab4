import { Component, inject, Input } from '@angular/core';
import { AuthService } from '../Servicios/auth.service';
import {MatToolbarModule} from '@angular/material/toolbar';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SUsuarios } from '../Servicios/s-usuarios';
import { IUsuarioDB } from '../Models/I_UsuarioDB';
import { Router } from '@angular/router';
import { ServicesLogs } from '../Servicios/services-logs';

@Component({
  selector: 'app-barra-de-usuario',
  imports: [MatToolbarModule, MatMenuModule, MatButtonModule, MatIconModule],
  templateUrl: './barra-de-usuario.html',
  styleUrl: './barra-de-usuario.css'
})
export class BarraDeUsuario {
  @Input() usuario: IUsuarioDB | null = null;
  private serv_logs=inject(ServicesLogs);

  constructor(private auth: AuthService, private router:Router) {
    
  }
  ngOnInit(){
    console.log(this.usuario);
  }

async logout() {
  try {


    const id = localStorage.getItem('idLogActual');
    if (id) {
      await this.serv_logs.settearLogOut(id);
      localStorage.removeItem('idLogActual');
    }

    // 👇 Esperar logout real
    await this.auth.logout();

    // 👇 Ahora sí navega
    this.router.navigate(['/login']);

  } catch (e) {
    console.error("Error en logout:", e);
    // fallback por si algo falla
    this.router.navigate(['/login']);
  }
}
  irPerfil() {
    this.router.navigate(['/perfil'])
  }
}
