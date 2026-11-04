import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { CourseService } from './course.service';
import { AssessmentService } from './assessment.service';
import { AdaptiveLearningService } from './adaptive-learning.service';
import { LearningService } from './learning.service';
import { NotificationService } from './notification.service';
import { TeamService } from './team.service';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private authService = inject(AuthService);
  private courseService = inject(CourseService);
  private assessmentService = inject(AssessmentService);
  private adaptiveService = inject(AdaptiveLearningService);
  private learningService = inject(LearningService);
  private notificationService = inject(NotificationService);
  private teamService = inject(TeamService);

  public resetEntireDemoState(): void {
    this.authService.resetDemoUser();
    this.courseService.resetDemoCourses();
    this.assessmentService.resetDemoAssessments();
    this.adaptiveService.resetDemoData();
    this.learningService.resetDemoLearning();
    this.notificationService.resetDemoNotifications();
    this.teamService.resetTeam();

    this.notificationService.addNotification({
      title: 'Demo State Restored',
      message: 'All courses, quiz attempts, adaptive recommendations, and logs were restored to original benchmark data.',
      type: 'alert'
    });
  }
}
