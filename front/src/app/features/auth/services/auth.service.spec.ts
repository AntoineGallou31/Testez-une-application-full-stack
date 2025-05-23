import {AuthService} from "./auth.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {LoginRequest} from "../interfaces/loginRequest.interface";
import {TestBed} from "@angular/core/testing";
import { expect } from '@jest/globals';


describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockLoginRequest: LoginRequest = {
      email: "joe@hotmail.fr",
      password: "password",
  };

  const mockRegisterRequest = {
    email: "joe@hotmail.fr",
    password: "password",
    firstName: "Joe",
    lastName: "Doe"
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // (Unit Test) Verify service creation
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // (Unit Test) Test HTTP POST request for user registration
  it('should register a user with register()', () => {
    // When
    service.register(mockRegisterRequest).subscribe(response => {
      expect(response).toBeUndefined();
    });

    //Then
    const req = httpMock.expectOne('api/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  // (Unit Test) Test HTTP POST request for user login
  it('should login a user with login()', () => {
    // When
    service.login(mockLoginRequest).subscribe(response => {
      expect(response).toBeDefined();
    });

    // Then
    const req = httpMock.expectOne('api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

});
