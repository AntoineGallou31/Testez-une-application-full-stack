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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize user data on ngOnInit', () => {
    component.ngOnInit();
    expect(mockUserService.getById).toHaveBeenCalledWith('1');
    expect(component.user).toEqual(mockUser);
  });

  it('should navigate back when back() is called', () => {
    const historySpy = jest.spyOn(window.history, 'back');
    component.back();
    expect(historySpy).toHaveBeenCalled();
  });

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

  it('should display user information correctly', () => {
    // Récupère tous les <p> dans le bloc utilisateur
    const pElements = fixture.debugElement.queryAll(By.css('div[fxLayout="column"] p'));
    expect(pElements[0].nativeElement.textContent).toContain('John DOE');
    expect(pElements[1].nativeElement.textContent).toContain(mockUser.email);
  });

  it('should update view when user data is loaded', () => {
    const newUser: User = {
      ...mockUser,
      firstName: 'Jane',
      lastName: 'Smith'
    };
    mockUserService.getById.mockReturnValue(of(newUser));
    component.ngOnInit();
    fixture.detectChanges();

    const pElements = fixture.debugElement.queryAll(By.css('div[fxLayout="column"] p'));
    expect(pElements[0].nativeElement.textContent.replace(/\s/g, '')).toContain('JaneSMITH');
  });

  it('should show admin message if user is admin', () => {
    const adminUser: User = { ...mockUser, admin: true };
    mockUserService.getById.mockReturnValue(of(adminUser));
    component.ngOnInit();
    fixture.detectChanges();

    const adminMsg = fixture.debugElement.query(By.css('.my2'));
    expect(adminMsg.nativeElement.textContent).toContain('You are admin');
  });
});
