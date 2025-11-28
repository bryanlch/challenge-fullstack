import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
   private http = inject(HttpClient);
   private apiUrl = environment.apiUrl + '/users';

   checkUserExists(email: string): Observable<{ exists: boolean }> {
      return this.http.get<{ exists: boolean }>(`${this.apiUrl}/public/check/${email}`);
   }

   createProfile(user: { name: string; lastname: string; email: string }): Observable<any> {
      return this.http.post(this.apiUrl, user);
   }

   getUsers(term?: string): Observable<Array<{
      uid: unknown;
      name: string; lastname: string; email: string
   }>> {
      return this.http.get<Array<{ uid: string; name: string; lastname: string; email: string }>>(`${this.apiUrl}`, {
         params: term ? { term } : {}
      });
   }
}