import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Quiz, QuizAttempt, SubjectName } from '../models/lms.models';
import { INITIAL_QUIZZES, INITIAL_QUIZ_ATTEMPTS } from './demo-data';
import { StorageService } from './storage.service';
import { AdaptiveLearningService } from './adaptive-learning.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  private storage = inject(StorageService);
  private adaptiveService = inject(AdaptiveLearningService);
  private notificationService = inject(NotificationService);

  private readonly QUIZZES_KEY = 'quizzes_list';
  private readonly ATTEMPTS_KEY = 'quiz_attempts';

  private quizzesSubject = new BehaviorSubject<Quiz[]>([]);
  public quizzes$: Observable<Quiz[]> = this.quizzesSubject.asObservable();

  private attemptsSubject = new BehaviorSubject<QuizAttempt[]>([]);
  public attempts$: Observable<QuizAttempt[]> = this.attemptsSubject.asObservable();

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    const savedQuizzes = this.storage.getItem<Quiz[]>(this.QUIZZES_KEY, INITIAL_QUIZZES);
    this.quizzesSubject.next(savedQuizzes);

    const savedAttempts = this.storage.getItem<QuizAttempt[]>(this.ATTEMPTS_KEY, INITIAL_QUIZ_ATTEMPTS);
    this.attemptsSubject.next(savedAttempts);
  }

  getQuizzes(): Quiz[] {
    return this.quizzesSubject.getValue();
  }

  getQuizById(id: string): Quiz | undefined {
    return this.quizzesSubject.getValue().find(q => q.id === id);
  }

  getAttempts(): QuizAttempt[] {
    return this.attemptsSubject.getValue();
  }

  getAttemptsForSubject(subject: SubjectName): QuizAttempt[] {
    return this.attemptsSubject.getValue().filter(a => a.subject === subject);
  }

  submitQuiz(
    quizId: string,
    selectedAnswers: { [questionIndex: number]: number }
  ): QuizAttempt | null {
    const quiz = this.getQuizById(quizId);
    if (!quiz) return null;

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;

    quiz.questions.forEach((q, idx) => {
      const selected = selectedAnswers[idx];
      if (selected !== undefined && selected === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = scorePercentage >= quiz.passPercentage;

    const now = new Date();
    const dateFormatted = `${now.toISOString().split('T')[0]} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newAttempt: QuizAttempt = {
      id: 'att_' + Date.now(),
      quizId: quiz.id,
      quizTitle: quiz.title,
      subject: quiz.subject,
      date: dateFormatted,
      totalQuestions,
      correctAnswersCount: correctCount,
      scorePercentage,
      passed,
      selectedAnswers
    };

    const updatedAttempts = [newAttempt, ...this.attemptsSubject.getValue()];
    this.attemptsSubject.next(updatedAttempts);
    this.storage.setItem(this.ATTEMPTS_KEY, updatedAttempts);

    // Propagate result directly to Adaptive Learning Engine!
    this.adaptiveService.recordQuizResult(newAttempt);

    // Notification
    this.notificationService.addNotification({
      title: `Quiz Completed: ${quiz.title}`,
      message: `You scored ${scorePercentage}% (${correctCount}/${totalQuestions}). ${passed ? 'Passed!' : 'Needs review.'}`,
      type: 'quiz',
      link: '/assessments'
    });

    return newAttempt;
  }

  resetDemoAssessments(): void {
    this.quizzesSubject.next(INITIAL_QUIZZES);
    this.storage.setItem(this.QUIZZES_KEY, INITIAL_QUIZZES);

    this.attemptsSubject.next(INITIAL_QUIZ_ATTEMPTS);
    this.storage.setItem(this.ATTEMPTS_KEY, INITIAL_QUIZ_ATTEMPTS);
  }
}
