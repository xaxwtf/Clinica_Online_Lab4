import { Persona } from "./Persona";

export class Especialista extends Persona{
    public _especialidad:string;
    public _imagenPerfil:string;
    constructor(
        nombre:string, 
        apellido:string, 
        edad:number, 
        dni:string, 
        mail:string, 
        contrasenia:string,
        especialidad:string,
        imagenPerfil:string,
        activo:boolean
    ){
        super(nombre,apellido,edad,dni,mail,contrasenia);
        this._especialidad=especialidad;
        this._imagenPerfil=imagenPerfil;
    }
}