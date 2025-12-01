import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// Para autosize del textarea
import { TextFieldModule } from '@angular/cdk/text-field';
import { Modo } from '../Models/modo';

@Component({
  selector: 'app-mensaje-required',
  imports: [CommonModule,FormsModule, MatFormFieldModule, MatInputModule, TextFieldModule],
  templateUrl: './mensaje-required.html',
  styleUrl: './mensaje-required.css',
})
export class MensajeRequired {
  private dialogRef= inject(MatDialogRef<MensajeRequired>);
   // Inyectamos los datos del modal
  private data = inject(MAT_DIALOG_DATA) as { modo:Modo , requerimiento:string, titulo?:string, info?:string };
  public mensaje:string='';
  textoIngresado='';
  errorText=false;
  lectura:boolean=false;
  escritura:boolean=false;

  async ngOnInit(){
    this.mensaje=this.data.requerimiento;
    switch(this.data.modo){
      case Modo.READ:
        this.lectura=true;
        if(this.data.info){
          //this.mensaje =this.data.info;
          this.mensaje= this.data.info;
        }
        else{
          this.mensaje= "No hay Informacion";
        }
        
        break;
      case Modo.WRITE:
        this.escritura=true;
        break;
      case Modo.READ_AND_WRITE:
        if(this.data.info){
          //this.mensaje =this.data.info;
          this.textoIngresado=this.data.info;
        }
        else{
          this.mensaje= "No hay Informacion";
        }
        this.escritura=true;
        this.lectura=true;
        break;
    }
  }
  cancelar() {
    this.dialogRef.close();
  }
  confirmar(){
    if(this.textoIngresado &&  this.textoIngresado.trim().length > 3){
      this.errorText=false;
      this.dialogRef.close(this.textoIngresado);
    }
    else{
      console.log(this.textoIngresado, "este es el texto!");
      this.errorText=true;
    }
  }
}
