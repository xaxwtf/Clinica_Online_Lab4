// src/app/directivas/captcha.directive.ts
import { Directive, EventEmitter, Input, Output, Renderer2, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[appCaptcha]'
})
export class CaptchaDirective implements OnInit {

  @Input() habilitado: boolean = true;  // Para deshabilitar el captcha
  @Output() verificado: EventEmitter<boolean> = new EventEmitter<boolean>();

  private operandoA!: number;
  private operandoB!: number;
  private operador: string = '+';
  private resultado!: number;

  private inputUsuario!: HTMLInputElement;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    if (!this.habilitado) {
      this.verificado.emit(true);
      return;
    }

    this.crearCaptcha();
  }

  private crearCaptcha() {
    // Crear elementos del captcha
    const container = this.renderer.createElement('div');
    this.renderer.setStyle(container, 'display', 'flex');
    this.renderer.setStyle(container, 'align-items', 'center');
    this.renderer.setStyle(container, 'gap', '5px');

    this.operandoA = this.generarNumero();
    this.operandoB = this.generarNumero();
    this.resultado = this.operandoA + this.operandoB;

    const spanA = this.renderer.createElement('span');
    const spanOp = this.renderer.createElement('span');
    const spanB = this.renderer.createElement('span');
    const input = this.renderer.createElement('input');

    this.inputUsuario = input;

    this.renderer.setAttribute(input, 'type', 'number');
    this.renderer.setAttribute(input, 'placeholder', 'Resultado');

    spanA.innerText = this.operandoA.toString();
    spanOp.innerText = this.operador;
    spanB.innerText = this.operandoB.toString();

    this.renderer.appendChild(container, spanA);
    this.renderer.appendChild(container, spanOp);
    this.renderer.appendChild(container, spanB);
    this.renderer.appendChild(container, input);

    this.renderer.appendChild(this.el.nativeElement, container);
  }

  private generarNumero(): number {
    return Math.floor(Math.random() * 10) + 1;
  }

  @HostListener('input') onInput() {
    if (!this.habilitado) return;

    const valor = Number(this.inputUsuario.value);
    this.verificado.emit(valor === this.resultado);
  }
}
