import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../Servicios/auth.service';
import { SUsuarios } from '../Servicios/s-usuarios';
import { Rol } from '../Models/Rol';
import { ServicesLogs } from '../Servicios/services-logs';
import { IAdmin } from '../Models/I_Admin';
import { IEspecialista } from '../Models/I_Especialista';
import { Pacientes } from '../Models/Pacientes';
import { IPaciente } from '../Models/i_Paciente';


@Component({
  selector: 'app-c-login',
  imports: [ReactiveFormsModule],
  templateUrl: './c-login.html',
  styleUrl: './c-login.css'
})
export class CLogin {

  login:FormGroup;
  private serv_Usuario=inject(SUsuarios)
  private serv_logs=inject(ServicesLogs);
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

        this.serv_logs.settearLog(r.user.uid).then(resp=> localStorage.setItem('idLogActual', resp.id));
        ////validar que tipo de usuario se logeo para cambiar de ruta
        this.serv_Usuario.getUserLoged().then(r=>{
          switch(r?.rol){
            case Rol.Admin:
               sessionStorage.setItem('usuarioLogueado', JSON.stringify(r as IAdmin));
              this.route.navigate(['menuAdmin']);
              break
            case Rol.Especialista:
              sessionStorage.setItem('usuarioLogueado', JSON.stringify(r as IEspecialista));
              this.route.navigate(['perfil']);
              break;
            case Rol.Paciente:
              sessionStorage.setItem('usuarioLogueado', JSON.stringify(r as IPaciente));
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
