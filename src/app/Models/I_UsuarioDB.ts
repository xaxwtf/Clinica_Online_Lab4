import { DocumentReference } from "@angular/fire/firestore";
import { Rol } from "./Rol";
import { DocumentData } from "@angular/fire/compat/firestore";

export interface IUsuarioDB {
  Nombre: string;
  Apellido: string;
  Edad: number;
  DNI: string;
  ImagenesDePerfil:string[];
  uid?: string;
  uidRef?:DocumentReference<DocumentData>
  rol:Rol
  Email?:string;
}