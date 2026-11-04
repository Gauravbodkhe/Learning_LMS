import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AssessmentService } from '../../../core/services/assessment.service';
import { Quiz, QuizAttempt } from '../../../core/models/lms.models';

@Component({
  selector: 'app-quiz-runner',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quiz-runner.component.html',
  styleUrl: './quiz-runner.component.css'
})
export class QuizRunnerComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public assessmentService = inject(AssessmentService);

  public quiz: Quiz | undefined;
  public currentQuestionIndex: number = 0;
  public selectedAnswers: { [questionIndex: number]: number } = {};
  public isSubmitted: boolean = false;
  public quizAttemptResult: QuizAttempt | null = null;

  // Timer
  public remainingSeconds: number = 600; // 10 minutes default
  public timerInterval: any = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const quizId = params.get('quizId');
      if (quizId) {
        this.loadQuiz(quizId);
      }
    });
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  loadQuiz(quizId: string): void {
    this.quiz = this.assessmentService.getQuizById(quizId);
    if (this.quiz) {
      this.remainingSeconds = this.quiz.timeLimitMinutes * 60;
      this.currentQuestionIndex = 0;
      this.selectedAnswers = {};
      this.isSubmitted = false;
      this.quizAttemptResult = null;
      this.startTimer();
    }
  }

  startTimer(): void {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
      } else {
        this.stopTimer();
        this.submitQuiz();
      }
    }, 1000);
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  get formattedTime(): string {
    const mins = Math.floor(this.remainingSeconds / 60);
    const secs = this.remainingSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  selectOption(optionIndex: number): void {
    if (this.isSubmitted) return;
    this.selectedAnswers[this.currentQuestionIndex] = optionIndex;
  }

  isOptionSelected(optionIndex: number): boolean {
    return this.selectedAnswers[this.currentQuestionIndex] === optionIndex;
  }

  isQuestionAnswered(qIdx: number): boolean {
    return this.selectedAnswers[qIdx] !== undefined;
  }

  goToPreviousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  goToNextQuestion(): void {
    if (this.quiz && this.currentQuestionIndex < this.quiz.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  jumpToQuestion(index: number): void {
    this.currentQuestionIndex = index;
  }

  get answeredCount(): number {
    return Object.keys(this.selectedAnswers).length;
  }

  submitQuiz(): void {
    if (!this.quiz || this.isSubmitted) return;
    this.stopTimer();
    this.isSubmitted = true;
    this.quizAttemptResult = this.assessmentService.submitQuiz(this.quiz.id, this.selectedAnswers);
  }

  retakeQuiz(): void {
    if (this.quiz) {
      this.loadQuiz(this.quiz.id);
    }
  }
}
