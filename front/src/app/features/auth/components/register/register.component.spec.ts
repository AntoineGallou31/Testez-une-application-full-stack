import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

import { RegisterComponent } from './register.component';
import {of, throwError} from "rxjs";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {Router} from "@angular/router";

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(async () => {
    mockAuthService = {
      register: jest.fn()
    } as any;

    mockRouter = {
      navigate: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test: should create the component
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test: should create account and redirect to /login
  it('should create account and redirect to /login', () => {
    mockAuthService.register.mockReturnValue(of(void 0));
    component.form.setValue({
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123'
    });

    component.submit();

    expect(mockAuthService.register).toHaveBeenCalledWith({
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123'
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    expect(component.onError).toBeFalsy();
  });

  // Test: should show error if a required field is missing
  it('should show error if a required field is missing', () => {
    component.form.setValue({
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: ''
    });

    expect(component.form.valid).toBeFalsy();
  });

  // Test: should show error if service returns error
  it('should show error if service returns error', () => {
    mockAuthService.register.mockReturnValue(throwError(() => new Error('Error')));
    component.form.setValue({
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123'
    });

    component.submit();

    expect(component.onError).toBeTruthy();
  });
});
