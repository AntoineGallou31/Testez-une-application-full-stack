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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call GET with correct URL in getById', () => {
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
    service.getById('1').subscribe(user => {
      expect(user).toEqual(mockUser);
    });
    const req = httpMock.expectOne('api/user/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should call DELETE with correct URL in delete', () => {
    service.delete('2').subscribe(response => {
      expect(response).toBeTruthy();
    });
    const req = httpMock.expectOne('api/user/2');
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });
});
