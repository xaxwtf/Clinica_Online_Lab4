import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IDiagnostico } from '../Models/I_DIagnostico';
import { ColorTemperaturaDirective } from '../directivas/color-temperatura';
import { TemperaturaSufijoDirective } from '../directivas/temperatura-sufijo';
import { AlturaSufijoDirective } from '../directivas/altura-sufijo';
import { PesoSufijoDirective } from '../directivas/peso-sufijo';
import { PresionArterialDirective } from '../directivas/presionArterial';


@Component({
  selector: 'app-diagnosticar-paciente',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ColorTemperaturaDirective, TemperaturaSufijoDirective, AlturaSufijoDirective, PesoSufijoDirective, PresionArterialDirective],
  templateUrl: './diagnosticar-paciente.html',
  styleUrl: './diagnosticar-paciente.css',
})
export class DiagnosticarPaciente {
  
  
  private diagnostico: IDiagnostico = {
    Altura: "",
    Peso: "",
    Temperatura: "",
    Presion: "",
    comentarios: "",
    otrosDatos: []
  };
  private dialogRef= inject(MatDialogRef<DiagnosticarPaciente>);
     // Inyectamos los datos del modal
  textoIngresado='';
  errorText=false;

    // 🔹 Campos del formulario
  altura: string = '';
  peso: string = '';
  temperatura: string = '';
  presion: string = '';
  extra1 = '';
  extra2 = '';
  extra3 = '';
  extra4 = '';
  extra5 = '';
  extra6 = '';


  cancelar() {
    this.dialogRef.close();
  }
  confirmar() {
  // Inicializar diagnostico si no existe
  this.diagnostico = {
    Altura: this.altura,
    Peso: this.peso,
    Temperatura: this.temperatura,
    Presion: this.presion,
    comentarios: "",
    otrosDatos: []
  };

  // Agregar campos extra si están completos
  const extras = [
    [this.extra1, this.extra2],
    [this.extra3, this.extra4],
    [this.extra5, this.extra6]
  ];

  for (const [clave, valor] of extras) {
    if (clave.trim() !== "" && valor.trim() !== "") {
      this.diagnostico.otrosDatos?.push({ clave, valor });
    }
  }

  // Validación del comentario
  if (this.textoIngresado.trim().length < 3) {
    this.errorText = true;
    return;
  }

  // Guardar comentario correcto
  this.diagnostico.comentarios = this.textoIngresado.trim();

  // Cerrar pasando diagnóstico
  this.dialogRef.close(this.diagnostico);
}


}
