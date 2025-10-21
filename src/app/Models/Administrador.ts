import { Persona } from "./Persona";

export class Administrador extends Persona{
    public _imgPerfil:string;
  
    constructor(
        nombre:string, 
        apellido:string, 
        edad:number, 
        dni:string, 
        mail:string, 
        contrasenia:string, 
        img_perfil_uno:string,
      
    ){
        super(nombre,apellido,edad,dni,mail,contrasenia);
        this._imgPerfil=img_perfil_uno;
    }
}