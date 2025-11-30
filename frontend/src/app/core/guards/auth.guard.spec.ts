import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';
import { of } from 'rxjs';

describe('authGuard', () => {
   let authServiceSpy: jasmine.SpyObj<AuthService>;
   let routerSpy: jasmine.SpyObj<Router>;

   beforeEach(() => {
      authServiceSpy = jasmine.createSpyObj('AuthService', [], { user$: of(null) });
      routerSpy = jasmine.createSpyObj('Router', ['navigate']);

      TestBed.configureTestingModule({
         providers: [
            { provide: AuthService, useValue: authServiceSpy },
            { provide: Router, useValue: routerSpy }
         ]
      });
   });

   it('should redirect to login if no user', (done) => {
      (Object.getOwnPropertyDescriptor(authServiceSpy, 'user$')?.get as jasmine.Spy).and.returnValue(of(null));

      TestBed.runInInjectionContext(() => {
         const result = authGuard({} as any, {} as any);

         (result as any).subscribe((isAllowed: boolean) => {
            expect(isAllowed).toBeFalse();
            expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
            done();
         });
      });
   });

   it('should allow access if user exists', (done) => {
      (Object.getOwnPropertyDescriptor(authServiceSpy, 'user$')?.get as jasmine.Spy).and.returnValue(of({ uid: '1' }));

      TestBed.runInInjectionContext(() => {
         const result = authGuard({} as any, {} as any);
         (result as any).subscribe((isAllowed: boolean) => {
            expect(isAllowed).toBeTrue();
            expect(routerSpy.navigate).not.toHaveBeenCalled();
            done();
         });
      });
   });
});