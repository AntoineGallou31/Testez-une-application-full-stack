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
        ReactiveFormsModule
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

  // Setup for non-admin user
  const setupNonAdminTest = async () => {
    const mockSessionService = {
      sessionInformation: {
        admin: false,
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

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
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

  it('should create', async () => {
    await setupAdminTest();
    expect(component).toBeTruthy();
  });

  it('should fetch and display session information correctly', async () => {
    await setupAdminTest();

    // Verify API calls
    expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
    expect(mockTeacherService.detail).toHaveBeenCalledWith('2');

    // Verify data stored in component
    expect(component.session).toEqual(mockSession);
    expect(component.teacher).toEqual(mockTeacher);

    // Verify information display
    fixture.detectChanges();
    const sessionNameElement = fixture.debugElement.query(By.css('h1'));
    expect(sessionNameElement.nativeElement.textContent).toContain(mockSession.name);

    const teacherElement = fixture.debugElement.query(By.css('.teacher-info'));
    expect(teacherElement.nativeElement.textContent).toContain(mockTeacher.firstName);
    expect(teacherElement.nativeElement.textContent).toContain(mockTeacher.lastName);
  });

  it('should show delete button if user is admin', async () => {
    await setupAdminTest();
    fixture.detectChanges();

    // Find delete button
    const deleteButton = fixture.debugElement.query(By.css('button[color="warn"]'));

    expect(deleteButton).toBeTruthy();
    expect(deleteButton.nativeElement.textContent).toContain('Delete');
  });

  it('should not show delete button if user is not admin', async () => {
    await setupNonAdminTest();
    fixture.detectChanges();

    // Find delete button
    const deleteButton = fixture.debugElement.query(By.css('button[color="warn"]'));

    expect(deleteButton).toBeFalsy();
  });

  it('should call delete method and navigate when delete button is clicked', async () => {
    await setupAdminTest();

    // Spy on delete method
    jest.spyOn(component, 'delete');

    // Click delete button
    const deleteButton = fixture.debugElement.query(By.css('button[color="warn"]'));
    deleteButton.nativeElement.click();

    expect(component.delete).toHaveBeenCalled();
    expect(mockSessionApiService.delete).toHaveBeenCalledWith('1');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  });
});
