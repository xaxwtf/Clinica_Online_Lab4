import { Injectable, inject } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  UserCredential,
  Auth
} from 'firebase/auth';
import { 
  getFirestore, 
  Firestore, 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  setDoc 
} from 'firebase/firestore';

interface Item {
  nombres: string;
  apellidos: string;
  id?: string;
}

export interface UserWithMail extends Item {
  mail: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private app: FirebaseApp = inject(FirebaseApp);
  private auth: Auth = getAuth(this.app);
  private firestore: Firestore = getFirestore(this.app);

  // --------------------
  // LOGIN
  async login(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  // --------------------
  // LOGOUT
  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  // --------------------
  // REGISTRO
  async register(email: string, password: string, nombre: string, apellido: string): Promise<UserCredential | null> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      await setDoc(doc(this.firestore, 'Usuarios', userCredential.user.uid), {
        id: userCredential.user.uid,
        nombres: nombre,
        apellidos: apellido,
        creado: new Date()
      });
      return userCredential;
    } catch (error) {
      console.error('Error registrando usuario:', error);
      return null;
    }
  }

  // --------------------
  // OBTENER USUARIO LOGEADO (con listener)
  async getUserLoged(): Promise<UserWithMail | null> {
    return new Promise(resolve => {
      const unsubscribe = onAuthStateChanged(this.auth, async user => {
        unsubscribe(); // dejamos de escuchar
        if (!user) return resolve(null);

        const q = query(collection(this.firestore, 'Usuarios'), where('id', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const docSnap = querySnapshot.docs[0];
        if (!docSnap) return resolve(null);

        const data = docSnap.data() as Item;
        resolve({
          id: docSnap.id,
          nombres: data.nombres,
          apellidos: data.apellidos,
          mail: user.email!
        });
      });
    });
  }
}
