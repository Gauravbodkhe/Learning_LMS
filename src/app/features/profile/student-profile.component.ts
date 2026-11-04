import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { TeamService } from '../../core/services/team.service';
import { AppStateService } from '../../core/services/app-state.service';
import { ToastService } from '../../core/services/toast.service';
import { User, TeamMember } from '../../core/models/lms.models';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './student-profile.component.html',
  styleUrl: './student-profile.component.css'
})
export class StudentProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  public teamService = inject(TeamService);
  private appStateService = inject(AppStateService);
  private toastService = inject(ToastService);

  public currentUser: User | null = null;
  public profileForm!: FormGroup;
  public editMode: boolean = false;
  public saveSuccess: boolean = false;

  // 5-member team management state
  public teamMembers: TeamMember[] = [];
  public editingMemberId: string | null = null;
  public editingName: string = '';
  public savedMemberId: string | null = null;
  public memberNameError: string | null = null;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.teamMembers = this.teamService.getTeam();

    this.profileForm = this.fb.group({
      name: [this.currentUser?.name || '', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
      email: [this.currentUser?.email || '', [Validators.required, Validators.email]],
      department: [this.currentUser?.department || '', Validators.required],
      studentId: [this.currentUser?.studentId || '', Validators.required],
      bio: [this.currentUser?.bio || '']
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    this.saveSuccess = false;
    if (this.editMode && this.currentUser) {
      this.profileForm.patchValue({
        name: this.currentUser.name,
        email: this.currentUser.email,
        department: this.currentUser.department,
        studentId: this.currentUser.studentId,
        bio: this.currentUser.bio || ''
      });
    }
  }

  onSaveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const val = this.profileForm.value;
    const res = this.authService.updateProfile(val);
    if (res.success) {
      this.currentUser = this.authService.getCurrentUser();
      this.editMode = false;
      this.saveSuccess = true;
      this.toastService.show('Student profile updated successfully', 'success');
      setTimeout(() => this.saveSuccess = false, 3500);
    }
  }

  startEditMember(member: TeamMember): void {
    this.editingMemberId = member.id;
    this.editingName = member.name;
    this.memberNameError = null;
  }

  cancelEditMember(): void {
    this.editingMemberId = null;
    this.memberNameError = null;
  }

  saveMemberName(member: TeamMember): void {
    const trimmed = this.editingName.trim();
    if (!trimmed) {
      this.memberNameError = 'Name is required';
      return;
    }
    if (trimmed.length > 40) {
      this.memberNameError = 'Name cannot exceed 40 characters';
      return;
    }

    const success = this.teamService.updateMember(member.id, trimmed);
    if (success) {
      this.teamMembers = this.teamService.getTeam();
      const updatedId = member.id;
      this.editingMemberId = null;
      this.memberNameError = null;
      this.savedMemberId = updatedId;
      this.toastService.show(`Updated ${trimmed} in team registry`, 'success');

      setTimeout(() => {
        if (this.savedMemberId === updatedId) {
          this.savedMemberId = null;
        }
      }, 3000);
    }
  }

  getInitials(name: string): string {
    if (!name) return 'TM';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  resetAllDemoData(): void {
    if (confirm('Reset entire LMS system (users, courses, quizzes, adaptive stats, team credits) to initial benchmark state?')) {
      this.appStateService.resetEntireDemoState();
      this.currentUser = this.authService.getCurrentUser();
      this.teamMembers = this.teamService.getTeam();
      this.saveSuccess = true;
      this.toastService.show('System restored to original benchmark data', 'info');
    }
  }
}
