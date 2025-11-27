import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { environment } from '../../../environments/environment';

describe('TaskService', () => {
   let service: TaskService;
   let httpMock: HttpTestingController;

   beforeEach(() => {
      TestBed.configureTestingModule({
         imports: [HttpClientTestingModule],
         providers: [TaskService]
      });
      service = TestBed.inject(TaskService);
      httpMock = TestBed.inject(HttpTestingController);
   });

   afterEach(() => {
      httpMock.verify();
   });

   it('debería recuperar las tareas (GET)', () => {
      const dummyTasks = [
         { id: '1', title: 'Test Task', status: 'pending' }
      ];

      service.getTasks().subscribe(tasks => {
         expect(tasks.length).toBe(1);
         expect(tasks[0].title).toBe('Test Task');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
      expect(req.request.method).toBe('GET');

      req.flush(dummyTasks);
   });
});