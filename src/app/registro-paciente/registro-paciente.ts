import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { noNumbersValidator, passwordsMatchValidator } from '../Validators/Validators';

@Component({
  selector: 'app-registro-paciente',
  imports: [ReactiveFormsModule],
  templateUrl: './registro-paciente.html',
  styleUrl: './registro-paciente.css'
})
export class RegistroPaciente {
  public registro:FormGroup;
  constructor(private fb:FormBuilder){
    this.registro =this.fb.group({
      nombre: ['', [Validators.required, noNumbersValidator, Validators.minLength(2) ]],
      apellido: ['', [Validators.required, noNumbersValidator, Validators.minLength(2)]],
      correoElectronico:['',[Validators.required, Validators.email]],
      contrasenia: ['',Validators.required],
      contraseniaConf:['',Validators.required]
    },
    { validators: passwordsMatchValidator('contrasenia', 'contraseniaConf') }
  );
  }
}
