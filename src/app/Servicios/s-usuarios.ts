import { inject, Injectable } from '@angular/core';
import { 
  Firestore,
  collection,
  doc,
  getDocs,
  query,
  where,
  setDoc,
  addDoc,
  updateDoc,
  getDoc,
  DocumentReference
} from '@angular/fire/firestore';

import { 
  createUserWithEmailAndPassword, 
  onAuthStateChanged,
} from 'firebase/auth';


import { IUsuarioDB } from '../Models/I_UsuarioDB';
import { Auth } from '@angular/fire/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';
import { EspecialidadesService } from './s-especialidad';






@Injectable({
  providedIn: 'root'
})
export class SUsuarios {


  private auth = inject(Auth);          // Auth desde AngularFire DI
  private firestore = inject(Firestore); // Firestore desde AngularFire DI
   private especialidadesService = inject(EspecialidadesService);

  constructor() {}

  // REGISTRO
async register<T extends IUsuarioDB>(
  email: string,
  password: string,
  data: T,
  files: File[],
) {
  const cred = await createUserWithEmailAndPassword(this.auth, email, password);

  // 🔹 Subida de imágenes
  if (files && files.length > 0) {
    const storage = getStorage();

    // Aseguramos que el array esté limpio
    if (!Array.isArray(data.ImagenesDePerfil)) {
      data.ImagenesDePerfil = [];
    } else {
      // Eliminamos posibles nulos previos
      data.ImagenesDePerfil = data.ImagenesDePerfil.filter(img => img != null);
    }

    for (const file of files) {
      const storageRef = ref(storage, `usuarios/${cred.user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const fileURL = await getDownloadURL(storageRef);
      if (fileURL) data.ImagenesDePerfil.push(fileURL);
    }

    // Limitar a máximo 2 imágenes (por tu diseño)
    data.ImagenesDePerfil = data.ImagenesDePerfil.slice(0, 2);
  }

  /// Si el usuario es especialista, crear/validar sus especialidades
  if ('especialidad' in data && Array.isArray(data.especialidad)) {

    const referencias: DocumentReference[] = [];

    for (const esp of data.especialidad) {
      const espId = await this.especialidadesService.obtenerOcrearEspecialidad(esp);
      const espRef = doc(this.firestore, `Especialidades/${espId}`);
      referencias.push(espRef);
    }

    // Guardar el array de especialidades y sus referencias
    (data as any).especialidad = [...data.especialidad];
    (data as any).especialidadRef = referencias;
  }

  // 🔹 Limpieza final antes de guardar
  const datosLimpios = {
    ...data,
    ImagenesDePerfil: (data.ImagenesDePerfil || []).filter(img => img != null),
    uid: cred.user.uid,
    Email: cred.user.email!,
    creado: new Date(),
  };

  await setDoc(doc(this.firestore, 'Usuarios', cred.user.uid), datosLimpios);

  return cred;
}


  // OBTENER USUARIO LOGUEADO
async getUserLoged(): Promise<IUsuarioDB | null> {
  return new Promise(resolve => {
    onAuthStateChanged(this.auth, async user => {
      if (!user) return resolve(null);

      const ref = doc(this.firestore, 'Usuarios', user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) return resolve(null);

      resolve(snap.data() as IUsuarioDB);
    });
  });
}

 async getUsuariosByCampo<T>(campo: string, valor: any): Promise<T[]> {  //// me devuelve un usuario, y devuelve undefined si
  const q = query(
    collection(this.firestore, 'Usuarios'),
    where(campo, '==', valor)
  );
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({
    uid: doc.id,
    ...doc.data()
  })) as T[];
}

 async actualizarEstadoEspecialista(uid: string, estado: boolean): Promise<void> {
    const ref = doc(this.firestore, 'Usuarios', uid);

    await updateDoc(ref, {
      activo: estado
    });
  }
  async obtenerUsuario(uid: string) {
    const ref = doc(this.firestore, 'Usuarios', uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return { uid, ...snap.data()};
  }
}
