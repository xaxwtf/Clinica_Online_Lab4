import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[appColorTemperatura]',
  standalone: true
})
export class ColorTemperaturaDirective implements OnChanges {
    private valorNumber:number=0; 

  @Input() appColorTemperatura: string| number | null = null;

  constructor(private el: ElementRef) {}

  ngOnChanges(): void {
    if (this.appColorTemperatura === null) return;
    if(typeof this.appColorTemperatura === 'string'){
        this.valorNumber = this.valorNumber = parseFloat(this.appColorTemperatura.replace(/[^\d.-]/g, ''));
    }
    else if(typeof this.appColorTemperatura==='number'){
        this.valorNumber = this.appColorTemperatura; 
    }

    if (this.valorNumber  >= 38) {
      // Fiebre → rojo
      this.el.nativeElement.style.borderColor = 'red';
      this.el.nativeElement.style.color = 'red';
    } 
    else if (this.valorNumber <= 35) {
      // Muy frío → azul
      this.el.nativeElement.style.borderColor = 'blue';
      this.el.nativeElement.style.color = 'blue';
    } 
    else {
      // Normal → negro o por defecto
      this.el.nativeElement.style.borderColor = '#555';
      this.el.nativeElement.style.color = 'black';
    }
  }
}