import { inject, Injectable } from '@angular/core';
import { addDoc, collection, doc, DocumentReference, Firestore, getDocs, updateDoc } from '@angular/fire/firestore';
import { ILogs } from '../Models/I_Logs';



@Injectable({
  providedIn: 'root',
})
export class ServicesLogs {
  private firestore = inject(Firestore); // Firestore desde AngularFire DI
  private tablaLogs = collection(this.firestore, 'Logs');

  async getAllLogs(): Promise<ILogs []> {
    const snapshot = await getDocs(this.tablaLogs);

          const historial_de_log: ILogs[] = snapshot.docs.map(d => {
              const data = d.data();
              return {
                uid_usuario: data['uid_usuario'],
                log_in: data['log_in'],
                log_out: data['log_out'],
              } as ILogs;
           });
           return historial_de_log;
    }
  // 👇 Guarda log de ingreso
  async settearLog(uid_usuario: string): Promise<DocumentReference> {
    try {
      const ref = await addDoc(this.tablaLogs, {
        uid_usuario,
        log_in: new Date(),  // Se autocompleta la fecha/hora del login
        log_out: null        // Se completa al hacer logout
      });

      return ref; // devolver ID para luego cerrar el log
    } catch (error) {
      console.error('Error al setear log:', error);
      throw error;
    }
  }

  // 👇 Cerrar log (logout)
  async settearLogOut(idLog: string): Promise<void> {
    try {
      const ref = doc(this.firestore, `Logs/${idLog}`);
      await updateDoc(ref, {
        log_out: new Date()
      });
    } catch (error) {
      console.error('Error al settear log_out:', error);
      throw error;
    }
  }
}
