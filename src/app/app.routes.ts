import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CourseListComponent } from './features/courses/course-list/course-list.component';
import { CourseDetailComponent } from './features/courses/course-detail/course-detail.component';
import { LearningPlayerComponent } from './features/learning/learning-player.component';
import { AdaptiveDashboardComponent } from './features/adaptive-learning/adaptive-dashboard.component';
import { AssessmentListComponent } from './features/assessments/assessment-list/assessment-list.component';
import { QuizRunnerComponent } from './features/assessments/quiz-runner/quiz-runner.component';
import { StudentProfileComponent } from './features/profile/student-profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'my-learning', component: CourseListComponent, canActivate: [authGuard] },
  { path: 'courses', component: CourseListComponent, canActivate: [authGuard] },
  { path: 'courses/:id', component: CourseDetailComponent, canActivate: [authGuard] },
  { path: 'learning/:courseId', component: LearningPlayerComponent, canActivate: [authGuard] },
  { path: 'adaptive-learning', component: AdaptiveDashboardComponent, canActivate: [authGuard] },
  { path: 'assessments', component: AssessmentListComponent, canActivate: [authGuard] },
  { path: 'assessments/:quizId', component: QuizRunnerComponent, canActivate: [authGuard] },
  { path: 'profile', component: StudentProfileComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' }
];
