import { Component, inject, ViewChild } from '@angular/core';
import { ITurno } from '../Models/I_turnos';
import { CommonModule } from '@angular/common';

import { faEdit,faTrash , faAdd, faCancel , faBan, faCalendarCheck, faCalendarXmark, faPowerOff, faMessage, faFileSignature, faSort, faStar, faFileLines, faRankingStar, faClipboardQuestion} from '@fortawesome/free-solid-svg-icons';

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



@Component({
  selector: 'app-gestion-turnos',
  imports: [
   CommonModule,
   FontAwesomeModule,
   MatTableModule,
   MatButtonModule,
   MatTooltipModule
  ],
  templateUrl: './gestion-turnos.html',
  styleUrl: './gestion-turnos.css',
})
export class GestionTurnos {


  private serv_Turnos= inject(TurnosService);
  private serv_Usuarios= inject(SUsuarios);
  private usuarioLogeado: IEspecialista | IPaciente | IAdmin| null =null;
  private dialog = inject(MatDialog);
  private firestore=inject(Firestore)
  public rolUsuario:Rol | null= null; 

  public soy_especialista:boolean=false;
  public soy_paciente:boolean=false;
  public soy_admin:boolean=false;

  displayedColumns: string[] = [];
  listaTurnos: ITurno[]=[];

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

  estadoTurno:EstadoTurno= EstadoTurno.DISPONIBLE;

  ultimoCampo: keyof ITurno | null = null;
  asc = true;
 

  async ngOnInit(){
    const resultadoBusqueda= await this.serv_Usuarios.getUserLoged();
    switch(resultadoBusqueda?.rol){
      case Rol.Especialista:
        this.usuarioLogeado= resultadoBusqueda as IEspecialista;
        ///traigo a los turnos de este especialista
        this.listaTurnos= await this.serv_Turnos.getTurnosPorFiltros([{ columna: 'id_especialista', valor: this.usuarioLogeado.uid }]);
        this.soy_especialista= resultadoBusqueda.rol === Rol.Especialista;
        this.displayedColumns= [
            'uid_paciente',
            'paciente',
            'especialidad',
            'fecha',
            'horario',
            'estado',
            'clasificacion',
            'diagnostico',
            'acciones'
        ]

        break;
      case Rol.Paciente:
        this.usuarioLogeado= resultadoBusqueda as IPaciente;
        //traigo los turnos de este paciente
        console.log(this.usuarioLogeado.uid);
        this.listaTurnos= await this.serv_Turnos.getTurnosPorFiltros([{ columna: 'id_paciente', valor: this.usuarioLogeado.uid}]);
        this.soy_paciente=resultadoBusqueda.rol === Rol.Paciente;
        this.displayedColumns=[
            
            'especialista',
            'paciente',
            'especialidad',
            'fecha',
            'horario',
            'estado',
            'clasificacion',
            'resenia',
            'acciones'
          ];
        break;
      case Rol.Admin:
        this.usuarioLogeado = resultadoBusqueda as IAdmin;
        ///traigo todos los turnos
        this.soy_admin=resultadoBusqueda.rol === Rol.Admin;
        break;
    }
  }



  async solicitarTurno(){
    console.log("INTENTANDO SOLICITAR TURNO");
     if (!this.usuarioLogeado) return; // evita errores si no hay usuario
    // Abrimos el modal enviando las dos franjas
      const dialogRef = this.dialog.open(NuevoTurno, {
        width: '400px',
        data: { currentUser: this.usuarioLogeado  } // enviamos array de 2 franjas
      });
      const resultado: ITurno | undefined = await dialogRef.afterClosed().toPromise();
      if (!resultado) return;
      resultado.id_paciente = doc(this.firestore, `Usuarios/${this.usuarioLogeado.uid}`);
      resultado.paciente = this.usuarioLogeado.Apellido + this.usuarioLogeado.Nombre;
      resultado.estado= EstadoTurno.SOLICITADO;
      this.serv_Turnos.crearTurno(resultado)
  }

  aceptarTurno(turnoSelecionado:ITurno){
    console.log("intentando confirmar turno", turnoSelecionado);
    this.serv_Turnos.settearEstadoTurno(turnoSelecionado, EstadoTurno.ACEPTADO);
  }
  async rechazarTurno(turnoSelecionado:ITurno ){
      const dialogRef=this.dialog.open( MensajeRequired, {
      disableClose: true,
      width: '500px',
      data: { modo:Modo.WRITE,  requerimiento: 'Indique la Razon del Rechazo '}
    });
    const respuesta:string | undefined  = await dialogRef.afterClosed().toPromise();
    if(respuesta!=undefined){
       const complemento= { comentario:respuesta}
      this.serv_Turnos.settearEstadoTurnov2(turnoSelecionado, EstadoTurno.RECHAZADO,complemento);
    }
    
  }

  async cancelarTurnoConfirmado(turnoSelecionado:ITurno){
      const dialogRef=this.dialog.open( MensajeRequired, {
      disableClose: true,
      width: '500px',
      data: { modo:Modo.WRITE, requerimiento: 'Indique la El Motivo de la Cancelacion del Turno: '}
    });
    const respuesta:string | undefined  = await dialogRef.afterClosed().toPromise();
    if(respuesta!=undefined){
       const complemento= { comentario:respuesta}
      this.serv_Turnos.settearEstadoTurnov2(turnoSelecionado, EstadoTurno.CANCELADO_ESPECIALISTA,complemento);
    }
  }

