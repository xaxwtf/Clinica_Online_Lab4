import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  UserCredential 
} from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private auth = inject(Auth); // ✅ Auth provisto por AngularFire

  // LOGIN
  async login(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  // LOGOUT
  async logout(): Promise<void> {
    await signOut(this.auth);
  }
}