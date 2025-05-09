import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';

import { MeComponent } from './me.component';
import {User} from "../../interfaces/user.interface";
import {UserService} from "../../services/user.service";
import {of} from "rxjs";
import {Router} from "@angular/router";
import { expect } from '@jest/globals';
import {By} from "@angular/platform-browser";


describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let mockSessionService: Partial<SessionService>;
  let mockMatSnackBar: jest.Mocked<MatSnackBar>;
  let mockUserService: jest.Mocked<UserService>;
  let mockRouter: jest.Mocked<Router>;

  // Static test data that won't change between tests
  const mockUser: User = {
    id: 1,
    password: 'test1234!',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    admin: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    mockSessionService = {
      sessionInformation: {
        token: 'abcd1234',
        type: 'Bearer',
        id: 1,
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        admin: false
      },
      logOut: jest.fn()
    };

    mockMatSnackBar = { open: jest.fn() } as any;

    mockUserService = {
      getById: jest.fn().mockReturnValue(of(mockUser)),
      delete: jest.fn().mockReturnValue(of({}))
    } as any;

    mockRouter = { navigate: jest.fn() } as any;

    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Verify component creation
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Should fetch and set user data when component initializes
  it('should initialize user data on ngOnInit', () => {
    component.ngOnInit();
    expect(mockUserService.getById).toHaveBeenCalledWith('1');
    expect(component.user).toEqual(mockUser);
  });

  // Should use browser history API to navigate back
  it('should navigate back when back() is called', () => {
    const historySpy = jest.spyOn(window.history, 'back');
    component.back();
    expect(historySpy).toHaveBeenCalled();
  });

  // Should handle complete user deletion flow: delete account, show notification, logout and redirect
  it('should delete user and logout when delete() is called', () => {
    component.delete();
    expect(mockUserService.delete).toHaveBeenCalledWith('1');
    expect(mockMatSnackBar.open).toHaveBeenCalledWith(
      'Your account has been deleted !',
      'Close',
      { duration: 3000 }
    );
    expect(mockSessionService.logOut).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  // Should display user information correctly in the template
  it('should display user information correctly', () => {
    const titleElement = fixture.debugElement.query(By.css('h1'));
    const emailElement = fixture.debugElement.query(By.css('mat-card-content p'));

    expect(titleElement.nativeElement.textContent).toContain('My Profile');
    expect(emailElement.nativeElement.textContent).toContain(mockUser.email);
  });

  // Test view update with new user data
  it('should update view when user data is loaded', () => {
    const newUser: User = {
      ...mockUser,
      firstName: 'Jane',
      lastName: 'Smith'
    };

    mockUserService.getById.mockReturnValue(of(newUser));
    component.ngOnInit();
    fixture.detectChanges();

    const nameElement = fixture.debugElement.query(By.css('mat-card-title'));
    expect(nameElement.nativeElement.textContent).toContain('Jane Smith');
  });
});
