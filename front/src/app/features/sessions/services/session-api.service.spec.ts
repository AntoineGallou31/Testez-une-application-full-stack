import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionApiService } from './session-api.service';
import { Session } from '../interfaces/session.interface';

describe('SessionsService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;

  const mockSession: Session = {
    id: 1,
    name: 'Test Session',
    description: 'Test session description',
    date: new Date(),
    teacher_id: 2,
    users: [1, 3, 5],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

// (Unit Test) Verify service creation
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // (Unit Test) Test HTTP GET request for fetching all sessions
  it('should fetch all sessions with all()', () => {
    // When
    service.all().subscribe(sessions => {
      expect(sessions).toEqual(mockSession);
    });

    // Then
    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('GET');
    req.flush(mockSession);
  });

  // (Unit Test) Test HTTP GET request for fetching session details
  it('should fetch session detail with detail()', () => {
    // When
    service.detail('1').subscribe(session => {
      expect(session).toEqual(mockSession);
    });

    // Then
    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockSession);
  });

  // (Unit Test) Test HTTP DELETE request for session deletion
  it('should delete a session with delete()', () => {
    // When
    service.delete('1').subscribe(response => {
      expect(response).toEqual({});
    });

    // Then
    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  // (Unit Test) Test HTTP POST request for session creation
  it('should create a session with create()', () => {
    // When
    service.create(mockSession).subscribe(session => {
      expect(session).toEqual(mockSession);
    });

    // Then
    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockSession);
    req.flush(mockSession);
  });

  // (Unit Test) Test HTTP DELETE request for session not-participation
  it('should participate in a session with participate()', () => {
    // When
    service.participate('1', '42').subscribe(response => {
      expect(response).toBeUndefined();
    });
    // Then
    const req = httpMock.expectOne('api/session/1/participate/42');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeNull();
    req.flush(null);
  });

});
