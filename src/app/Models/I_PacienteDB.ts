import { IUsuarioDB } from "./I_UsuarioDB";
import { Rol } from "./Rol";

export interface IPacienteDB extends  IUsuarioDB{
    ObraSocial?: string; 
    rol:Rol.Paciente;
}