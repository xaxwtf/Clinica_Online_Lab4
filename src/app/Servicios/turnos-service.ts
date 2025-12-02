import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc
} from '@angular/fire/firestore';

import { ITurno } from '../Models/I_turnos';
import { DisponibilidadService } from './s-disponibilidad';
import { DiaSemana } from '../Models/tipos-disponibilidad';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { IEspecialista } from '../Models/I_Especialista';
import { IEspecialistaDB } from '../Models/I_EspecialistaDB';
import { EstadoTurno } from '../Models/estadosTurno';
import { DisponibilidadPorDia } from '../Models/I_disponibilidadPorDia';
import { Rol } from '../Models/Rol';
import { AuthService } from './auth.service';
import { puntaje } from '../Models/I_puntuacion';
import { IEncuesta } from '../Models/I_encuesta';
import { IDiagnostico } from '../Models/I_DIagnostico';

@Injectable({ providedIn: 'root' })
export class TurnosService {

  private firestore = inject(Firestore);
  private disponibilidadService = inject(DisponibilidadService);
  private auth_service=inject(AuthService)

  private colTurnos = collection(this.firestore, 'Turnos');
  private colUsuarios = collection(this.firestore, 'Usuarios');


  constructor() {}

  // ---------------------------------------------------------------------
  // ⭐ Obtener todos los especialistas
  // ---------------------------------------------------------------------
  getEspecialistas() {
    const q = query(this.colUsuarios, where('rol', '==', 'especialista'));
    return collectionData(q, { idField: 'uid' });
  }

  // ---------------------------------------------------------------------
  // ⭐ Obtener todos los turnos
  // ---------------------------------------------------------------------
async getAllTurnos(): Promise<ITurno[]> {
const snapshot = await getDocs(this.colTurnos);

const turnos: ITurno[] = snapshot.docs.map(d => {
    const data = d.data();
    return {
      uid: d.id,
      id_especialista: data['id_especialista'] as DocumentReference<any>,
      especialista: data['especialista'],
      id_paciente: data['id_paciente'] as DocumentReference<any>,
      paciente: data['paciente'],
      especialidad: data['especialidad'],
      fecha: data['fecha'],
      hora: data['hora'],
      fecha_emision: data['fecha_emision'],
      estado: data['estado'] as EstadoTurno,
      ...(data['resenia'] && { resenia: data['resenia'] }),
      ...(data['encuesta'] && { encuesta: data['encuesta'] }),
      ...(data['clasificacion'] && { clasificacion: data['clasificacion'] }),
      ...(data['diagnostico'] && { diagnostico: data['diagnostico'] }),
      ...(data['comentario_especialista'] && { comentario_especialista: data['comentario_especialista'] }),
      ...(data['comentario_paciente'] && { comentario_paciente: data['comentario_paciente'] }),
    } as ITurno;


});

return turnos;
}


  // ---------------------------------------------------------------------
  // ⭐ Crear turno
  // ---------------------------------------------------------------------
  async crearTurno(turno: ITurno) {
    return await addDoc(this.colTurnos, turno);
  }



