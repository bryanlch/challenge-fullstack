import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { environment } from '../../../environments/environment';

describe('UserService', () => {
   let service: UserService;
   let httpMock: HttpTestingController;

   beforeEach(() => {
      TestBed.configureTestingModule({
         imports: [HttpClientTestingModule],
         providers: [UserService]
      });
      service = TestBed.inject(UserService);
      httpMock = TestBed.inject(HttpTestingController);
   });

   afterEach(() => {
      httpMock.verify();
   });

   it('should be created', () => {
      expect(service).toBeTruthy();
   });

   it('checkUserExists should GET /users/check/:email', () => {
      const email = 'test@test.com';
      const mockResponse = { exists: true };

      service.checkUserExists(email).subscribe(res => {
         expect(res.exists).toBeTrue();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users/public/check/${email}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
   });
});