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

  // Define spies
  let authSpy: jasmine.SpyObj<AuthService>;
  let userSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    // Create spies
    authSpy = jasmine.createSpyObj('AuthService', ['loginWithEmail', 'registerWithEmail']);
    userSpy = jasmine.createSpyObj('UserService', ['checkUserExists', 'createProfile']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.returnValue(Promise.resolve(true));
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

  it('should login and navigate if user exists', () => {
    // 1. Configure form
    component.emailForm.setValue({ email: 'exist@test.com' });

    // 2. Mock positive response (User exists)
    userSpy.checkUserExists.and.returnValue(of({ exists: true }));

    // 3. Execute
    component.checkUser();

    // Verify state change
    expect(component.step()).toBe('password');

    // 4. Fill password and login
    component.passwordForm.setValue({ password: '123' });
    authSpy.loginWithEmail.and.returnValue(of({})); // Success

    component.login();

    expect(authSpy.loginWithEmail).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should open registration if user does not exist', () => {
    component.emailForm.setValue({ email: 'new@test.com' });

    // 1. Mock that it does NOT exist
    userSpy.checkUserExists.and.returnValue(of({ exists: false }));

    // 2. KEY: Mock Dialog.open return
    // Must return an object with afterClosed() returning an Observable
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({ name: 'New', password: '123' }) });
    dialogSpy.open.and.returnValue(dialogRefSpyObj);

    // 3. Mock the rest of the successful flow
    authSpy.registerWithEmail.and.returnValue(of({}));
    userSpy.createProfile.and.returnValue(of({}));

    // 4. Execute
    component.checkUser();

    // 5. Verifications
    expect(dialogSpy.open).toHaveBeenCalled();
    expect(authSpy.registerWithEmail).toHaveBeenCalled();
    expect(userSpy.createProfile).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks']);
  });
});