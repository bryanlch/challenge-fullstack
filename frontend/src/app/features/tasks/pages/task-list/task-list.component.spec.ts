import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../../../core/services/task.service';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    taskServiceSpy = jasmine.createSpyObj('TaskService', ['getTasks', 'createTask', 'updateTask', 'deleteTask']);
    authServiceSpy = jasmine.createSpyObj('AuthService', [], { user$: of({ uid: 'user-1' }) });
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    taskServiceSpy.getTasks.and.returnValue(of([]));
    userServiceSpy.getUsers.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        provideAnimations()
      ]
    })
      .overrideProvider(MatDialog, { useValue: dialogSpy })
      .overrideProvider(MatSnackBar, { useValue: snackBarSpy })
      .compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería cargar tareas al iniciar', () => {
    expect(taskServiceSpy.getTasks).toHaveBeenCalled();
  });

  it('debería mostrar error si falla la carga de tareas', () => {
    taskServiceSpy.getTasks.and.returnValue(throwError(() => new Error('API Fail')));

    component.loadTasks();

    expect(snackBarSpy.open).toHaveBeenCalledWith('Error cargando las tareas', jasmine.any(String), jasmine.any(Object));
  });

  it('debería crear tarea cuando el dialog cierra con datos', () => {
    const dialogResult = { title: 'Nueva', description: 'Desc', assignedToId: 'u-1', status: 'pending' };
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(dialogResult) });
    dialogSpy.open.and.returnValue(dialogRefSpyObj);

    taskServiceSpy.createTask.and.returnValue(of({ ...dialogResult, id: 'new-1' } as any));
    taskServiceSpy.getTasks.and.returnValue(of([]));

    component.openTaskDialog();

    expect(taskServiceSpy.createTask).toHaveBeenCalled();
    expect(snackBarSpy.open).toHaveBeenCalledWith('Tarea creada exitosamente', 'OK', jasmine.any(Object));
  });
});