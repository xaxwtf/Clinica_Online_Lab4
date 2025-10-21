import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../Servicios/auth.service';
import { noNumbersValidator, passwordsMatchValidator } from '../Validators/Validators';
import { RegistroEspecialista } from '../registro-especialista/registro-especialista';
import { RegistroPaciente } from '../registro-paciente/registro-paciente';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RegistroEspecialista, RegistroPaciente],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  registro:FormGroup;
  test:boolean=true;
  paciente:string="active";
  especialista:string="inactive underlineHover";

  

  constructor(private router:Router, private fb:FormBuilder, private authService:AuthService) { 
      this.registro = this.fb.group({
        nombre: ['', [Validators.required, noNumbersValidator, Validators.minLength(2) ]],
        apellido: ['', [Validators.required, noNumbersValidator, Validators.minLength(2)]],
        correoElectronico:['',[Validators.required, Validators.email]],
        contrasenia: ['',Validators.required],
        contraseniaConf:['',Validators.required]
      },
      { validators: passwordsMatchValidator('contrasenia', 'contraseniaConf') }
    );
  }
  
  ngOnInit() {}
async registrarUsuario() {
  const { correoElectronico, contrasenia, nombre, apellido } = this.registro.value;

  try {
    const r = await this.authService.register(correoElectronico, contrasenia, nombre, apellido);
    if (r == null) {
      console.log("No se ha registrado el usuario");
    } else {
      console.log("Usuario registrado con éxito");
      this.router.navigate(['/home']);
    }
  } catch (error) {
    console.error("Error al registrar usuario:", error);
  }
}
 

  redirectLogin(){
    this.registro.reset();
    this.router.navigate(['/login']);
  }
  swapCategoria(){
    this.test=!this.test; 
    if(this.especialista=="active"){
      this.especialista="inactive underlineHover";
    }
    else{
      this.especialista="active";
    }
    if(this.paciente=="active"){
      this.paciente="inactive underlineHover";
    }
    else{
      this.paciente="active";
    }
    
    return true;
  }
}
