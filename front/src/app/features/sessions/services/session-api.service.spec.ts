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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test fetching all sessions
  it('should fetch all sessions with all()', () => {
    service.all().subscribe(sessions => {
      expect(sessions).toEqual(mockSession);
    });
    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('GET');
    req.flush(mockSession);
  });

  // Test fetching session details
  it('should fetch session detail with detail()', () => {
    service.detail('1').subscribe(session => {
      expect(session).toEqual(mockSession);
    });
    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockSession);
  });

  // Test deleting a session
  it('should delete a session with delete()', () => {
    service.delete('1').subscribe(response => {
      expect(response).toEqual({});
    });
    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  // Test creating a session
  it('should create a session with create()', () => {
    service.create(mockSession).subscribe(session => {
      expect(session).toEqual(mockSession);
    });
    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockSession);
    req.flush(mockSession);
  });

  // Test updating a session
  it('should update a session with update()', () => {
    service.update('1', mockSession).subscribe(session => {
      expect(session).toEqual(mockSession);
    });
    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockSession);
    req.flush(mockSession);
  });

  // Test participating in a session
  it('should participate in a session with participate()', () => {
    service.participate('1', '42').subscribe(response => {
      expect(response).toBeUndefined();
    });
    const req = httpMock.expectOne('api/session/1/participate/42');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeNull();
    req.flush(null);
  });

  // Test unparticipating from a session
  it('should unParticipate from a session with unParticipate()', () => {
    service.unParticipate('1', '42').subscribe(response => {
      expect(response).toBeUndefined();
    });
    const req = httpMock.expectOne('api/session/1/participate/42');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
