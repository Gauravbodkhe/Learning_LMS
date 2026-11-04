import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public showPassword = signal(false);
  public errorMessage = signal<string | null>(null);
  public isSubmitting = signal(false);

  public loginForm: FormGroup = this.fb.group({
    email: ['student@lms.com', [Validators.required, Validators.email]],
    password: ['password123', [Validators.required, Validators.minLength(6)]]
  });

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  fillDemoCredentials(): void {
    this.loginForm.patchValue({
      email: 'student@lms.com',
      password: 'password123'
    });
    this.errorMessage.set(null);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.value;
    const result = this.authService.login(email, password);

    if (result.success) {
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
      this.router.navigateByUrl(returnUrl);
    } else {
      this.errorMessage.set(result.message || 'Login failed.');
      this.isSubmitting.set(false);
    }
  }
}
