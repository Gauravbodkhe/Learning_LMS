import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AdaptiveLearningService } from '../../core/services/adaptive-learning.service';
import { CourseService } from '../../core/services/course.service';
import { AssessmentService } from '../../core/services/assessment.service';
import {
  SubjectPerformance,
  AdaptiveRecommendation,
  RoadmapStep,
  ImprovementMetric,
  SubjectName
} from '../../core/models/lms.models';

@Component({
  selector: 'app-adaptive-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './adaptive-dashboard.component.html',
  styleUrl: './adaptive-dashboard.component.css'
})
export class AdaptiveDashboardComponent implements OnInit {
  public adaptiveService = inject(AdaptiveLearningService);
  public courseService = inject(CourseService);
  public assessmentService = inject(AssessmentService);
  private router = inject(Router);

  public subjectPerformances: SubjectPerformance[] = [];
  public recommendations: AdaptiveRecommendation[] = [];
  public roadmapSteps: RoadmapStep[] = [];
  public improvementMetrics: ImprovementMetric[] = [];

  // Filter for recommendations
  public activeTab: 'all' | 'high' | 'completed' = 'all';

  // Categorized performance lists
  public strongSubjects: SubjectPerformance[] = [];
  public averageSubjects: SubjectPerformance[] = [];
  public weakSubjects: SubjectPerformance[] = [];

  // Simulation state for viva demonstration
  public simulationSubject: SubjectName = 'Angular';
  public simulationScore: number = 85;
  public simulationRunning: boolean = false;
  public simulationMessage: string | null = null;

  ngOnInit(): void {
    this.loadAdaptiveData();
  }

  loadAdaptiveData(): void {
    this.subjectPerformances = this.adaptiveService.getSubjectPerformances();
    this.recommendations = this.adaptiveService.getRecommendations();
    this.roadmapSteps = this.adaptiveService.getRoadmap();
    this.improvementMetrics = this.adaptiveService.getImprovements();

    this.strongSubjects = this.subjectPerformances.filter(s => s.strengthCategory === 'Strong');
    this.averageSubjects = this.subjectPerformances.filter(s => s.strengthCategory === 'Average');
    this.weakSubjects = this.subjectPerformances.filter(s => s.strengthCategory === 'Weak');
  }

  get filteredRecommendations(): AdaptiveRecommendation[] {
    if (this.activeTab === 'high') {
      return this.recommendations.filter(r => r.priority === 'High' && !r.completed);
    }
    if (this.activeTab === 'completed') {
      return this.recommendations.filter(r => r.completed);
    }
    return this.recommendations;
  }

  onExecuteRecommendation(rec: AdaptiveRecommendation): void {
    if (rec.suggestedCourseId && rec.suggestedLessonId) {
      this.router.navigate(['/learning', rec.suggestedCourseId], {
        queryParams: { lesson: rec.suggestedLessonId }
      });
    } else if (rec.suggestedCourseId) {
      this.router.navigate(['/courses', rec.suggestedCourseId]);
    } else {
      this.router.navigate(['/assessments']);
    }
  }

  onMarkResolved(rec: AdaptiveRecommendation, event: Event): void {
    event.stopPropagation();
    this.adaptiveService.markRecommendationCompleted(rec.id);
    this.loadAdaptiveData();
  }

  takeQuizForSubject(subject: SubjectName): void {
    const quizzes = this.assessmentService.getQuizzes();
    const matching = quizzes.find(q => q.subject.toLowerCase() === subject.toLowerCase());
    if (matching) {
      this.router.navigate(['/assessments', matching.id]);
    } else {
      this.router.navigate(['/assessments']);
    }
  }

  /**
   * Viva Demonstration Simulator
   * Allows examiners to simulate a student achieving a test score in a specific subject
   * and immediately watch the rule-based engine recalculate strengths, recommendations, and roadmaps!
   */
  runEvaluationSimulation(subject: SubjectName, simulatedScore: number): void {
    this.simulationRunning = true;
    this.simulationMessage = null;

    setTimeout(() => {
      this.assessmentService.submitQuiz(
        this.getQuizIdForSubject(subject),
        this.generateSimulatedAnswers(simulatedScore)
      );

      this.loadAdaptiveData();
      this.simulationRunning = false;
      this.simulationMessage = `Simulated ${simulatedScore}% score for ${subject}. Adaptive rules successfully re-evaluated!`;
    }, 400);
  }

  private getQuizIdForSubject(subject: SubjectName): string {
    const match = this.assessmentService.getQuizzes().find(q => q.subject === subject);
    return match ? match.id : 'qz_ang_01';
  }

  private generateSimulatedAnswers(score: number): { [key: number]: number } {
    // 5 questions: 20% each
    const answers: { [key: number]: number } = {};
    const correctCount = Math.round((score / 100) * 5);
    for (let i = 0; i < 5; i++) {
      answers[i] = i < correctCount ? 0 : 3;
    }
    return answers;
  }
}
