import { Component, inject } from '@angular/core';
import { RangoHorario } from '../Models/I_disponibilidadPorHora';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { faTrashCan, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-modificar-oagregar-disponibilidad',
  standalone: true,
  imports: [FormsModule, CommonModule, FontAwesomeModule],
  templateUrl: './modificar-oagregar-disponibilidad.html',
  styleUrls: ['./modificar-oagregar-disponibilidad.css'],
})
export class ModificarOAgregarDisponibilidad {
  
  // Ahora manejamos dos franjas
  public horarios: RangoHorario[] = [];
  public diaSeleccionado:string='';
  public iconoTrash=faTrashCan;
  public iconoMas=faPlus;
  private dialogRef= inject(MatDialogRef<ModificarOAgregarDisponibilidad>);

  // Inyectamos los datos del modal
  private data = inject(MAT_DIALOG_DATA) as { franjas?: RangoHorario[], dia:string };

  constructor() {
    // Inicializamos las franjas
    if (this.data.franjas && this.data.franjas.length > 0) {
      this.horarios = [...this.data.franjas];
    } else {
      // Ninguna franja existente
      this.horarios = [
      ];
    }
    this.diaSeleccionado=this.data.dia;
  }

  confirmar() {
    // Cerramos el modal devolviendo las 2 franjas
    this.dialogRef.close(this.horarios);
  }
  cancelar() {
    this.dialogRef.close();
  }

  agregarHorario(){
    this.horarios.push({desde: '00:00', totalTurnos: 0})
  }

  quitarHorario(indice:number){
    this.horarios.splice(indice,indice);
  }
}
