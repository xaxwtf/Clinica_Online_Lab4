import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrarTurnos'
})
export class FiltrarTurnosPipe implements PipeTransform {

  transform(turnos: any[], especialista: string = '', paciente: string = ''): any[] {
    if (!turnos) return [];

    let filtrados = turnos;

    if (especialista) {
      filtrados = filtrados.filter(t => 
        t.especialista?.nombre?.toLowerCase().includes(especialista.toLowerCase())
      );
    }

    if (paciente) {
      filtrados = filtrados.filter(t => 
        t.paciente?.nombre?.toLowerCase().includes(paciente.toLowerCase())
      );
    }

    return filtrados;
  }
}
