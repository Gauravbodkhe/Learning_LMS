import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AssessmentService } from '../../../core/services/assessment.service';
import { Quiz, QuizAttempt } from '../../../core/models/lms.models';

@Component({
  selector: 'app-assessment-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './assessment-list.component.html',
  styleUrl: './assessment-list.component.css'
})
export class AssessmentListComponent implements OnInit {
  public assessmentService = inject(AssessmentService);
  private router = inject(Router);

  public quizzes: Quiz[] = [];
  public pastAttempts: QuizAttempt[] = [];

  ngOnInit(): void {
    this.quizzes = this.assessmentService.getQuizzes();
    this.pastAttempts = this.assessmentService.getAttempts();
  }

  startQuiz(quizId: string): void {
    this.router.navigate(['/assessments', quizId]);
  }

  getBestScoreForQuiz(quizId: string): number | null {
    const attempts = this.pastAttempts.filter(a => a.quizId === quizId);
    if (attempts.length === 0) return null;
    return Math.max(...attempts.map(a => a.scorePercentage));
  }
}
