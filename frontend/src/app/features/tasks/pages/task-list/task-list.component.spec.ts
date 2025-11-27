import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../../../core/services/task.service';
import { AuthService } from '../../../../core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    taskServiceSpy = jasmine.createSpyObj('TaskService', ['getTasks', 'createTask', 'updateTask']);
    authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      user$: of({ uid: 'user-1' })
    });
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    taskServiceSpy.getTasks.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        provideAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
  });

  it('debería cargar tareas al iniciar si hay usuario', () => {
    const dummyTasks = [
      { id: '1', title: 'Tarea Propia', assignedToId: 'user-1', supervisorId: 'user-1', status: 'pending' as any, createdAt: new Date(), description: '' },
      { id: '2', title: 'Tarea Supervisada', assignedToId: 'other-user', supervisorId: 'user-1', status: 'pending' as any, createdAt: new Date(), description: '' }
    ];

    taskServiceSpy.getTasks.and.returnValue(of(dummyTasks));

    fixture.detectChanges();

    expect(taskServiceSpy.getTasks).toHaveBeenCalled();
    expect(component.tasks().length).toBe(2);

    expect(component.myTasks().length).toBe(1);
    expect(component.supervisedTasks().length).toBe(1);
  });

  it('debería mostrar error si falla la carga de tareas', () => {
    taskServiceSpy.getTasks.and.returnValue(throwError(() => new Error('API Fail')));

    fixture.detectChanges();

    expect(snackBarSpy.open).toHaveBeenCalledWith('Error cargando las tareas', jasmine.any(String), jasmine.any(Object));
  });

  it('debería crear tarea cuando el dialog cierra con datos', () => {
    fixture.detectChanges();

    const dialogResult = { title: 'Nueva', description: 'Desc', assignedToId: 'u-1', status: 'pending' };

    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(dialogResult) });
    dialogSpy.open.and.returnValue(dialogRefSpyObj);

    taskServiceSpy.createTask.and.returnValue(of({ ...dialogResult, id: 'new-id', userId: 'u-1' } as any));

    component.openTaskDialog();

    expect(taskServiceSpy.createTask).toHaveBeenCalled();
    expect(snackBarSpy.open).toHaveBeenCalledWith('Tarea creada exitosamente', 'OK', jasmine.any(Object));
  });
});