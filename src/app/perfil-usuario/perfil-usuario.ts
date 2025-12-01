import { Component, inject } from '@angular/core';
import { IUsuarioDB } from '../Models/I_UsuarioDB';
import { SUsuarios } from '../Servicios/s-usuarios';
import { CommonModule, UpperCasePipe } from '@angular/common';


import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipSelectionChange, MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';


// Pipes
import { TitleCasePipe, KeyValuePipe } from '@angular/common';


import { IEspecialista } from '../Models/I_Especialista';
import { IPaciente } from '../Models/i_Paciente';
import { IAdmin } from '../Models/I_Admin';
import { Rol } from '../Models/Rol';
import { DisponibilidadService } from '../Servicios/s-disponibilidad';
import { ModificarOAgregarDisponibilidad } from '../modificar-oagregar-disponibilidad/modificar-oagregar-disponibilidad';

import { MatDialog } from '@angular/material/dialog';
import { RangoHorario } from '../Models/I_disponibilidadPorHora';
import { DisponibilidadPorDia } from '../Models/I_disponibilidadPorDia';
import { faCalendarDays, faGear, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { RouterLink } from "@angular/router";
import { MatTooltipModule } from '@angular/material/tooltip';
import { TurnosService } from '../Servicios/turnos-service';
import { TurnosPdfService } from '../Servicios/pdf-turnos-service';
import { FormatearDNIPipe } from '../Pipes/formatearDNI';


@Component({
  selector: 'app-perfil-usuario',
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
    MatButtonModule,
    TitleCasePipe,
    FaIconComponent,
    RouterLink,
    MatTooltipModule,
    FormatearDNIPipe
],
  templateUrl: './perfil-usuario.html',
  styleUrl: './perfil-usuario.css'
})
export class PerfilUsuario {
    private servUsuarios= inject(SUsuarios)
    private serDisponibilidad= inject(DisponibilidadService)
    private serv_turnos= inject(TurnosPdfService);
    public usuario: IEspecialista | IPaciente | IAdmin | null= null;
    public especialidadeUsuario:string[]=[];
    public imagenesDePerfil: string[]=["",""];
    private dialog = inject(MatDialog);
    faGear=faGear;
    faCalendarDays=faCalendarDays;
    faFilePdf=faFilePdf;

    formatoDni=FormatearDNIPipe;
    upperPipe=UpperCasePipe;

    mostrarTodos: boolean = true;
    diaSeleccionado: keyof DisponibilidadPorDia = 'lunes';
    especialidadSeleccionada:string='';


    diasValidos: (keyof DisponibilidadPorDia)[] = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
   




  ngOnInit() {
     
   
    this.servUsuarios.getUserLoged().then( u => {

      switch(u?.rol){
        case Rol.Admin:
          this.usuario= u as IAdmin
        break;
        case Rol.Especialista:
          this.usuario= u as IEspecialista;
          this.especialidadSeleccionada=this.especialista?.especialidad[0]!;

        break;
        case Rol.Paciente:
          this.usuario= u as IPaciente
          break;
      }
    });
  
  }

   /**
   * Abrir modal para editar o agregar franja horaria
   */
async ModificarHorario(especialidad: string, dia: keyof DisponibilidadPorDia) {
  const esp = this.especialista;
  if (!esp) return;

  // Inicializar disponibilidad si no existe
  if (!esp.disponibilidad) esp.disponibilidad = {};

  if (!esp.disponibilidad[especialidad]) esp.disponibilidad[especialidad] = {
    lunes: [], martes: [], miercoles: [], jueves: [], viernes: [], sabado: [], domingo: []
  };

  const franjas = esp.disponibilidad[especialidad][dia];

  // Abrimos el modal enviando las dos franjas
  const dialogRef = this.dialog.open(ModificarOAgregarDisponibilidad, {
    width: '400px',
    data: { franjas, dia } // enviamos array de 2 franjas
  });

  const resultado: RangoHorario[] | undefined = await dialogRef.afterClosed().toPromise();
  console.log(resultado);
  if (!resultado) return;

  // Actualizamos las franjas localmente
  esp.disponibilidad[especialidad][dia] = resultado;
  console.log("llegamos aca?");
  console.log(esp.disponibilidad[especialidad][dia]);
  // Guardamos en Firestore usando el servicio
  await this.serDisponibilidad.setFranjaHoraria( this.usuario!.uid!, especialidad,dia, resultado);
}


 
  get especialista(): IEspecialista | null {
    return this.usuario?.rol === Rol.Especialista ? (this.usuario as IEspecialista) : null;
  }
  get paciente(): IPaciente | null {
    return this.usuario?.rol === Rol.Paciente ? (this.usuario as IPaciente) : null;
  }
  get admin(): IAdmin | null{
    return this.usuario?.rol === Rol.Paciente ? (this.usuario as IAdmin) : null;
  }
  public test(){
    
  }

onDiaChange(especialidad: string, event: Event) {
  const select = event.target as HTMLSelectElement;
  const valor = select.value.toLowerCase() || 'lunes';
  const dia = valor as keyof DisponibilidadPorDia;
  
  this.diaSeleccionado = dia;
  this.especialidadSeleccionada = especialidad;
}
  onEspecialidadSeleccionada(esp: string, event: MatChipSelectionChange) {

    if (!event.selected) {
      // Evitar que quede vacío → lo volvemos a seleccionar
      this.especialidadSeleccionada = esp;
      return;
    }
    // Seteamos la nueva selección correctamente
    this.especialidadSeleccionada = esp;
  }
  generarHistoriaClinicaPDF(){
    if(this.usuario){
      this.serv_turnos.generarHistoriaClinicaPDF('./icon/apple-icon-180x180.png',this.usuario.uid!);
    } 
  }

}
