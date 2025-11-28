import { Component, inject } from '@angular/core';
import { SUsuarios } from '../Servicios/s-usuarios';
import { ExcelUsuariosService } from '../Servicios/exel-service';
import { RouterLink, RouterModule } from "@angular/router";

@Component({
  selector: 'app-menu-administrador',
  imports: [RouterLink, RouterModule],
  templateUrl: './menu-administrador.html',
  styleUrl: './menu-administrador.css',
})
export class MenuAdministrador {
   private usuariosService = inject(ExcelUsuariosService);
  generarListaUsuarios(){
        this.usuariosService.generarExcelUsuarios()
      .then(() => console.log('Excel generado correctamente'))
      .catch(err => console.error('Error generando Excel:', err));
  }
}
