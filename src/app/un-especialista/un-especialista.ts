import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IEspecialista } from '../Models/I_Especialista';
import { IEspecialistaDB } from '../Models/I_EspecialistaDB';

@Component({
  selector: 'app-un-especialista',
  imports: [],
  templateUrl: './un-especialista.html',
  styleUrl: './un-especialista.css'
})
export class UnEspecialista {
  @Input() Usuario!: IEspecialistaDB;
  @Output() cambiarEstado = new EventEmitter<boolean>();
  
  ngOnInit(){
    
  }

  habilitar() {
    this.cambiarEstado.emit(true);
    console.log("intentando habilitar  usuario");
  }

  inhabilitar() {
    this.cambiarEstado.emit(false);
  }
}
