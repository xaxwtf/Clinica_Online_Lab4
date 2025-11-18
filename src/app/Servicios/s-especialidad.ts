import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, doc, getDoc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService {

  constructor(private firestore: Firestore) {}

  // 🔹 Cargar todas las especialidades
  async cargarEspecialidades(): Promise<{ id: string, nombre: string }[]> {
    const colRef = collection(this.firestore, 'Especialidades');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(d => ({
      id: d.id,
      nombre: (d.data() as any).nombre
    }));
  }

  // 🔹 Crear una especialidad si no existe
  async obtenerOcrearEspecialidad(nombre: string): Promise<string> {
    const id = nombre.trim().toLowerCase().replace(/\s+/g, '_');
    const docRef = doc(this.firestore, `Especialidades/${id}`);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      await setDoc(docRef, { nombre });
    }

    return id;
  }
}

