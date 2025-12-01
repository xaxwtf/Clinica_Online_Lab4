import { Component, inject, ViewChild } from '@angular/core';
import { ITurno } from '../Models/I_turnos';
import { CommonModule } from '@angular/common';

import { faEdit,faTrash , faAdd, faCancel , faBan, faCalendarCheck, faCalendarXmark, faPowerOff, faMessage, faFileSignature, faSort, faStar, faFileLines, faRankingStar, faClipboardQuestion, faFilePdf } from '@fortawesome/free-solid-svg-icons';

import { TurnosService } from '../Servicios/turnos-service';

import { IEspecialista } from '../Models/I_Especialista';
import { IPaciente } from '../Models/i_Paciente';
import { IAdmin } from '../Models/I_Admin';
import { SUsuarios } from '../Servicios/s-usuarios';
import { Rol } from '../Models/Rol';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { NuevoTurno } from '../nuevo-turno/nuevo-turno';

import { doc, Firestore } from '@angular/fire/firestore';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { EstadoTurno } from '../Models/estadosTurno';
import { MensajeRequired } from '../mensaje-required/mensaje-required';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Modo } from '../Models/modo';
import { Clasificar } from '../clasificar/clasificar';
import { puntaje } from '../Models/I_puntuacion';
import { CompletarEncuesta } from '../completar-encuesta/completar-encuesta';
import { IEncuesta } from '../Models/I_encuesta';
import { TurnosPdfService } from '../Servicios/pdf-turnos-service';

@Component({
  selector: 'app-lista-pacientes',
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatTableModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './lista-pacientes.html',
  styleUrl: './lista-pacientes.css',
})
export class ListaPacientes {
  private serv_Turnos= inject(TurnosService);
  private serv_Usuarios= inject(SUsuarios);
  private serv_pdf=inject(TurnosPdfService);
  private usuarioLogeado: IEspecialista | IPaciente | IAdmin| null =null;
  public rolUsuario!:Rol; 

  public soy_especialista:boolean=false;
  public soy_paciente:boolean=false;
  public soy_admin:boolean=false;

  public listaPacientes:IPaciente[]=[];

  displayedColumns: string[] = [];

  faEdit = faEdit;
  faTrash = faTrash;
  faAdd=faAdd;
  faCancel=faCancel;
  faBan=faBan;
  faCalendarCheck=faCalendarCheck;
  faCalendarXmark=faCalendarXmark;
  faPowerOff=faPowerOff;
  faMessage=faMessage;
  faFileSignatura=faFileSignature;
  faSort=faSort;
  faStar=faStar;
  faFileLines=faFileLines;
  faRankingStar=faRankingStar;
  faClipBoardQuestion=faClipboardQuestion;
  faFilePdf=faFilePdf;

    async ngOnInit(){
      const resultadoBusqueda= await this.serv_Usuarios.getUserLoged();
      switch(resultadoBusqueda?.rol){
        case Rol.Especialista:
          this.usuarioLogeado= resultadoBusqueda as IEspecialista;
          this.otenerPacientesDelEspecialista();
          console.log(this.listaPacientes, "mis pacientes");
          this.soy_especialista= resultadoBusqueda.rol === Rol.Especialista;
          this.displayedColumns= [
              'Nombre',
              'Apellido',
              'Email',
              'DNI',
              'ObraSocial',
              'acciones'
          ]
          this.rolUsuario=Rol.Especialista;
          break;
        case Rol.Admin:
          this.usuarioLogeado = resultadoBusqueda as IAdmin;
          ///traigo todos los turnos
          this.otenerTodosLosPacientes();
          this.soy_admin=resultadoBusqueda.rol === Rol.Admin;
          this.displayedColumns=[
              'Nombre',
              'Apellido',
              'Email',
              'DNI',
              'ObraSocial',
              'acciones'
            ];
          this.rolUsuario=Rol.Admin;
          break;
      }
    }
    private async otenerPacientesDelEspecialista() {

    if (!this.usuarioLogeado?.uid) return;

    // Traer solo los turnos finalizados del especialista
    const turnosFinalizados = await this.serv_Turnos.getTurnosPorFiltros([
    { columna: 'id_especialista', valor: this.usuarioLogeado.uid },
    { columna: 'estado', valor: 'finalizado' }
    ]);

    if (turnosFinalizados.length === 0) {
    this.listaPacientes = [];
    return;
    }

    //  Agrupar turnos por paciente (optimizado)
    const grupos = new Map<string, ITurno[]>();

    for (const turno of turnosFinalizados) {
    const idPac = turno.id_paciente.id; // referencia → string
    if (!grupos.has(idPac)) {
    grupos.set(idPac, []);
    }
    grupos.get(idPac)!.push(turno);
    }

    //  Obtener los datos de cada paciente en paralelo (MUY RÁPIDO)
    const pacientes = await Promise.all(
    Array.from(grupos.keys()).map(uid =>
    this.serv_Usuarios.obtenerUsuario(uid) as Promise<IPaciente>
    )
    );

    //  Guardar lista final
    this.listaPacientes = pacientes.filter(p => p != null);
    }

    private async  otenerTodosLosPacientes(){
        this.listaPacientes = await this.serv_Usuarios.getUsuariosByCampo('rol', Rol.Paciente);
    }

    public generarHistoriaClinicaDelPacienteSeleccionado(pacienteSeleccionado: IPaciente){
        this.serv_pdf.generarHistoriaClinicaPDF("assets/icon/apple-icon-180x180.png", pacienteSeleccionado.uid!);
    }

}
