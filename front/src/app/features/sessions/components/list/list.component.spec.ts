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
import {By} from "@angular/platform-browser";
import { DetailComponent } from '../detail/detail.component';
import {Router} from "@angular/router";
import { Location } from '@angular/common';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let mockSessionService: any;
  let mockSessionApiService: any;
  let router: Router;
  let location: Location;

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
      declarations: [ListComponent, DetailComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'detail/:id', component: DetailComponent }
        ]),
        HttpClientModule,
        MatCardModule,
        MatIconModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router.initialNavigation();

  });

  // (Unit Test) Verify component creation
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // (Unit Test) Verify that session information is fetched and displayed correctly
  it('should fetch and display session information correctly', () => {
    // Verify that the service is called
    expect(mockSessionApiService.all).toHaveBeenCalled();

    // When
    // Verify that the sessions are displayed
    fixture.detectChanges();

    // Then
    const sessionElements = fixture.debugElement.queryAll(By.css('.item'));
    expect(sessionElements.length).toBe(mockSessions.length);

    // Verify the content of a session
    const firstSession = sessionElements[0].nativeElement;
    expect(firstSession.textContent).toContain(mockSessions[0].name);
    expect(firstSession.textContent).toContain('Session on');
  });

// (Unit Test) Verify that "Create" and "Detail" buttons appear if the user is admin
  it('should display "Create" and "Detail" buttons if the user is admin', () => {
    // Verify that the user is admin
    expect(component.user?.admin).toBe(true);

    // When
    fixture.detectChanges();

    // Then
    // Verify that the "Create" button is present
    const createButton = fixture.debugElement.query(By.css('button[routerLink="create"]'));
    expect(createButton).toBeTruthy();
    expect(createButton.nativeElement.textContent).toContain('Create');

    // Verify that the "Detail" button is present for each session
    const detailButtons = fixture.debugElement.queryAll(By.css('.detail-button'));
    expect(detailButtons.length).toBe(mockSessions.length);
    detailButtons.forEach((button, index) => {
      expect(button.nativeElement.textContent).toContain('Detail');
    });
  });

  it('should navigate to the detail component when clicking on the "Detail" button', async () => {
    // When
    fixture.detectChanges();

    // Then
    const detailButton = fixture.debugElement.query(By.css('.detail-button'));
    expect(detailButton).toBeTruthy();

    detailButton.nativeElement.click();
    await fixture.whenStable();

    expect(location.path()).toBe('/detail/1');
  });
});
