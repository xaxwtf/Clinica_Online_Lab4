import { Rol } from "./Rol";

export interface IUsuarioDB {
  Nombre: string;
  Apellido: string;
  Edad: number;
  DNI: string;
  ImagenesDePerfil:string[];
  uid?: string;
  rol:Rol
}