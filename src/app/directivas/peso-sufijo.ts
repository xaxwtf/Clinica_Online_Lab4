import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPesoSufijo]',
  standalone: true
})
export class PesoSufijoDirective {

  private sufijo = 'kg';

  constructor(private el: ElementRef<HTMLInputElement>) {}
  /** Cuando el input obtiene foco → quitar el sufijo temporalmente */
  @HostListener('focus')
  onFocus() {
    let valor = this.el.nativeElement.value;
    if (valor.endsWith(this.sufijo)) {
      this.el.nativeElement.value = valor.slice(0, -this.sufijo.length);
    }
  }

  /** Cuando pierde foco → volver a agregar sufijo */
  @HostListener('blur')
  onBlur() {
    let valor = this.el.nativeElement.value.trim();
    if (valor !== '' && !valor.endsWith(this.sufijo)) {
      this.el.nativeElement.value = valor + this.sufijo;
    }
  }
}
