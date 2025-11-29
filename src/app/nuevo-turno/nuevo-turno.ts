import { Component, inject } from '@angular/core';
import { IEspecialista } from '../Models/I_Especialista';
import { IPaciente } from '../Models/i_Paciente';
import { IAdmin } from '../Models/I_Admin';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TurnosService } from '../Servicios/turnos-service';
import { ITurno } from '../Models/I_turnos';
import { RouterLink } from "@angular/router";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAdd, faHandPointer } from '@fortawesome/free-solid-svg-icons';
import { EspecialidadesService } from '../Servicios/s-especialidad';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';





@Component({
  selector: 'app-nuevo-turno',
  imports: [FontAwesomeModule, CommonModule, MatTableModule, MatIconModule, MatSelectModule, MatProgressSpinnerModule, MatTooltipModule, MatOptionModule, MatButtonModule],
  templateUrl: './nuevo-turno.html',
  styleUrl: './nuevo-turno.css',
})
export class NuevoTurno {
  private dialogRef= inject(MatDialogRef<NuevoTurno>);
  // Inyectamos los datos del modal
  private data = inject(MAT_DIALOG_DATA) as { currentUser?:IPaciente | IAdmin  };
  private serv_Turnos=inject(TurnosService);
  private serv_Especialidades=inject(EspecialidadesService);
  public fechasDeTurnosACargar:string[]=[];
  public listaEspecialidades:{uid:string, nombre:string}[]= [];

  public turnosPorFecha: { [fecha: string]: ITurno[] } = {};
  public turnosFiltrados: { [fecha: string]: ITurno[] } = {};
   columnas = ['especialista', 'hora', 'estado', 'acciones'];
  
  public cargandoTurnos = false;

  faAdd=faAdd;
  faHandPointer=faHandPointer;

  public especialidadSeleccionada!:string;
  async ngOnInit() {
    this.listaEspecialidades = await this.serv_Especialidades.getAllEspecialidades();
    this.especialidadSeleccionada = this.listaEspecialidades[0].uid;

    await this.cargarTurnos();
  }


 
  cancelar() {
    this.dialogRef.close();
  }
    private obtenerFechasProximosDias(cantidadDias: number): string[] {
    const fechas: string[] = [];
    const hoy = new Date();

    for (let i = 0; i <= cantidadDias; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i); // sumar i días a hoy
      // Formatear como YYYY-MM-DD
      const fechaStr = fecha.toISOString().split('T')[0];
      fechas.push(fechaStr);
    }

    return fechas;
  }
  // Generar fechas y asignar arrays vacíos
private async inicializarTurnosPorFechas(cantidadDias: number) {
  const fechas = this.obtenerFechasProximosDias(cantidadDias);
  this.fechasDeTurnosACargar = fechas;

  const nuevoMapa: { [fecha: string]: ITurno[] } = {};

  const promesas = fechas.map(async fecha => {
    const turnos = await this.serv_Turnos.getTurnosDisponibles(
      fecha,
      this.especialidadSeleccionada
    );
    nuevoMapa[fecha] = turnos;
  });

  await Promise.all(promesas);

  this.turnosPorFecha = nuevoMapa;
}

    solicitarTurno( turno:ITurno ){
      console.log(turno, "este es el turno elegido");
      this.dialogRef.close(turno);
    }

    async cambiarEspecialidad(event: MatSelectChange) {
      this.especialidadSeleccionada = event.value;
      await this.cargarTurnos(); // usa la misma función centralizada
    }

    get fechasDisponibles(): string[] {
      return Object.keys(this.turnosFiltrados);
    }
    filtrarFechasConTurnos(): { [fecha: string]: ITurno[] } {
      const resultado: { [fecha: string]: ITurno[] } = {};
      for (const fecha in this.turnosPorFecha) {
        const turnos = this.turnosPorFecha[fecha];
        if (turnos && turnos.length > 0) {
          resultado[fecha] = turnos;
        }
      }
        // Esperamos a que TODAS terminen

      return resultado;
    }

    private async cargarTurnos() {
      this.cargandoTurnos = true;

      this.turnosPorFecha = {}; // limpiar anterior

      await this.inicializarTurnosPorFechas(15); // ahora es async
      this.turnosFiltrados = this.filtrarFechasConTurnos();

      this.cargandoTurnos = false;
    }

}
