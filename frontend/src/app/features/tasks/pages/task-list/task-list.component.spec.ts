import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../../../core/services/task.service';
import { AuthService } from '../../../../core/services/auth.service';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';

// Mocks simples
const mockTaskService = {
  getTasks: jest.fn().mockReturnValue(of([
    { id: '1', title: 'Test Task', assignedToId: 'uid-1', supervisorId: 'uid-1' }
  ]))
};

const mockAuthService = {
  user$: of({ uid: 'uid-1' })
};

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListComponent], // Standalone
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatDialog, useValue: {} }, // Mock vacío
        provideAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Dispara ngOnInit
  });

  it('debería cargar las tareas al iniciar', () => {
    // Verificamos que se llamó al servicio
    expect(mockTaskService.getTasks).toHaveBeenCalled();
    // Verificamos que la señal (Signal) se actualizó
    expect(component.tasks().length).toBe(1);
    expect(component.tasks()[0].title).toBe('Test Task');
  });

  it('debería filtrar correctamente "Mis Tareas"', () => {
    // Como el usuario logueado es 'uid-1' y la tarea es para 'uid-1'
    expect(component.myTasks().length).toBe(1);
  });
});