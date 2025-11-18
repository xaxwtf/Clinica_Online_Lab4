import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { noNumbersValidator, passwordsMatchValidator } from '../Validators/Validators';
import { Router } from '@angular/router';
import { SUsuarios } from '../Servicios/s-usuarios';
import { IPacienteDB } from '../Models/I_PacienteDB';
import { Rol } from '../Models/Rol';

@Component({
  selector: 'app-registro-paciente',
  imports: [ReactiveFormsModule],
  templateUrl: './registro-paciente.html',
  styleUrl: './registro-paciente.css'
})
export class RegistroPaciente {
  public registro:FormGroup;
  selectedFiles: File[]=[];

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
    
    },
    { validators: passwordsMatchValidator('contrasenia', 'contraseniaConf') }
  );
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
}
