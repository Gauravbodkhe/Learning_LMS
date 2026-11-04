import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course.service';
import { AssessmentService } from '../../core/services/assessment.service';
import { LearningService, DashboardStats } from '../../core/services/learning.service';
import { AdaptiveLearningService } from '../../core/services/adaptive-learning.service';
import { Course, SubjectPerformance, AdaptiveRecommendation, ActivityLog } from '../../core/models/lms.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  public authService = inject(AuthService);
  public courseService = inject(CourseService);
  public assessmentService = inject(AssessmentService);
  public learningService = inject(LearningService);
  public adaptiveService = inject(AdaptiveLearningService);
  private router = inject(Router);

  public currentDate: string = '';
  public stats: DashboardStats = {
    totalEnrolledCourses: 0,
    completedCoursesCount: 0,
    averageQuizScore: 0,
    overallProgressPercentage: 0
  };

  // Shantanu Gadhave: Animated count-up for metric cards
  public animatedStats = {
    totalEnrolledCourses: 0,
    completedCoursesCount: 0,
    averageQuizScore: 0,
    overallProgressPercentage: 0
  };

  // Shantanu Gadhave: Last-visited course on hero
  public lastVisitedCourse: Course | null = null;

  public enrolledCourses: Course[] = [];
  public subjectPerformances: SubjectPerformance[] = [];
  public topRecommendations: AdaptiveRecommendation[] = [];
  public recentActivities: ActivityLog[] = [];

  // Weekly study activity data (Hours logged per day) with interactive hover
  public weeklyActivity = [
    { day: 'Mon', hours: 3.5, heightPct: 70 },
    { day: 'Tue', hours: 2.0, heightPct: 40 },
    { day: 'Wed', hours: 4.5, heightPct: 90 },
    { day: 'Thu', hours: 1.5, heightPct: 30 },
    { day: 'Fri', hours: 3.0, heightPct: 60 },
    { day: 'Sat', hours: 5.0, heightPct: 100 },
    { day: 'Sun', hours: 2.5, heightPct: 50 }
  ];

  public hoveredDay: string | null = null;

  ngOnInit(): void {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    this.currentDate = now.toLocaleDateString('en-US', options);

    this.refreshDashboardData();
  }

  public refreshDashboardData(): void {
    this.stats = this.learningService.getDashboardStats();
    this.enrolledCourses = this.courseService.getEnrolledCourses();
    this.subjectPerformances = this.adaptiveService.getSubjectPerformances();
    this.topRecommendations = this.adaptiveService.getRecommendations().slice(0, 3);
    this.recentActivities = this.learningService.getActivities().slice(0, 5);

    // Identify last-visited course for dashboard hero
    this.lastVisitedCourse = this.enrolledCourses.find(c => c.progressPercentage > 0 && c.progressPercentage < 100)
      || this.enrolledCourses[0]
      || null;

    // Trigger animated count-up on metric cards
    this.animateStatsCountUp(this.stats);
  }

  private animateStatsCountUp(target: DashboardStats): void {
    const steps = 20;
    const duration = 500;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const factor = step / steps;
      this.animatedStats = {
        totalEnrolledCourses: Math.round(target.totalEnrolledCourses * factor),
        completedCoursesCount: Math.round(target.completedCoursesCount * factor),
        averageQuizScore: Math.round(target.averageQuizScore * factor),
        overallProgressPercentage: Math.round(target.overallProgressPercentage * factor)
      };

      if (step >= steps) {
        clearInterval(timer);
        this.animatedStats = { ...target };
      }
    }, intervalTime);
  }

  getMotivationalMessage(): string {
    const avg = this.stats.averageQuizScore;
    if (avg >= 80) {
      return "Outstanding pace! Your adaptive metrics indicate rapid mastery across modern stacks.";
    } else if (avg >= 60) {
      return "Consistent momentum! Focus on your targeted adaptive recommendations to bridge knowledge gaps.";
    } else {
      return "Every step counts! Follow the rule-based suggestions below to solidify your fundamentals.";
    }
  }

  getLessonsCount(course: Course): number {
    return course.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
  }

  getCompletedLessonsCount(course: Course): number {
    return course.chapters.reduce((acc, ch) => acc + ch.lessons.filter(l => l.completed).length, 0);
  }

  continueNextAvailableLesson(): void {
    if (this.enrolledCourses.length > 0) {
      const active = this.enrolledCourses.find(c => c.progressPercentage < 100) || this.enrolledCourses[0];
      this.router.navigate(['/learning', active.id]);
    } else {
      this.router.navigate(['/courses']);
    }
  }

  openCourseLearning(courseId: string): void {
    this.router.navigate(['/learning', courseId]);
  }

  openQuiz(subjectName: string): void {
    const quizzes = this.assessmentService.getQuizzes();
    const matching = quizzes.find(q => q.subject.toLowerCase() === subjectName.toLowerCase());
    if (matching) {
      this.router.navigate(['/assessments', matching.id]);
    } else {
      this.router.navigate(['/assessments']);
    }
  }

  onThumbError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect fill="%231e222b" width="600" height="400"/><text fill="%239aa1ad" font-family="sans-serif" font-size="20" font-weight="600" x="50%" y="50%" text-anchor="middle" dominant-baseline="middle">AdaptiveLMS Course</text></svg>';
    }
  }
}
