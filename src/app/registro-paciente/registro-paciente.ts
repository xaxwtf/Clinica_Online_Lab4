import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { captchaValidator, noNumbersValidator, passwordsMatchValidator } from '../Validators/Validators';
import { Router } from '@angular/router';
import { SUsuarios } from '../Servicios/s-usuarios';
import { IPacienteDB } from '../Models/I_PacienteDB';
import { Rol } from '../Models/Rol';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-registro-paciente',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './registro-paciente.html',
  styleUrl: './registro-paciente.css'
})
export class RegistroPaciente {
  public registro:FormGroup;
  selectedFiles: File[]=[];
   faCoffee = faArrowsRotate;

  constructor(private fb:FormBuilder, private router: Router, private serv_Usuario: SUsuarios){
    this.registro =this.fb.group({
      nombre: ['', [Validators.required, noNumbersValidator, Validators.minLength(2) ]],
      apellido: ['', [Validators.required, noNumbersValidator, Validators.minLength(2)]],
      dni: ['',Validators.required],
      //especialidad: ['',Validators.required],
      correoElectronico:['',[Validators.required]],
      contrasenia: ['',Validators.required],
      contraseniaConf:['',Validators.required],
      edad:[, Validators.required],
      obraSocial: ['',Validators.required],
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
  const aux: IPacienteDB={
    Nombre:nombre,
    Apellido:apellido,
    Edad:edad,
    DNI:dni,
    ObraSocial:obraSocial,
    ImagenesDePerfil:[imgPerfilUno,imgPerfilDos],
    rol:Rol.Paciente,
  }

  try {
    const r = await this.serv_Usuario.register(correoElectronico,contrasenia, aux,this.selectedFiles!);
    if (r == null) {
      console.log("No se ha registrado el usuario");
    } else {
      console.log("Usuario registrado con éxito");
      this.router.navigate(['/login']);
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

}
