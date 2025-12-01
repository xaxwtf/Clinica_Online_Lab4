import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPresionArterial]',
  standalone: true
})
export class PresionArterialDirective {

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input')
  onInput() {
    let value = this.el.nativeElement.value;

    // Quitar todo lo que no sea número
    value = value.replace(/[^\d]/g, '');

    // Si hay más de 6 dígitos, recortamos (ej: 200120)
    if (value.length > 6) value = value.slice(0, 6);

    let sistolica = '';
    let diastolica = '';

    if (value.length <= 3) {
      // Solo sistólica
      sistolica = value;
    } else {
      // Partimos en sistólica / diastólica
      sistolica = value.slice(0, 3);
      diastolica = value.slice(3);
    }

    // Formato final
    const formatted = diastolica ? `${sistolica}/${diastolica}` : sistolica;

    this.el.nativeElement.value = formatted;
  }

  /** Cuando pierde foco → asegurar formato correcto */
  @HostListener('blur')
  onBlur() {
    let value = this.el.nativeElement.value.replace(/[^\d]/g, '');

    if (value.length >= 4) {
      const sistolica = value.slice(0, 3);
      const diastolica = value.slice(3);
      this.el.nativeElement.value = `${sistolica}/${diastolica}`;
    }
  }

}
