export class Persona{
        public _nombre:string;
        public _apellido:string;
        public _edad:number;
        public _dni:string;
        public _mail:string;
        public _contrasenia:string;

        constructor(nombre:string, apellido:string, edad:number, dni:string, mail:string, contrasenia:string){
            this._nombre=nombre;
            this._apellido=apellido;
            this._edad=edad;
            this._dni=dni;
    
            this._mail=mail;
            this._contrasenia=contrasenia;
        }
}