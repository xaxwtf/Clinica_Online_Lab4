import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../Servicios/auth.service';

@Component({
  selector: 'app-c-login',
  imports: [ReactiveFormsModule],
  templateUrl: './c-login.html',
  styleUrl: './c-login.css'
})
export class CLogin {

  login:FormGroup;

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
        this.route.navigate(['/usuario']);
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
  cargarTest(){
      this.login.setValue({
      correoElectronico: 'test@test.com',
      contrasenia: 'test123'
    });
  }
}
