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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

// Test that logIn sets the user as logged in and stores session information
  it('should log in the user with logIn', () => {
    const user: SessionInformation = {
      token: 'abcd1234',
      type: 'Bearer',
      id: 1,
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      admin: false
    };
    service.logIn(user);
    expect(service.isLogged).toBeTruthy();
    expect(service.sessionInformation).toEqual(user);
  });

  // Test that logOut logs out the user and clears session information
  it('should log out the user with logOut', () => {
    const user: SessionInformation = {
      token: 'abcd1234',
      type: 'Bearer',
      id: 1,
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      admin: false
    };
    service.logIn(user);
    service.logOut();
    expect(service.isLogged).toBeFalsy();
    expect(service.sessionInformation).toBeUndefined();
  });

  // Test that $isLogged observable emits the correct value
  it('should emit the correct value with $isLogged', (done) => {
    service.$isLogged().subscribe(isLogged => {
      expect(isLogged).toBeFalsy();
      done();
    });
  });
});
