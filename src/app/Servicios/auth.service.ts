import { Injectable, inject, signal } from '@angular/core';
import { Auth, authState, User } from '@angular/fire/auth';
import { signInWithEmailAndPassword, signOut, UserCredential } from 'firebase/auth';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private auth = inject(Auth);

  // 1) OBSERVABLE DEL USUARIO
  currentUser$ = authState(this.auth);

  // 2) SIGNAL DEL USUARIO (para usar currentUser() )
  currentUser = signal<User | null>(null);

  // 3) OBSERVABLE BOOLEANO
  isLoggedIn$ = this.currentUser$.pipe(map(u => !!u));

  constructor() {
    // Sincronizar el signal con el observable
    this.currentUser$.subscribe(user => this.currentUser.set(user));
  }

  // LOGIN
  async login(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  // LOGOUT
  async logout(): Promise<void> {
    return await signOut(this.auth);
  }

  // 4) Getter útil
  get uid(): string | null {
    return this.currentUser()?.uid ?? null;
  }
}