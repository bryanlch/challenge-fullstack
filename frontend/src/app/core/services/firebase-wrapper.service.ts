import { Injectable } from '@angular/core';
import { Auth, user, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirebaseWrapperService {
   authState(auth: Auth): Observable<User | null> {
      return user(auth);
   }
}
