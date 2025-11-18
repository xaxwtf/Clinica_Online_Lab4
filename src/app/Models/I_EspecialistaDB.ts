import { DocumentReference } from "@angular/fire/compat/firestore";
import { IUsuarioDB } from "./I_UsuarioDB";
import { Rol } from "./Rol";

export interface IEspecialistaDB extends IUsuarioDB{
    especialidad:string;
    especialidadRef?:DocumentReference;
    rol:Rol.Especialista;
    activo:boolean;
}