  async cancelarTurnoConfirmadoPaciente(turnoSelecionado:ITurno){
      const dialogRef=this.dialog.open( MensajeRequired, {
      disableClose: true,
       width: '500px',
      data: { modo:Modo.WRITE, requerimiento: 'Indique la El Motivo de la Cancelacion del Turno: '}
    });
    const respuesta:string | undefined  = await dialogRef.afterClosed().toPromise();
    if(respuesta!=undefined){
       const complemento= { comentario:respuesta}
      this.serv_Turnos.settearEstadoTurnov2(turnoSelecionado, EstadoTurno.CANCELADO_PACIENTE,complemento);
    }
  }

  async finalizarTurno(turnoSelecionado:ITurno){
    const dialogRef=this.dialog.open( MensajeRequired, {
        disableClose: true,
         width: '500px',
        data: { requerimiento: 'Diagnostico del Paciente: '}
    });
    const respuesta:string | undefined  = await dialogRef.afterClosed().toPromise();
    if(respuesta!=undefined){
      const complemento= { comentario:respuesta
      }
      this.serv_Turnos.settearEstadoTurnov2(turnoSelecionado, EstadoTurno.FINALIZADO,complemento);
    }
  }
    async verReseniaDePaciente(turnoSelecionado:ITurno){
    const dialogRef=this.dialog.open( MensajeRequired, {
        disableClose: true,
         width: '500px',
        data: { modo: Modo.READ , requerimiento: 'Diagnostico del Paciente:', titulo: 'Reseña del Paciciente', info:turnoSelecionado.resenia }
    });
  }

    async verRazonDelRechazoEspecialista(turnoSelecionado:ITurno){
      const dialogRef=this.dialog.open( MensajeRequired, {
          disableClose: true,
          width: '500px',
          data: { modo: Modo.READ , requerimiento: 'Diagnostico del Paciente:', titulo: 'Comentantario del Especialista', info:turnoSelecionado.comentario_especialista }
      });
    }
  async verComentarioPacienteRechazo(turnoSelecionado:ITurno){
    const dialogRef=this.dialog.open( MensajeRequired, {
        disableClose: true,
         width: '500px',
        data: { modo: Modo.READ , requerimiento: 'Diagnostico del Paciente:', titulo: 'Comentantario de Rechazo del Paciente', info:turnoSelecionado.comentario_paciente }
    });
  }

  async verOModificarDiagnostico(turnoSelecionado:ITurno){
      const dialogRef=this.dialog.open( MensajeRequired, {
          disableClose: true,
          width: '500px',
          data: { modo: Modo.READ_AND_WRITE , requerimiento: 'Diagnostico del Paciente:', titulo: 'Diagnostico: ', info:turnoSelecionado.diagnostico }
      });
      const respuesta:string | undefined  = await dialogRef.afterClosed().toPromise();
      if(respuesta!=undefined){
        const complemento= { diagnostico:respuesta }
      this.serv_Turnos.settearEstadoTurnov2(turnoSelecionado, EstadoTurno.FINALIZADO,complemento);
    }
  }
    ordenarPor(campo: keyof ITurno, asc: boolean = true) {
      this.listaTurnos = [...this.listaTurnos].sort((a, b) => {
        const valorA: any = a[campo];
        const valorB: any = b[campo];

        // Si es fecha (string con formato fecha)
        if (campo === 'fecha') {
          const fechaA = new Date(valorA).getTime();
          const fechaB = new Date(valorB).getTime();
          return asc ? fechaA - fechaB : fechaB - fechaA;
        }

        // Si ambos son números
        if (typeof valorA === 'number' && typeof valorB === 'number') {
          return asc ? valorA - valorB : valorB - valorA;
        }

        // Convertir a string para comparación segura
        const strA = valorA?.toString() ?? '';
        const strB = valorB?.toString() ?? '';

        return asc
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA);
      });
    }
  ordenar(campo: keyof ITurno) {
    if (this.ultimoCampo === campo) {
      this.asc = !this.asc; // invierte si es el mismo campo
    } else {
      this.asc = true; // si cambia campo, arranca asc
    }
    this.ultimoCampo = campo;
    this.ordenarPor(campo, this.asc);
  }
  ordenarDesdeHTML(campo: string) {
    this.ordenar(campo as keyof ITurno);
  }
  async clasificarConsulta(turno:ITurno){
    const dialogRef=this.dialog.open( Clasificar, {
        disableClose: true,
        width: '400px',
        height: '180px'
      });
      const respuesta:puntaje | undefined  = await dialogRef.afterClosed().toPromise();
      if(respuesta!=undefined){
      this.serv_Turnos.settearClasificacion(turno, respuesta)
    }
  }

  async cargarResenia(turnoSelecionado:ITurno){
      const dialogRef=this.dialog.open( MensajeRequired, {
        disableClose: true,
        width: '500px',
        data: { modo:Modo.WRITE, requerimiento: 'Reseña: '}
      });
    const respuesta:string | undefined  = await dialogRef.afterClosed().toPromise();
    if(respuesta!=undefined){
       const complemento= { resenia:respuesta}
      this.serv_Turnos.settearResenia(turnoSelecionado,respuesta);
    }
  }
   async cargaEncuesta(turnoSelecionado:ITurno){
      const dialogRef=this.dialog.open( CompletarEncuesta, {
        disableClose: true,
        width: '500px'
      });
    const respuesta: IEncuesta | null  = await dialogRef.afterClosed().toPromise();
    if(respuesta!=undefined){
      
      this.serv_Turnos.settearEncuesta(turnoSelecionado,respuesta);
    }
  }
  
    

}
