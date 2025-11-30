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

   it('should initialize with injected email', () => {
      expect(component).toBeTruthy();
      expect(component.form.valid).toBeFalse();
   });

   it('should close dialog with data if form is valid', () => {
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

   it('should close with null on cancel', () => {
      component.onCancel();
      expect(dialogRefSpy.close).toHaveBeenCalledWith(null);
   });
});