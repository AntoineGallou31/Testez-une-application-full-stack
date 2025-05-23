import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { UserService } from './user.service';
import { User } from '../interfaces/user.interface';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    httpMock.verify();
  });

  // (Unit Test) Verify service creation
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // (Unit Test) Test HTTP GET request for user retrieval
  it('should call GET with correct URL in getById', () => {
    // Given
    const mockUser: User = {
      id: 1,
      password: 'test1234!',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      admin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // When
    service.getById('1').subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    // Then
    const req = httpMock.expectOne('api/user/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  // (Unit Test) Test HTTP DELETE request for user deletion
  it('should call DELETE with correct URL in delete', () => {

    // When
    service.delete('2').subscribe(response => {
      expect(response).toBeTruthy();
    });

    // Then
    const req = httpMock.expectOne('api/user/2');
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });
});
