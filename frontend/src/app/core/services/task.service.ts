import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

interface TaskCreatePayload {
   title: string;
   description: string;
   supervisorId: string;
   assignedToId: string;
}

@Injectable({
   providedIn: 'root'
})
export class TaskService {
   private http = inject(HttpClient);
   private apiUrl = `${environment.apiUrl}/tasks`;

   getTasks(): Observable<Task[]> {
      return this.http.get<Task[]>(this.apiUrl);
   }

   createTask(payload: TaskCreatePayload): Observable<Task> {
      return this.http.post<Task>(this.apiUrl, payload);
   }

   updateTask(id: string, changes: Partial<Task>): Observable<void> {
      return this.http.put<void>(`${this.apiUrl}/${id}`, changes);
   }

   deleteTask(id: string): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
   }
}