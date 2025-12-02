import { DocumentData, DocumentReference, Timestamp } from "@angular/fire/firestore";
import { EstadoTurno } from "./estadosTurno";
import { IEncuesta } from "./I_encuesta";
import { puntaje } from "./I_puntuacion";
import { IDiagnostico } from "./I_DIagnostico";

export interface ITurno {
    uid?: string,
    id_especialista: DocumentReference<any>;
    especialista: string; ///apellido+ nombre
    id_paciente: DocumentReference<any>;
    paciente: string; ///apellido +nombre
    especialidad:string,
    fecha:string,
    hora:string,
    estado:EstadoTurno,
    fecha_emision:Date | Timestamp;

    resenia?:string, ////cargado por el paciente /// comentario del paciente
    encuesta?:IEncuesta,  /// cargada por el usuario //// OPCIONAL
    clasificacion?:puntaje, /// puntaje general de la experiencia del paciente 
    
    diagnostico?:IDiagnostico, //// cargado por el especialista al finalizar un turno
    comentario_especialista?:string
    comentario_paciente?:string
    comentario_administracion?:string
}