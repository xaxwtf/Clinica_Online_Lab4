import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IEncuesta } from '../Models/I_encuesta';

import { MatDialogRef } from '@angular/material/dialog';
import { puntaje } from '../Models/I_puntuacion';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-completar-encuesta',
  standalone:true,
  imports: [CommonModule, MatIconModule, FontAwesomeModule],
  templateUrl: './completar-encuesta.html',
  styleUrl: './completar-encuesta.css',
})
export class CompletarEncuesta {
  private dialogRef= inject(MatDialogRef<CompletarEncuesta>)
  faStar=faStar;

  // Control de hover por pregunta
  hover = {
    tratoProfesional: 0,
    puntualidad: 0,
    instalaciones: 0,
  };

  encuesta: IEncuesta ={};

    // --- SET PUNTAJE -----------------------
  setRating(campo: keyof IEncuesta, valor: number) {
    this.encuesta[campo] = valor as puntaje;
  }

  // --- HOVER -----------------------------
  setHover(campo: keyof IEncuesta, valor: number) {
    this.hover[campo] = valor;
  }

  clearHover(campo: keyof IEncuesta) {
    this.hover[campo] = 0;
  }


  enviar() {
    this.dialogRef.close(this.encuesta)
  }

  cancelar() {
    this.dialogRef.close(null);
  }

}
