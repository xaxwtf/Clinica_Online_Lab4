import { Persona } from "./Persona";

export class Pacientes extends Persona{
    public _obraSocial:string;
    public _imgPerfilUno:string;
    public _imgPerfilDos:string;
    constructor(
        nombre:string, 
        apellido:string, 
        edad:number, 
        dni:string, 
        mail:string, 
        contrasenia:string,

        obra_social:string, 
        img_perfil_uno:string,
        img_perfil_dos:string
    ){
        super(nombre,apellido,edad,dni,mail,contrasenia);
        this._obraSocial=obra_social;
        this._imgPerfilDos=img_perfil_dos;
        this._imgPerfilUno=img_perfil_uno;
    }
}