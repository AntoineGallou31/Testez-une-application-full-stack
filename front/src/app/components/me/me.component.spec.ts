import { HttpClientModule } from '@angular/common/http';
  import { ComponentFixture, TestBed } from '@angular/core/testing';
  import { MatCardModule } from '@angular/material/card';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatIconModule } from '@angular/material/icon';
  import { MatInputModule } from '@angular/material/input';
  import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
  import { SessionService } from 'src/app/services/session.service';
  import { MeComponent } from './me.component';
  import { User } from '../../interfaces/user.interface';
  import { UserService } from '../../services/user.service';
  import { of } from 'rxjs';
  import { Router } from '@angular/router';
  import { expect } from '@jest/globals';
  import { By } from '@angular/platform-browser';

  describe('MeComponent', () => {
    let component: MeComponent;
    let fixture: ComponentFixture<MeComponent>;
    let mockSessionService: Partial<SessionService>;
    let mockMatSnackBar: jest.Mocked<MatSnackBar>;
    let mockUserService: jest.Mocked<UserService>;
    let mockRouter: jest.Mocked<Router>;

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

    // (Unit Test) Check component creation
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    // (Unit Test) Verify initialization of user data
    it('should initialize user data on ngOnInit', () => {
      // When
      component.ngOnInit();

      // Then
      expect(mockUserService.getById).toHaveBeenCalledWith('1');
      expect(component.user).toEqual(mockUser);
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

    // (Unit Test) Verify delete method functionality
    it('should delete user and logout when delete() is called', () => {
      // When
      component.delete();

      // Then
      expect(mockUserService.delete).toHaveBeenCalledWith('1');
      expect(mockMatSnackBar.open).toHaveBeenCalledWith(
        'Your account has been deleted !',
        'Close',
        { duration: 3000 }
      );
      expect(mockSessionService.logOut).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    // (Unit Test) Verify UI rendering with user data
    it('should display user information correctly', () => {
      // When
      const pElements = fixture.debugElement.queryAll(By.css('div[fxLayout="column"] p'));

      // Then
      expect(pElements[0].nativeElement.textContent).toContain('John DOE');
      expect(pElements[1].nativeElement.textContent).toContain(mockUser.email);
    });

  });
