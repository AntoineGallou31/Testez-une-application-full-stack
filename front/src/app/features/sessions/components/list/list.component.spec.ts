import { HttpClientModule } from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {BehaviorSubject, of} from 'rxjs';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { ListComponent } from './list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Session } from '../../interfaces/session.interface';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let mockSessionService: any;
  let mockSessionApiService: any;

  const mockSessions = [
    {
      id: 1,
      name: 'Session 1',
      description: 'Desc 1',
      date: new Date('2024-01-01'),
      teacher_id: 1,
      users: []
    },
    {
      id: 2,
      name: 'Session 2',
      description: 'Desc 2',
      date: new Date('2024-01-02'),
      teacher_id: 2,
      users: []
    }
  ];

  beforeEach(async () => {

    const sessionsSubject = new BehaviorSubject<Session[]>(mockSessions);

    mockSessionService = {
      sessionInformation: {
        token: 'fake-token',
        type: 'Bearer',
        id: 1,
        username: 'user',
        firstName: 'Test',
        lastName: 'User',
        admin: true
      }
    };
    mockSessionApiService = { all: jest.fn().mockReturnValue(sessionsSubject) };

    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientModule, MatCardModule, MatIconModule, RouterTestingModule],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    //component.sessions$ = new BehaviorSubject<Session[]>(mockSessions);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive and store sessions from the service', (done) => {
    component.sessions$.subscribe(sessions => {
      expect(sessions).toEqual(mockSessions);
      done();
    });
  });
});
