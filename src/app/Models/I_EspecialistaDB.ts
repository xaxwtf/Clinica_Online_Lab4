import { DocumentReference } from "@angular/fire/compat/firestore";
import { IUsuarioDB } from "./I_UsuarioDB";
import { Rol } from "./Rol";
import { DisponibilidadPorEspecialidad } from "./I_disponibilidadPorEspecialidad";

export interface IEspecialistaDB extends IUsuarioDB{
    especialidad: string[];
    especialidadRef?: DocumentReference[];
    rol:Rol.Especialista;
    activo:boolean;
    disponibilidad?: DisponibilidadPorEspecialidad
}