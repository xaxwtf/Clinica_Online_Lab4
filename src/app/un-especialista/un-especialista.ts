import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { IEspecialista } from '../Models/I_Especialista';
import { IEspecialistaDB } from '../Models/I_EspecialistaDB';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { FormatearDNIPipe } from '../Pipes/formatearDNI';

@Component({
  selector: 'app-un-especialista',
  imports: [CommonModule, FormatearDNIPipe],
  templateUrl: './un-especialista.html',
  styleUrl: './un-especialista.css'
})
export class UnEspecialista {
  @Input() Usuario!: IEspecialistaDB;
  @Output() cambiarEstado = new EventEmitter<boolean>();

  formatearDNI=FormatearDNIPipe;
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
