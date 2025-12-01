import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatearDNI'
})
export class FormatearDNIPipe implements PipeTransform {
  transform(value: string | number): string {
    if (!value) return '';

    // Asegurarse de que sea string
    const valStr = value.toString();

    // Agregar puntos cada 3 dígitos desde la derecha
    return valStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}