import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import {SessionInformation} from "../interfaces/sessionInformation.interface";

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  // (Unit Test) Verify service creation
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // (Unit Test) Verify user login and session information storage
  it('should log in the user with logIn', () => {

    // Given
    const user: SessionInformation = {
      token: 'abcd1234',
      type: 'Bearer',
      id: 1,
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      admin: false
    };
    // When
    service.logIn(user);
    // Then
    expect(service.isLogged).toBeTruthy();
    expect(service.sessionInformation).toEqual(user);
  });

  // (Unit Test) Verify user logout and session information clearing
  it('should log out the user with logOut', () => {
    // Given
    const user: SessionInformation = {
      token: 'abcd1234',
      type: 'Bearer',
      id: 1,
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      admin: false
    };
    // When
    service.logIn(user);
    service.logOut();
    // Then
    expect(service.isLogged).toBeFalsy();
    expect(service.sessionInformation).toBeUndefined();
  });

  // (Unit Test) Verify isLogged observable emits correct value
  it('should emit the correct value with $isLogged', (done) => {
    // Then
    service.$isLogged().subscribe(isLogged => {
      expect(isLogged).toBeFalsy();
      done();
    });
  });
});
