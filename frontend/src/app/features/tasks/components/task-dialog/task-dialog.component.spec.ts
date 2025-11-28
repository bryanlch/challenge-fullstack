import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDialogComponent } from './task-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../../../core/services/user.service';
import { of } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

describe('TaskDialogComponent', () => {
  let component: TaskDialogComponent;
  let fixture: ComponentFixture<TaskDialogComponent>;

  const userServiceMock = {
    getUsers: jasmine.createSpy('getUsers').and.returnValue(of([
      { uid: 'u1', name: 'User 1' },
      { uid: 'u2', name: 'User 2' }
    ]))
  };

  const dialogRefMock = {
    close: jasmine.createSpy('close')
  };

  const defaultDialogData = { task: null, currentUserId: 'u1' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDialogComponent, ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: defaultDialogData },
        { provide: UserService, useValue: userServiceMock },
        provideAnimations()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería manejar el cambio de modo Supervisor correctamente', () => {
    expect(component.isSupervisorMode()).toBeFalse();
    expect(component.form.get('assignedToId')?.value).toBe('u1');

    component.form.get('asSupervisor')?.setValue(true);
    fixture.detectChanges();

    expect(component.isSupervisorMode()).toBeTrue();
    expect(component.form.get('assignedToId')?.value).toBeNull();

    component.form.get('asSupervisor')?.setValue(false);
    fixture.detectChanges();

    expect(component.form.get('assignedToId')?.value).toBe('u1');
  });

  it('NO debería cerrar el diálogo si el formulario es inválido', () => {
    component.form.patchValue({ title: '' });

    component.onSave();

    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });

  it('debería enviar los datos limpios al guardar', () => {
    component.form.patchValue({
      title: 'Nueva Tarea',
      description: 'Descripción',
      assignedToId: 'u1'
    });

    component.onSave();

    expect(dialogRefMock.close).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Nueva Tarea',
      description: 'Descripción'
    }));
  });
});