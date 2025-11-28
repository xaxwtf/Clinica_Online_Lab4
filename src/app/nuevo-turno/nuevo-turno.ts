import { Component, inject } from '@angular/core';
import { IEspecialista } from '../Models/I_Especialista';
import { IPaciente } from '../Models/i_Paciente';
import { IAdmin } from '../Models/I_Admin';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TurnosService } from '../Servicios/turnos-service';
import { ITurno } from '../Models/I_turnos';
import { RouterLink } from "@angular/router";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { EspecialidadesService } from '../Servicios/s-especialidad';


@Component({
  selector: 'app-nuevo-turno',
  imports: [FontAwesomeModule],
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
  

  faAdd=faAdd;

  public especialidadSeleccionada:string='nefrologia'
  async ngOnInit(){
    this.inicializarTurnosPorFechas(15);
    this.listaEspecialidades = await this.serv_Especialidades.getAllEspecialidades();
    
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
  private inicializarTurnosPorFechas(cantidadDias: number) {
      const fechas = this.obtenerFechasProximosDias(cantidadDias);
      this.fechasDeTurnosACargar=fechas;

      fechas.forEach(fecha => {
        this.serv_Turnos.getTurnosDisponibles(fecha, this.especialidadSeleccionada).then(r=>{
            this.turnosPorFecha[fecha] = r; // inicializamos con lo retornado /// supngo que puede ser vacio o con elementos
        });
        
      });
    }
    solicitarTurno( turno:ITurno ){
      console.log(turno, "este es el turno elegido");
      this.dialogRef.close(turno);
    }
}
