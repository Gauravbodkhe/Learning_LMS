import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivityLog } from '../models/lms.models';
import { INITIAL_ACTIVITY_LOGS } from './demo-data';
import { StorageService } from './storage.service';
import { CourseService } from './course.service';
import { AssessmentService } from './assessment.service';
import { NotificationService } from './notification.service';

export interface DashboardStats {
  totalEnrolledCourses: number;
  completedCoursesCount: number;
  averageQuizScore: number;
  overallProgressPercentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class LearningService {
  private storage = inject(StorageService);
  private courseService = inject(CourseService);
  private assessmentService = inject(AssessmentService);
  private notificationService = inject(NotificationService);

  private readonly ACTIVITY_KEY = 'activity_logs';

  private activityLogsSubject = new BehaviorSubject<ActivityLog[]>([]);
  public activityLogs$: Observable<ActivityLog[]> = this.activityLogsSubject.asObservable();

  constructor() {
    this.loadActivities();
  }

  private loadActivities(): void {
    const saved = this.storage.getItem<ActivityLog[]>(this.ACTIVITY_KEY, INITIAL_ACTIVITY_LOGS);
    this.activityLogsSubject.next(saved);
  }

  getActivities(): ActivityLog[] {
    return this.activityLogsSubject.getValue();
  }

  addActivity(title: string, description: string, type: 'lesson' | 'quiz' | 'enrollment' | 'recommendation'): void {
    const newLog: ActivityLog = {
      id: 'act_' + Date.now(),
      title,
      description,
      timestamp: 'Just now',
      type
    };

    const updated = [newLog, ...this.activityLogsSubject.getValue().slice(0, 19)];
    this.activityLogsSubject.next(updated);
    this.storage.setItem(this.ACTIVITY_KEY, updated);
  }

  markLessonComplete(courseId: string, lessonId: string, lessonTitle: string): void {
    this.courseService.updateLessonStatus(courseId, lessonId, true);

    const course = this.courseService.getCourseById(courseId);
    const courseTitle = course ? course.title : 'Course';

    this.addActivity(
      `Completed Lesson: ${lessonTitle}`,
      courseTitle,
      'lesson'
    );

    this.notificationService.addNotification({
      title: 'Lesson Completed!',
      message: `Great job finishing "${lessonTitle}". Your progress has been updated.`,
      type: 'achievement',
      link: `/learning/${courseId}`
    });
  }

  getDashboardStats(): DashboardStats {
    const enrolled = this.courseService.getEnrolledCourses();
    const totalEnrolled = enrolled.length;
    const completedCourses = enrolled.filter(c => c.progressPercentage === 100).length;

    const totalProgress = enrolled.reduce((acc, c) => acc + c.progressPercentage, 0);
    const overallProgress = totalEnrolled > 0 ? Math.round(totalProgress / totalEnrolled) : 0;

    const attempts = this.assessmentService.getAttempts();
    const totalQuizScore = attempts.reduce((acc, a) => acc + a.scorePercentage, 0);
    const avgScore = attempts.length > 0 ? Math.round(totalQuizScore / attempts.length) : 0;

    return {
      totalEnrolledCourses: totalEnrolled,
      completedCoursesCount: completedCourses,
      averageQuizScore: avgScore,
      overallProgressPercentage: overallProgress
    };
  }

  resetDemoLearning(): void {
    this.activityLogsSubject.next(INITIAL_ACTIVITY_LOGS);
    this.storage.setItem(this.ACTIVITY_KEY, INITIAL_ACTIVITY_LOGS);
  }
}
