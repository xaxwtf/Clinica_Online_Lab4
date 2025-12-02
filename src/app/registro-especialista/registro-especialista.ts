import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { captchaValidator, noNumbersValidator, passwordsMatchValidator } from '../Validators/Validators';
import { AuthService } from '../Servicios/auth.service';
import { Router } from '@angular/router';
import { SUsuarios } from '../Servicios/s-usuarios';
import { IEspecialistaDB } from '../Models/I_EspecialistaDB';
import { Rol } from '../Models/Rol';
import { collection, getDocs } from '@angular/fire/firestore';
import { EspecialidadesService } from '../Servicios/s-especialidad';

import  {  FontAwesomeModule  } from '@fortawesome/angular-fontawesome' ;
import { faCoffee, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { DisponibilidadPorDia } from '../Models/I_disponibilidadPorDia';
import { DisponibilidadPorEspecialidad } from '../Models/I_disponibilidadPorEspecialidad';

@Component({
  selector: 'app-registro-especialista',
  imports: [ReactiveFormsModule,FontAwesomeModule],
  templateUrl: './registro-especialista.html',
  styleUrl: './registro-especialista.css'
})
export class RegistroEspecialista {

  faCoffee = faArrowsRotate;

  public registro:FormGroup;
  selectedFiles:File[]=[];
  public operadores:string[]= ["+","-","*","/"];
  public operadorChapta:string='';

  protected especialidadesExistentes:{id:string, nombre:string}[]=[]; ///supongo que estoy constuyendo un array con la estrutura determinada


  constructor(private fb:FormBuilder, private serv_Usuario:SUsuarios, private router:Router, private serv_Especialidades:EspecialidadesService){
    this.registro =this.fb.group({
      nombre: ['', [Validators.required, noNumbersValidator, Validators.minLength(2) ]],
      apellido: ['', [Validators.required, noNumbersValidator, Validators.minLength(2)]],
      dni: ['',Validators.required],
      especialidad: this.fb.control<string[]>([]),
      correoElectronico:['',[Validators.required, Validators.email]],
      contrasenia: ['',Validators.required],
      contraseniaConf:['',Validators.required],
      edad:[, Validators.required],
      imgPerfil:[],
      operandoA: [''],
      operador: [''],
      operandoB: [''],
      resultadoChapta: [''],
    },
    { validators: [ 
      passwordsMatchValidator('contrasenia', 'contraseniaConf'),
      captchaValidator
    ]
    }
  );
  }

  async ngOnInit(){
     try {
      this.especialidadesExistentes = await this.serv_Especialidades.cargarEspecialidades();
      this.setCaptcha();
    } catch (error) {
      console.error('Error al cargar especialidades:', error);
    }
  }

 onFilesSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  const files = input.files;
  console.log("que tengo antes de seleccionar !!!!!!!!!!!!!!!!!!");
  console.log(this.selectedFiles);
  if (!files || files.length === 0) {
    // Si el usuario canceló la selección, limpiamos
    this.selectedFiles = [];
    return;
  }

  // Guardamos solo la primera imagen seleccionada
  this.selectedFiles = Array.from(files).slice(0, 1) as File[];
  console.log("que termino teniendo en la lsita");
  console.log('Archivo seleccionado:', this.selectedFiles);
}


onToggleEspecialidad(nombre: string, checked: boolean) {
  const control = this.registro.get('especialidad');

  if (!control) return;

  let lista = control.value as string[];

  if (checked) {
    // Agregar especialidad si no estaba
    if (!lista.includes(nombre)) {
      lista = [...lista, nombre];
    }
  } else {
    // Quitar la especialidad si se desmarca
    lista = lista.filter(e => e !== nombre);
  }

  control.patchValue(lista);
  console.log("Especialidades seleccionadas:", lista);
}

async agregarEspecialidadNueva(input: HTMLInputElement) {
  const nombre = input.value.trim();
  if (!nombre) return;

  // Verificar si existe
  const existe = this.especialidadesExistentes
    .find(e => e.nombre.toLowerCase() === nombre.toLowerCase());

  if (existe) {
    this.onToggleEspecialidad(existe.nombre, true);
    input.value = '';  // <--- limpiamos acá
    return;
  }

  // Crear nueva
  const id = await this.serv_Especialidades.obtenerOcrearEspecialidad(nombre);
  this.especialidadesExistentes.push({ id, nombre });
  this.onToggleEspecialidad(nombre, true);

  input.value = ''; // <--- limpiar después de crear
}
    

async registrarUsuario() {
  const { 
    correoElectronico, 
    contrasenia, 
    nombre, 
    apellido, 
    edad, 
    dni, 
    especialidad,
    imgPerfilUno 
  } = this.registro.value;

  // Aseguramos que especialidad es un array
  const especialidadesSeleccionadas = Array.isArray(especialidad) 
    ? especialidad 
    : [especialidad].filter(e => e); // evita null/empty


    // Días de la semana vacíos
const diasPorDefecto: DisponibilidadPorDia = {
  lunes: [],
  martes: [],
  miercoles: [],
  jueves: [],
  viernes: [],
  sabado: [],
  domingo: []
};

// Crear disponibilidad por cada especialidad seleccionada
const disponibilidad: DisponibilidadPorEspecialidad = {};

especialidadesSeleccionadas.forEach(esp => {
  disponibilidad[esp] = { ...diasPorDefecto };
});

  const aux: IEspecialistaDB = {
    Nombre: nombre,
    Apellido: apellido,
    Edad: edad,
    DNI: dni,
    especialidad: especialidadesSeleccionadas,
    ImagenesDePerfil: [imgPerfilUno],
    rol: Rol.Especialista,
    activo: false, /// inicializamos a todos lo usuario inhabilitados
    disponibilidad
  };

  console.log("DATOS!");
  console.log(aux);

  try {
    const r = await this.serv_Usuario.register(
      correoElectronico,
      contrasenia,
      aux,
      this.selectedFiles!
    );

    if (!r) {
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
