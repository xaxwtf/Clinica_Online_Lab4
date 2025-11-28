import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../Servicios/auth.service';
import { SUsuarios } from '../Servicios/s-usuarios';
import { Rol } from '../Models/Rol';


@Component({
  selector: 'app-c-login',
  imports: [ReactiveFormsModule],
  templateUrl: './c-login.html',
  styleUrl: './c-login.css'
})
export class CLogin {

  login:FormGroup;
  private serv_Usuario=inject(SUsuarios)
  errorLogin:boolean = false;
  constructor( private route: Router, private authService: AuthService, private fb:FormBuilder) {
      this.hideStatusBar();
      this.login = this.fb.group({
      correoElectronico:['',[Validators.required, Validators.email]],
      contrasenia: ['',Validators.required],
    })
  }
  ngOnInit() {
  this.login.reset();
  }
async ValidarLogin(){
    this.errorLogin=false;
    try{
      const {correoElectronico, contrasenia} = this.login.value;
      await this.authService.login(correoElectronico, contrasenia).then((r)=>{
        ////validar que tipo de usuario se logeo para cambiar de ruta
        this.serv_Usuario.getUserLoged().then(r=>{
          switch(r?.rol){
            case Rol.Admin:
              this.route.navigate(['menuAdmin']);
              break
            case Rol.Especialista:
              this.route.navigate(['perfil']);
              break;
            case Rol.Paciente:
              this.route.navigate(['perfil']);
              break;
          }
          
        });
  
        
      }).catch((error) => {
        this.errorLogin=true;
      });

    }
    catch(error){
      console.log("es otro error!");
      console.error('Login failed', error);
    }
  }
  redirectRegistro(){
    this.route.navigate(['/registro']);
  }
    async hideStatusBar() {
    
  }
  cargarAdmin(){
      this.login.setValue({
      correoElectronico: 'admin@test.com',
      contrasenia: 'admin123456789'
    });
  }
    cargarEspecialista(){
      this.login.setValue({
      correoElectronico: 'xaxwtf@gmail.com',
      contrasenia: '123456789'
    });
  }
    cargarPacienteI(){
      this.login.setValue({
      correoElectronico: 'pg@gmail.com',
      contrasenia: '123456789'
    });
  }
    cargarPacienteII(){
      this.login.setValue({
      correoElectronico: 'jp@gmail.com',
      contrasenia: '123456789'
    });
  }
    cargarPacienteIII(){
      this.login.setValue({
      correoElectronico: 'cezi@gmail.com',
      contrasenia: '123456789'
    });
  }
    cargarEspecialistaII(){
      this.login.setValue({
      correoElectronico: 'alice@test.com',
      contrasenia: '123456789'
    });
  }
}