  async getTurnosPorFiltros(filtros: { columna: string; valor: any }[]) {
    let q: any = this.colTurnos; // CollectionReference

    filtros.forEach(f => {
      let valorFiltro = f.valor;

      // Transformar a DocumentReference si la columna es de tipo referencia
     if ((f.columna === 'id_paciente' || f.columna === 'id_especialista') && typeof f.valor === 'string') {
        valorFiltro = doc(this.firestore, 'Usuarios', f.valor); 
        console.log("la columna es: ", f.columna)
      }
      else{
        console.log("ERROR la columna es: ", f.columna)
        console.log(valorFiltro);
      }

      q = query(q, where(f.columna, '==',valorFiltro));
    });
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ uid: d.id, ...d.data() as ITurno }));
  }

  async getTurnosDisponibles(fecha: string, especialidad: string): Promise<ITurno[]> {
  const especialistasSnap = await getDocs(
    query(this.colUsuarios,
      where('rol', '==', Rol.Especialista),
      where('especialidad', 'array-contains', especialidad),
      where('activo', '==', true)
    )
  );

    const especialistas: IEspecialistaDB[] =  especialistasSnap.docs.map(d => ({ uid: d.id, ...d.data() } as IEspecialistaDB));

    const turnosDisponibles: ITurno[] = [];

    const diaSemana = this.obtenerDiaSemana(fecha) as keyof DisponibilidadPorDia;

    for (const especialista of especialistas) {

      const franjas = especialista.disponibilidad?.[especialidad]?.[diaSemana] || [];

      for (const franja of franjas) {
        const totalTurnos = franja.totalTurnos || 1;
        const [hhInicio, mmInicio] = franja.desde.split(':').map(Number);

        const duracionTurno = 30;
        const totalMinutos= hhInicio*60 + mmInicio;

        for (let i = 0; i < totalTurnos; i++) {
          const horaTurno = totalMinutos + duracionTurno * i;
          const hh = Math.floor(horaTurno / 60);
          const mm = horaTurno % 60;
          const horaStr = `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;

          // Aquí buscar si ya existe un turno reservado para este especialista, fecha y hora
          if (!especialista?.uid) {
            throw new Error("El especialista no tiene UID definido");
          }
          const turnoExistenteSnap = await getDocs(
            query(this.colTurnos,
              where('id_especialista', '==', doc(this.firestore, 'Usuarios', especialista.uid)),
              where('fecha', '==', fecha),
              where('hora', '==', horaStr)
            )
          );

          if (turnoExistenteSnap.empty) {
            // Turno libre
            turnosDisponibles.push({
              id_especialista: doc (this.firestore, 'Usuarios', especialista.uid),
              especialista: `${especialista.Apellido} ${especialista.Nombre}`,
              id_paciente: null as any,
              paciente: 'Disponible',
              especialidad,
              fecha,
              hora: horaStr,
              estado: EstadoTurno.DISPONIBLE,
              fecha_emision: new Date()
            });
          } else {
            console.log("turnoOcupado!!!!");
            // Turno ocupado
            /*turnoExistenteSnap.docs.forEach(d => {
              const data = d.data() as ITurno;
              turnosDisponibles.push({
                uid: d.id,
                id_especialista: data['id_especialsita'],
                especialista: data.especialista,
                id_paciente: data.id_paciente,
                paciente: data.paciente,
                especialidad: data.especialidad,
                fecha: data.fecha,
                hora: data.hora,
                estado: data.estado,
                resenia: data.resenia,
                diagnostico: data.diagnostico
              });
            });*/
          }
        }
      }
    }

    return turnosDisponibles;
  }
  private obtenerDiaSemana(fecha: string): string {
    // Soporta formato YYYY-MM-DD
    if (fecha.includes('-')) {
      const [yyyy, mm, dd] = fecha.split('-').map(Number);
      const date = new Date(yyyy, mm - 1, dd);
      return ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'][date.getDay()];
    }

    // Formato DD/MM/YYYY
    const [dd, mm, yyyy] = fecha.split('/').map(Number);
    const date = new Date(yyyy, mm - 1, dd);
    return ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'][date.getDay()];
  }
  public async settearEstadoTurno(turno: ITurno, nuevoEstado: EstadoTurno): Promise<void> {
    if (!turno.uid) {
      throw new Error("El turno no tiene UID, no se puede actualizar.");
    }

    // Referencia al documento del turno en Firestore
    const refTurno = doc(this.firestore, 'Turnos', turno.uid);

    // Actualizar solamente el estado
    await updateDoc(refTurno, {
      estado: nuevoEstado
    });
  }

      public async settearEstadoTurnov2( turno: ITurno, nuevoEstado: EstadoTurno, otrosCambios?: { diagnostico?: IDiagnostico; comentario?:string }): Promise<void> {

      if (!turno.uid) {
        throw new Error("El turno no tiene UID.");
      }
      const refTurno = doc(this.firestore, 'Turnos', turno.uid);

      // Validaciones según el estado
      switch (nuevoEstado) {

        case EstadoTurno.FINALIZADO:
          if (!otrosCambios || !otrosCambios.diagnostico ) {
            throw new Error("Para finalizar un turno debes proporcionar un diagnóstico.");
          }
              // Actualizar solamente el estado
            await updateDoc(refTurno, {
              estado: nuevoEstado,
              diagnostico:otrosCambios.diagnostico
            });

          break;
        case EstadoTurno.CANCELADO_PACIENTE:
          if (!otrosCambios || !otrosCambios.comentario || otrosCambios.comentario.length < 3 ) {
            throw new Error("Para cancelar un turno es necesaria una razón.");
          }
            await updateDoc(refTurno, {
              estado: nuevoEstado,
              comentario_paciente: otrosCambios.comentario
            });

          break;
        case EstadoTurno.CANCELADO_ESPECIALISTA:
          if (!otrosCambios || !otrosCambios.comentario || otrosCambios.comentario.length < 3) {
            throw new Error("Para cancelar un turno es necesaria una razón.");
          }
              await updateDoc(refTurno, {
              estado: nuevoEstado,
              comentario_especialista: otrosCambios.comentario
            });

          break;

        case EstadoTurno.RECHAZADO:
          if (!otrosCambios || !otrosCambios.comentario || otrosCambios.comentario.length < 3) {
            throw new Error("Para rechazar un turno es necesario dejar un comentario.");
          }
              await updateDoc(refTurno, {
              estado: nuevoEstado,
              comentario_especialista: otrosCambios.comentario
            });
          break;
        case EstadoTurno.RECHAZADO_ADMINISTRACION:
            if (!otrosCambios || !otrosCambios.comentario || otrosCambios.comentario.length < 3) {
            throw new Error("Para rechazar un turno es necesario dejar un comentario.");
          }
              await updateDoc(refTurno, {
              estado: nuevoEstado,
              comentario_administracion: otrosCambios.comentario
            });
          break;

        default:
              await updateDoc(refTurno, {
              estado: nuevoEstado,
            });
          // No necesita datos adicionales
          break;
      }
    }
    async settearClasificacion(turno:ITurno, clasificacion: puntaje){
      if (!turno.uid) {
        throw new Error("El turno no tiene UID.");
      }
      const refTurno = doc(this.firestore, 'Turnos', turno.uid);
        await updateDoc(refTurno, {
              clasificacion: clasificacion
          });
    }
    async settearResenia(turno:ITurno, resenia: string){
      if (!turno.uid) {
        throw new Error("El turno no tiene UID.");
      }
      const refTurno = doc(this.firestore, 'Turnos', turno.uid);
        await updateDoc(refTurno, {
              resenia: resenia
          });
    }

    async settearEncuesta(turno:ITurno, encuesta: IEncuesta){
      if (!turno.uid) {
        throw new Error("El turno no tiene UID.");
      }
      const refTurno = doc(this.firestore, 'Turnos', turno.uid);
        await updateDoc(refTurno, {
              resenia: encuesta
          });
    }



}
