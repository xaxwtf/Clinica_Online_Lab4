import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BarraDeUsuario } from './barra-de-usuario/barra-de-usuario';
import { AuthService } from './Servicios/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';

import { SUsuarios } from './Servicios/s-usuarios';
import { IUsuarioDB } from './Models/I_UsuarioDB';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BarraDeUsuario],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
   private authService = inject(AuthService);
   private serv_Usuario= inject(SUsuarios)

  // signal que indica si está logueado
  isLogged = toSignal(this.authService.isLoggedIn$, { initialValue: false });

  // usuario logeado o null
  logeado: IUsuarioDB | null = null;



  async ngOnInit() {
    this.logeado = await this.serv_Usuario.getUserLoged();
  }
}
