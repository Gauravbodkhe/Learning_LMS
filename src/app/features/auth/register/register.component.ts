import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public showPassword = signal(false);
  public errorMessage = signal<string | null>(null);
  public isSubmitting = signal(false);

  public departments = [
    'Computer Science & Engineering',
    'Information Technology',
    'Artificial Intelligence & Data Science',
    'Electronics & Communication',
    'Software Systems Engineering'
  ];

  public registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    department: ['Computer Science & Engineering', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: this.passwordsMatchValidator
  });

  private passwordsMatchValidator(form: FormGroup) {
    const p = form.get('password')?.value;
    const cp = form.get('confirmPassword')?.value;
    if (p && cp && p !== cp) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
    }
    return null;
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const { name, email, department, password } = this.registerForm.value;
    const result = this.authService.register({ name, email, department, password });

    if (result.success) {
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage.set(result.message || 'Registration failed.');
      this.isSubmitting.set(false);
    }
  }
}
