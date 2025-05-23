import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from '../../../../services/teacher.service';
import { DetailComponent } from './detail.component';
import { expect } from '@jest/globals';
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let mockSessionApiService: any;
  let mockTeacherService: any;
  let mockRouter: any;

  // Test data
  const mockSession = {
    id: 1,
    name: 'Test Session',
    description: 'Test session description',
    date: new Date(),
    teacher_id: 2,
    users: [1, 3, 5],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockTeacher = {
    id: 2,
    firstName: 'John',
    lastName: 'Doe'
  };

  // Setup for admin user
  const setupAdminTest = async () => {
    const mockSessionService = {
      sessionInformation: {
        admin: true,
        id: 1
      }
    };

    mockSessionApiService = {
      detail: jest.fn().mockReturnValue(of(mockSession)),
      delete: jest.fn().mockReturnValue(of({}))
    };

    mockTeacherService = {
      detail: jest.fn().mockReturnValue(of(mockTeacher))
    };

    mockRouter = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatIconModule,
        MatCardModule
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  // (Unit Test) Verify component creation
  it('should create', async () => {
    await setupAdminTest();
    expect(component).toBeTruthy();
  });

  // (Unit Test) Verify data fetching and display rendering
  it('should fetch and display session information correctly', async () => {
    // Given
    await setupAdminTest();

    // Verify API calls
    expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
    expect(mockTeacherService.detail).toHaveBeenCalledWith('2');

    // Verify data stored in component
    expect(component.session).toEqual(mockSession);
    expect(component.teacher).toEqual(mockTeacher);

    /// When
    // Verify information display
    fixture.detectChanges();

    // Then
    const sessionNameElement = fixture.debugElement.query(By.css('h1'));
    expect(sessionNameElement.nativeElement.textContent).toContain(mockSession.name);

    const componentText = fixture.nativeElement.textContent;
    expect(componentText).toContain(mockTeacher.firstName);
    expect(componentText).toContain(mockTeacher.lastName.toUpperCase());
  });

  // (Unit Test) Verify that the "Delete" button is displayed for an admin user
  it('should display the delete button if the user is admin', async () => {
    // Given
    await setupAdminTest();

    // When
    // Verify that the "Delete" button is present
    const deleteButton = fixture.debugElement.query(By.css('button[color="warn"]'));
    expect(deleteButton).toBeTruthy();
    expect(deleteButton.nativeElement.textContent).toContain('Delete');
  });

  // (Unit Test) Test navigation functionality
  it('should navigate back when back() is called', () => {
    // Given
    const historySpy = jest.spyOn(window.history, 'back');

    // When
    component.back();

    // Then
    expect(historySpy).toHaveBeenCalled();
  });

});
