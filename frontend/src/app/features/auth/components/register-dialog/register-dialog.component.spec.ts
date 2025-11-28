import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterDialogComponent } from './register-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('RegisterDialogComponent', () => {
   let component: RegisterDialogComponent;
   let fixture: ComponentFixture<RegisterDialogComponent>;
   let dialogRefSpy: jasmine.SpyObj<MatDialogRef<RegisterDialogComponent>>;

   beforeEach(async () => {
      dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

      await TestBed.configureTestingModule({
         imports: [RegisterDialogComponent, ReactiveFormsModule],
         providers: [
            { provide: MatDialogRef, useValue: dialogRefSpy },
            { provide: MAT_DIALOG_DATA, useValue: { email: 'test@test.com' } },
            provideAnimations()
         ]
      }).compileComponents();

      fixture = TestBed.createComponent(RegisterDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('debería inicializarse con el email inyectado', () => {
      expect(component).toBeTruthy();
      expect(component.form.valid).toBeFalse();
   });

   it('debería cerrar el dialog con datos si el formulario es válido', () => {
      component.form.patchValue({
         name: 'Juan',
         lastname: 'Perez',
         password: '123456'
      });

      expect(component.form.valid).toBeTrue();

      component.onConfirm();

      expect(dialogRefSpy.close).toHaveBeenCalledWith(jasmine.objectContaining({
         name: 'Juan',
         password: '123456'
      }));
   });

   it('debería cerrar con null al cancelar', () => {
      component.onCancel();
      expect(dialogRefSpy.close).toHaveBeenCalledWith(null);
   });
});