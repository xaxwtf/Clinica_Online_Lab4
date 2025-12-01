import { inject, Injectable } from '@angular/core';
import { SUsuarios } from './s-usuarios';
import { TurnosService } from './turnos-service';

@Injectable({
  providedIn: 'root',
})
export class ServicioHistoriaClinica {
  private serv_usuarios=inject(SUsuarios);
  private serv_turnos=inject(TurnosService);

  obtener_historia_clinica_de_un_paciente(id_paciente:string){
    const usuario=this.serv_usuarios.obtenerUsuario(id_paciente);
  }
  
}
