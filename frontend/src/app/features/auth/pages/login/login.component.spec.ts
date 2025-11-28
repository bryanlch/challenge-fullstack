import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  // Definimos los espías
  let authSpy: jasmine.SpyObj<AuthService>;
  let userSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    // Creamos los espías
    authSpy = jasmine.createSpyObj('AuthService', ['loginWithEmail', 'registerWithEmail']);
    userSpy = jasmine.createSpyObj('UserService', ['checkUserExists', 'createProfile']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: UserService, useValue: userSpy },
        { provide: Router, useValue: routerSpy },
        provideAnimations()
      ]
    })
      .overrideComponent(LoginComponent, {
        remove: { imports: [MatDialogModule] },
        add: {
          providers: [
            { provide: MatDialog, useValue: dialogSpy },
            { provide: MatSnackBar, useValue: snackBarSpy }
          ]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería loguear y navegar si el usuario existe', () => {
    // 1. Configuramos el form
    component.emailForm.setValue({ email: 'exist@test.com' });

    // 2. Mockeamos respuesta positiva (Usuario existe)
    userSpy.checkUserExists.and.returnValue(of({ exists: true }));

    // 3. Ejecutamos
    component.checkUser();

    // Verificamos cambio de estado
    expect(component.step()).toBe('password');

    // 4. Llenamos password y logueamos
    component.passwordForm.setValue({ password: '123' });
    authSpy.loginWithEmail.and.returnValue(of({})); // Éxito

    component.login();

    expect(authSpy.loginWithEmail).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('debería abrir registro si el usuario no existe', () => {
    component.emailForm.setValue({ email: 'new@test.com' });

    // 1. Mockeamos que NO existe
    userSpy.checkUserExists.and.returnValue(of({ exists: false }));

    // 2. CLAVE: Mockeamos el retorno del Dialog.open
    // Debe devolver un objeto que tenga afterClosed() que devuelva un Observable
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({ name: 'New', password: '123' }) });
    dialogSpy.open.and.returnValue(dialogRefSpyObj);

    // 3. Mockeamos el resto del flujo exitoso
    authSpy.registerWithEmail.and.returnValue(of({}));
    userSpy.createProfile.and.returnValue(of({}));

    // 4. Ejecutamos
    component.checkUser();

    // 5. Verificaciones
    expect(dialogSpy.open).toHaveBeenCalled();
    expect(authSpy.registerWithEmail).toHaveBeenCalled();
    expect(userSpy.createProfile).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks']);
  });
});