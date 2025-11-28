import { Component, OnInit } from '@angular/core';
import { UnEspecialista } from '../un-especialista/un-especialista';
import { SUsuarios } from '../Servicios/s-usuarios';

import { Rol } from '../Models/Rol';
import { IEspecialistaDB } from '../Models/I_EspecialistaDB';
import { IUsuarioDB } from '../Models/I_UsuarioDB';
import { BarraDeUsuario } from '../barra-de-usuario/barra-de-usuario';

@Component({
  selector: 'app-lista-especialistas',
  imports: [UnEspecialista],
  templateUrl: './lista-especialistas.html',
  styleUrl: './lista-especialistas.css'
})
export class ListaEspecialistas implements OnInit {
  public especialistas:IEspecialistaDB[] = []

  constructor(private serv_Usuarios:SUsuarios){

  }
  async ngOnInit() {
   this.especialistas= await this.serv_Usuarios.getUsuariosByCampo<IEspecialistaDB>("rol", Rol.Especialista);

  }

onCambiarEstado(usuario: IEspecialistaDB, nuevoEstado: boolean) {
  this.serv_Usuarios.actualizarEstadoEspecialista( usuario.uid! , nuevoEstado)
    .then(() => {
      usuario.activo = nuevoEstado; // actualizar vista
    });
}


}
