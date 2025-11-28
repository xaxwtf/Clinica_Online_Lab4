import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { puntaje } from '../Models/I_puntuacion';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-clasificar',
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    FontAwesomeModule
    
  ],
  templateUrl: './clasificar.html',
  styleUrl: './clasificar.css',
})
export class Clasificar {
  private dialogRef = inject(MatDialogRef<Clasificar> );
  rating = 0; // 1–5
  hoverIndex = 0; // para hover visual
  comentario = ''; // texto opcional
  faStar=faStar;
  
  private data= inject(MAT_DIALOG_DATA)

  constructor() {}

  setRating(value: number) {
  this.rating = value;
  }

  setHover(value: number) {
  this.hoverIndex = value;
  }

  clearHover() {
  this.hoverIndex = 0;
  }

  confirmar() {
    if (this.rating === 0) return;
    this.dialogRef.close( this.rating);
  }

  cancelar() {
  this.dialogRef.close(null);
  }

}
