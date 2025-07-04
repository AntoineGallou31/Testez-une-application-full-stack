import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { TeacherService } from './teacher.service';
import {Teacher} from "../interfaces/teacher.interface";

describe('TeacherService', () => {
  let service: TeacherService;
  let httpMock: HttpTestingController;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    httpMock.verify();
  });

  // (Unit Test) Verify service creation
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // (Unit Test) Test HTTP GET request for fetching all teachers
  it('should fetch all teachers with all()', () => {
    // Given
    const mockTeachers: Teacher[] = [
      { id: 1, firstName: 'Alice', lastName: 'Dupont', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, firstName: 'Bob', lastName: 'Martin', createdAt: new Date(), updatedAt: new Date() }
    ];

    // When
    service.all().subscribe(teachers => {
      expect(teachers).toEqual(mockTeachers);
    });

    // Then
    const req = httpMock.expectOne('api/teacher');
    expect(req.request.method).toBe('GET');
    req.flush(mockTeachers);
  });

  // (Unit Test) Test HTTP GET request for fetching teacher details
  it('should fetch teacher detail with detail()', () => {
    // Given
    const mockTeacher: Teacher = { id: 1, firstName: 'Alice', lastName: 'Dupont', createdAt: new Date(), updatedAt: new Date() };

    // When
    service.detail('1').subscribe(teacher => {
      expect(teacher).toEqual(mockTeacher);
    });

    // Then
    const req = httpMock.expectOne('api/teacher/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockTeacher);
  });
});
