import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { noNumbersValidator, passwordsMatchValidator } from '../Validators/Validators';
import { AuthService } from '../Servicios/auth.service';
import { Router } from '@angular/router';
import { SUsuarios } from '../Servicios/s-usuarios';
import { IEspecialistaDB } from '../Models/I_EspecialistaDB';
import { Rol } from '../Models/Rol';
import { collection, getDocs } from '@angular/fire/firestore';
import { EspecialidadesService } from '../Servicios/s-especialidad';

@Component({
  selector: 'app-registro-especialista',
  imports: [ReactiveFormsModule],
  templateUrl: './registro-especialista.html',
  styleUrl: './registro-especialista.css'
})
export class RegistroEspecialista {
  public registro:FormGroup;
  selectedFiles:File[]=[];

  protected especialidadesExistentes:{id:string, nombre:string}[]=[]; ///supongo que estoy constuyendo un array con la estrutura determinada


  constructor(private fb:FormBuilder, private serv_Usuario:SUsuarios, private router:Router, private serv_Especialidades:EspecialidadesService){
    this.registro =this.fb.group({
      nombre: ['', [Validators.required, noNumbersValidator, Validators.minLength(2) ]],
      apellido: ['', [Validators.required, noNumbersValidator, Validators.minLength(2)]],
      dni: ['',Validators.required],
      especialidad: ['',Validators.required],
      correoElectronico:['',[Validators.required]],
      contrasenia: ['',Validators.required],
      contraseniaConf:['',Validators.required],
      edad:[, Validators.required],
      imgPerfil:[],
    },
    { validators: passwordsMatchValidator('contrasenia', 'contraseniaConf') }
  );
  }

  async ngOnInit(){
     try {
      this.especialidadesExistentes = await this.serv_Especialidades.cargarEspecialidades();
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

  seleccionarUnaEspecialidadExistente(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const valorSeleccionado = selectElement.value;

    //Actualiza el control 'especialidad' en el FormGroup
    this.registro.patchValue({
      especialidad: valorSeleccionado
    });

    console.log('Especialidad seleccionada:', valorSeleccionado);
  }
    

  async registrarUsuario() {
    const { correoElectronico, contrasenia, nombre, apellido, edad, dni, especialidad,  imgPerfilUno } = this.registro.value;

    const aux = {
      Nombre:nombre,
      Apellido:apellido,
      Edad:edad,
      DNI:dni,
      especialidad:especialidad,
      ImagenesDePerfil:[imgPerfilUno], ///utilizo un array para cargar 1 o N imagenes
      rol:Rol.Especialista,
      activo:false  //// inicializo a todos los especialistas inhabilitados!!;
    } as IEspecialistaDB;
    console.log("DATOS!");
    console.log(aux);

  try {
    const r = await this.serv_Usuario.register(correoElectronico, contrasenia, aux, this.selectedFiles!);
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
}
