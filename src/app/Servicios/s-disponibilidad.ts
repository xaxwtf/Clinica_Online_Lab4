import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { IEspecialistaDB } from '../Models/I_EspecialistaDB';
import { DisponibilidadPorEspecialidad } from '../Models/I_disponibilidadPorEspecialidad';
import { DisponibilidadPorDia } from '../Models/I_disponibilidadPorDia';
import { Auth } from '@angular/fire/auth';
import { RangoHorario } from '../Models/I_disponibilidadPorHora';

@Injectable({
  providedIn: 'root'
})
export class DisponibilidadService {

  private firestore = inject(Firestore);
  private auth=inject(Auth);

  constructor() {}

  private diasPorDefecto: DisponibilidadPorDia = {
    lunes: [], martes: [], miercoles: [], jueves: [], viernes: [], sabado: [], domingo: []
  };

  /**
   * Obtener toda la disponibilidad de un especialista
   * Inicializa los días para cada especialidad si aún no existen
   */
  async obtenerDisponibilidad(especialistaId: string): Promise<DisponibilidadPorEspecialidad> {
    const snap = await getDoc(doc(this.firestore, 'Usuarios', especialistaId));
    if (!snap.exists()) return {};

    const usuario = snap.data() as IEspecialistaDB;
    const dispo: DisponibilidadPorEspecialidad = usuario.disponibilidad || {};

    // Inicializar disponibilidad por cada especialidad
    usuario.especialidad.forEach(esp => {
      if (!dispo[esp]) {
        dispo[esp] = { ...this.diasPorDefecto };
      } else {
        // Asegurar que todos los días existan al devolverlos
        const dias: (keyof DisponibilidadPorDia)[] = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
        dias.forEach(dia => {
          if (!dispo[esp][dia]) dispo[esp][dia] = [];
        });
      }
    });

    return dispo;
  }

  /**
   * Obtener la disponibilidad de un especialista para una especialidad específica
   */
  async obtenerDisponibilidadPorEspecialidad(
    especialistaId: string, 
    especialidad: string
  ): Promise<DisponibilidadPorDia> {
    const dispo = await this.obtenerDisponibilidad(especialistaId);
    return dispo[especialidad] || { ...this.diasPorDefecto };
  }

  /**
   * Guardar o actualizar toda la disponibilidad de un especialista
   */
  async guardarDisponibilidad( especialistaId: string, disponibilidad: DisponibilidadPorEspecialidad): Promise<void> {
    const ref = doc(this.firestore, 'Usuarios', especialistaId);
    await updateDoc(ref, { disponibilidad });
  }

  /**
   * Guardar o actualizar la disponibilidad de un dia de una especialidad específica
   * Mantiene el resto de las especialidades intactas
   */
    async guardarDisponibilidadPorEspecialidad( especialistaId: string, especialidad: string, disponibilidadDia: DisponibilidadPorDia ): Promise<void> {
        const ref = doc(this.firestore, 'Usuarios', especialistaId);
        const snap = await getDoc(ref);

        if (!snap.exists()) return;

        const usuario = snap.data() as IEspecialistaDB;
        const dispoActual: DisponibilidadPorEspecialidad = usuario.disponibilidad || {};

        // Inicializar la especialidad si no existe
        dispoActual[especialidad] = disponibilidadDia;

        await updateDoc(ref, { disponibilidad: dispoActual });
    }


    async setFranjaHoraria( especialistaId: string, especialidad: string, dia: keyof DisponibilidadPorDia, franjas: RangoHorario[] ): Promise<void> {
        const ref = doc(this.firestore, 'Usuarios', especialistaId);
        const snap = await getDoc(ref);
        if (!snap.exists()) return;
        

        const usuario = snap.data() as IEspecialistaDB;


        // Inicializar disponibilidad si no existe
        if (!usuario.disponibilidad) {
            usuario.disponibilidad = {};
        }

        const dispoActual: DisponibilidadPorEspecialidad = usuario.disponibilidad;
        console.log(dispoActual);

        // Inicializar especialidad si no existe
        if (!dispoActual[especialidad]) dispoActual[especialidad] = { ...this.diasPorDefecto };

        // Reemplazar la franja correspondiente
        if(franjas.length>0){
          
            dispoActual[especialidad][dia] = [...franjas]; //// guardo las nuevas franjas
            console.log("archivo a modificar del dia " + dia);
            console.log(dispoActual[especialidad][dia]);
        }
        else{
            delete dispoActual[especialidad][dia];
        }
      
        await updateDoc(ref, { disponibilidad: dispoActual });

    }
}
