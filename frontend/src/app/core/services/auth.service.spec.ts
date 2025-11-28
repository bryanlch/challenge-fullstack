import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Auth } from '@angular/fire/auth';
import { FirebaseWrapperService } from './firebase-wrapper.service';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;

  const authMock = {
    currentUser: null,
    onAuthStateChanged: jasmine.createSpy('onAuthStateChanged'),
    onIdTokenChanged: jasmine.createSpy('onIdTokenChanged'),
    updateCurrentUser: jasmine.createSpy('updateCurrentUser'),
    signOut: jasmine.createSpy('signOut')
  };

  const firebaseWrapperMock = {
    authState: jasmine.createSpy('authState').and.returnValue(of(null))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Auth, useValue: authMock },
        { provide: FirebaseWrapperService, useValue: firebaseWrapperMock }
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});