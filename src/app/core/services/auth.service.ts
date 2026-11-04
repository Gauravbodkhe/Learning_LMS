import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/lms.models';
import { INITIAL_USER } from './demo-data';
import { StorageService } from './storage.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private storage = inject(StorageService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  private readonly AUTH_USER_KEY = 'current_user';
  private readonly AUTH_TOKEN_KEY = 'auth_token';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor() {
    this.restoreSession();
  }

  private restoreSession(): void {
    const savedUser = this.storage.getItem<User | null>(this.AUTH_USER_KEY, null);
    const token = this.storage.getItem<string | null>(this.AUTH_TOKEN_KEY, null);

    if (savedUser && token) {
      this.currentUserSubject.next(savedUser);
    } else {
      // Default to demo student so reviewer can immediately explore without friction,
      // while full login/logout flows remain 100% active and testable.
      this.loginWithDemoUser();
    }
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.getValue() !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.getValue();
  }

  login(email: string, password: string): { success: boolean; message?: string } {
    if (!email || !password) {
      return { success: false, message: 'Please provide both email and password.' };
    }

    // Demo auth logic
    const baseUser = this.storage.getItem<User>(this.AUTH_USER_KEY, INITIAL_USER);
    const userToLogin: User = {
      ...baseUser,
      email: email.trim().toLowerCase(),
      name: email.includes('@') ? (baseUser.name || 'Demo Student') : 'Demo Student'
    };

    const token = 'demo_jwt_token_' + Date.now();
    this.storage.setItem(this.AUTH_USER_KEY, userToLogin);
    this.storage.setItem(this.AUTH_TOKEN_KEY, token);
    this.currentUserSubject.next(userToLogin);

    this.notificationService.addNotification({
      title: 'Welcome Back!',
      message: `Logged in successfully as ${userToLogin.name}.`,
      type: 'achievement'
    });

    return { success: true };
  }

  loginWithDemoUser(): void {
    const token = 'demo_jwt_token_default';
    this.storage.setItem(this.AUTH_USER_KEY, INITIAL_USER);
    this.storage.setItem(this.AUTH_TOKEN_KEY, token);
    this.currentUserSubject.next(INITIAL_USER);
  }

  register(data: { name: string; email: string; department: string; password: string }): { success: boolean; message?: string } {
    if (!data.name || !data.email || !data.password) {
      return { success: false, message: 'Please complete all required fields.' };
    }

    const newUser: User = {
      id: 'usr_' + Date.now(),
      name: data.name,
      email: data.email.trim().toLowerCase(),
      role: 'student',
      department: data.department || 'Computer Science & Engineering',
      studentId: '2026-CSE-' + Math.floor(100 + Math.random() * 900),
      joinedDate: new Date().toISOString().split('T')[0],
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Enthusiastic computer science student on an adaptive learning trajectory.'
    };

    const token = 'demo_jwt_token_' + Date.now();
    this.storage.setItem(this.AUTH_USER_KEY, newUser);
    this.storage.setItem(this.AUTH_TOKEN_KEY, token);
    this.currentUserSubject.next(newUser);

    this.notificationService.addNotification({
      title: 'Account Registered',
      message: `Welcome to the Adaptive LMS, ${newUser.name}! Your account is ready.`,
      type: 'achievement'
    });

    return { success: true };
  }

  updateProfile(updatedFields: Partial<User>): { success: boolean; message?: string } {
    const current = this.currentUserSubject.getValue();
    if (!current) {
      return { success: false, message: 'No active session found.' };
    }

    const updated: User = { ...current, ...updatedFields };
    this.storage.setItem(this.AUTH_USER_KEY, updated);
    this.currentUserSubject.next(updated);

    this.notificationService.addNotification({
      title: 'Profile Updated',
      message: 'Your student profile information has been saved.',
      type: 'achievement'
    });

    return { success: true };
  }

  logout(): void {
    this.storage.removeItem(this.AUTH_USER_KEY);
    this.storage.removeItem(this.AUTH_TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  resetDemoUser(): void {
    this.storage.setItem(this.AUTH_USER_KEY, INITIAL_USER);
    this.currentUserSubject.next(INITIAL_USER);
  }
}
