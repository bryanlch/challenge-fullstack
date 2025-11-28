import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, User } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { FirebaseWrapperService } from './firebase-wrapper.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private fireWrapper = inject(FirebaseWrapperService);

  // Observable del usuario actual (para usar en Guards y Componentes)
  user$: Observable<User | null> = this.fireWrapper.authState(this.auth);

  // 1. Login con Email/Password
  loginWithEmail(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  // 2. Registro con Email/Password (Crea usuario en Firebase Auth)
  registerWithEmail(email: string, password: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  // 3. Login con Google
  loginWithGoogle(): Observable<any> {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider()));
  }

  // 4. Cerrar Sesión
  logout(): Observable<any> {
    return from(signOut(this.auth));
  }

  // 5. Obtener el Token JWT actual (Vital para el Backend)
  async getToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }
}