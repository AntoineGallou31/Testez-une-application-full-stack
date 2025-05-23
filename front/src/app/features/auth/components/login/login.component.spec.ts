import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockSessionService: jest.Mocked<SessionService>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(async () => {
    mockAuthService = {
      login: jest.fn()
    } as any;

    mockSessionService = {
      logIn: jest.fn()
    } as any;

    mockRouter = {
      navigate: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // (Unit Test) Verify component creation
  it('should create', () => {
    expect(component).toBeTruthy();
  });

// (Unit Test) Verify successful login submission logic
  it('should handle successful login submission', () => {
    // Given
    const sessionInfo = {
      token: 'fake-token',
      type: 'Bearer',
      id: 1,
      username: 'john@test.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: false
    };

    mockAuthService.login.mockReturnValue(of(sessionInfo));

    component.form.setValue({
      email: 'john@test.com',
      password: 'password123'
    });

    // When
    component.submit();

    // Then
    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: 'john@test.com',
      password: 'password123'
    });
    expect(mockSessionService.logIn).toHaveBeenCalledWith(sessionInfo);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
    expect(component.onError).toBeFalsy();
  });


// (Unit Test) Test form submission with error handling in the UI
  it('should integrate form submission with error handling', async () => {
    // Given
    // Simulate authentication error
    mockAuthService.login.mockReturnValue(throwError(() => new Error('Auth failed')));

    // Fill the form
    const emailInput = fixture.debugElement.query(By.css('input[formControlName="email"]'));
    const passwordInput = fixture.debugElement.query(By.css('input[formControlName="password"]'));
    const form = fixture.debugElement.query(By.css('form'));

    emailInput.nativeElement.value = 'test@test.com';
    emailInput.nativeElement.dispatchEvent(new Event('input'));

    passwordInput.nativeElement.value = 'password123';
    passwordInput.nativeElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    //When
    // Submit the form
    form.triggerEventHandler('submit', null);
    fixture.detectChanges();

    //Then
    // Check error message display
    expect(component.onError).toBeTruthy();
    const errorMessage = fixture.debugElement.query(By.css('.error'));
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.nativeElement.textContent).toContain('An error occurred');
  });
});
