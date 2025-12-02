import { Component, inject } from '@angular/core';
import { IAdmin } from '../Models/I_Admin';
import { Rol } from '../Models/Rol';
import { captchaValidator, noNumbersValidator, passwordsMatchValidator } from '../Validators/Validators';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SUsuarios } from '../Servicios/s-usuarios';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDialogRef } from '@angular/material/dialog';
import { isNumber } from 'highcharts';
import { CaptchaDirective } from '../directivas/CaptchaDirectiva';


@Component({
  selector: 'app-registro-admin',
  imports: [FontAwesomeModule, ReactiveFormsModule, CaptchaDirective],
  templateUrl: './registro-admin.html',
  styleUrl: './registro-admin.css',
})
export class RegistroAdmin {
private dialogRef= inject(MatDialogRef<RegistroAdmin>);
    public registro:FormGroup;
  selectedFiles: File[]=[];
   faCoffee = faArrowsRotate;

  constructor(private fb:FormBuilder, private router: Router, private serv_Usuario: SUsuarios){
    this.registro =this.fb.group({
      nombre: ['', [Validators.required, noNumbersValidator, Validators.minLength(2) ]],
      apellido: ['', [Validators.required, noNumbersValidator, Validators.minLength(2)]],
      dni: ['',Validators.required, Validators.minLength(8),Validators.maxLength(8)],
      //especialidad: ['',Validators.required],
      correoElectronico:['',[Validators.required, Validators.email,]],
      contrasenia: ['',Validators.required, Validators.minLength(6)],
      contraseniaConf:['',Validators.required],
      edad:[, Validators.required, isNumber, isFinite(0) ],
      imgPerfil:[],

      operandoA: [''],
      operador: [''],
      operandoB: [''],
      resultadoChapta: [''],
    
    },
    { validators:[ passwordsMatchValidator('contrasenia', 'contraseniaConf'), captchaValidator ]}
  );
  }
ngOnInit(){
  this.setCaptcha();
}
  



onFilesSelected(event: any) {
  if (event.target.files && event.target.files.length > 0) {
    // Tomamos máximo 2 archivos
    this.selectedFiles = Array.from(event.target.files).slice(0, 2) as File[];
  }
}

  async registrarUsuario() {
  const { correoElectronico, contrasenia, nombre, apellido, edad, dni, obraSocial, imgPerfilUno, imgPerfilDos } = this.registro.value;
  const aux: IAdmin={
    Nombre:nombre,
    Apellido:apellido,
    Edad:edad,
    DNI:dni,
    Email: correoElectronico,
    ImagenesDePerfil:[imgPerfilUno],
    rol:Rol.Admin,
  }

  try {
    const r = await this.serv_Usuario.register(correoElectronico,contrasenia, aux,this.selectedFiles!);
    if (r == null) {
      console.log("No se ha registrado el usuario");
    } else {
      console.log("Usuario registrado con éxito");
     
    }
  } catch (error) {
    console.error("Error al registrar usuario:", error);
  }
}
setCaptcha() {
  const operadores = ['+', '-', '*', '/'];
  const form = this.registro;

  // Elegir operador aleatorio si querés regenerarlo
  const operador = operadores[Math.floor(Math.random() * operadores.length)];
  form.get('operador')?.setValue(operador);

  // Generar operandos aleatorios
  let a = Math.floor(Math.random() * 10) + 1; // 1 a 10
  let b = Math.floor(Math.random() * 10) + 1;

  // Elegir aleatoriamente si el usuario completa A o B
  const completarA = Math.random() < 0.5;

  if(completarA){
    form.get('operandoA')?.reset();        // limpiar para que el usuario ingrese
    form.get('operandoA')?.enable();       // habilitar A
    form.get('operandoB')?.setValue(b);    // fijar B
    form.get('operandoB')?.disable();      // deshabilitar B
  } else {
    form.get('operandoB')?.reset();
    form.get('operandoB')?.enable();
    form.get('operandoA')?.setValue(a);
    form.get('operandoA')?.disable();
  }

  // Calcular resultado
  let resultado = 0;
  switch(operador){
    case '+': resultado = a + b; break;
    case '-': resultado = a - b; break;
    case '*': resultado = a * b; break;
    case '/': resultado = b !== 0 ? a / b : 0; break;
  }

  form.get('resultadoChapta')?.setValue(resultado);
}
onClickRegenerarCatpcha(){
  this.setCaptcha();
}

  cancelar() {
    this.dialogRef.close();
  }
  confirmar() {
    this.registrarUsuario();
    this.dialogRef.close();
  }
  captchaValido: boolean = false;

submit() {
  if (!this.captchaValido) {
    console.log("Captcha incorrecto!");
    return;
  }

  // continuar con el registro
}


}
