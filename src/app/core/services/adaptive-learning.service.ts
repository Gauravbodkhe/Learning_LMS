import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  SubjectName,
  SubjectPerformance,
  AdaptiveRecommendation,
  RoadmapStep,
  ImprovementMetric,
  QuizAttempt,
  DifficultyLevel
} from '../models/lms.models';
import {
  INITIAL_SUBJECT_PERFORMANCES,
  INITIAL_ROADMAP_STEPS,
  INITIAL_IMPROVEMENT_METRICS
} from './demo-data';
import { StorageService } from './storage.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AdaptiveLearningService {
  private storage = inject(StorageService);
  private notificationService = inject(NotificationService);

  private readonly PERFORMANCES_KEY = 'subject_performances';
  private readonly RECOMMENDATIONS_KEY = 'adaptive_recommendations';
  private readonly ROADMAP_KEY = 'learning_roadmap';
  private readonly IMPROVEMENTS_KEY = 'improvement_metrics';

  private subjectPerformancesSubject = new BehaviorSubject<SubjectPerformance[]>([]);
  public subjectPerformances$: Observable<SubjectPerformance[]> = this.subjectPerformancesSubject.asObservable();

  private recommendationsSubject = new BehaviorSubject<AdaptiveRecommendation[]>([]);
  public recommendations$: Observable<AdaptiveRecommendation[]> = this.recommendationsSubject.asObservable();

  private roadmapSubject = new BehaviorSubject<RoadmapStep[]>([]);
  public roadmap$: Observable<RoadmapStep[]> = this.roadmapSubject.asObservable();

  private improvementsSubject = new BehaviorSubject<ImprovementMetric[]>([]);
  public improvements$: Observable<ImprovementMetric[]> = this.improvementsSubject.asObservable();

  constructor() {
    this.initializeState();
  }

  private initializeState(): void {
    const performances = this.storage.getItem<SubjectPerformance[]>(
      this.PERFORMANCES_KEY,
      INITIAL_SUBJECT_PERFORMANCES
    );
    this.subjectPerformancesSubject.next(performances);

    const roadmap = this.storage.getItem<RoadmapStep[]>(
      this.ROADMAP_KEY,
      INITIAL_ROADMAP_STEPS
    );
    this.roadmapSubject.next(roadmap);

    const improvements = this.storage.getItem<ImprovementMetric[]>(
      this.IMPROVEMENTS_KEY,
      INITIAL_IMPROVEMENT_METRICS
    );
    this.improvementsSubject.next(improvements);

    // Generate or restore adaptive recommendations
    const savedRecs = this.storage.getItem<AdaptiveRecommendation[]>(this.RECOMMENDATIONS_KEY, []);
    if (savedRecs && savedRecs.length > 0) {
      this.recommendationsSubject.next(savedRecs);
    } else {
      this.recalculateAdaptiveRecommendations(performances);
    }
  }

  getSubjectPerformances(): SubjectPerformance[] {
    return this.subjectPerformancesSubject.getValue();
  }

  getRecommendations(): AdaptiveRecommendation[] {
    return this.recommendationsSubject.getValue();
  }

  getRoadmap(): RoadmapStep[] {
    return this.roadmapSubject.getValue();
  }

  getImprovements(): ImprovementMetric[] {
    return this.improvementsSubject.getValue();
  }

  /**
   * Rule-Based Recommendation Algorithm
   * Categorizes student performance and synthesizes tailored learning recommendations.
   *
   * Rules:
   * 1. Remedial Tier (Score < 40%): Recommend beginner fundamentals, core concept revisions.
   * 2. Practice Tier (Score 40% - 69%): Recommend targeted exercises, coding drills, intermediate reinforcement.
   * 3. Proficiency Tier (Score 70% - 89%): Recommend intermediate-to-advanced materials, architecture patterns.
   * 4. Mastery Tier (Score >= 90%): Recommend advanced challenges, system design, and mentor peer discussions.
   */
  public recalculateAdaptiveRecommendations(performances: SubjectPerformance[]): void {
    const recommendations: AdaptiveRecommendation[] = [];

    // Sort: weakest subjects first to ensure high-priority remediation
    const sortedPerformances = [...performances].sort((a, b) => a.score - b.score);

    for (const perf of sortedPerformances) {
      const rec = this.evaluateRulesForSubject(perf);
      if (rec) {
        recommendations.push(rec);
      }
    }

    this.recommendationsSubject.next(recommendations);
    this.storage.setItem(this.RECOMMENDATIONS_KEY, recommendations);
  }

  private evaluateRulesForSubject(perf: SubjectPerformance): AdaptiveRecommendation {
    const { subject, score } = perf;
    let title = '';
    let reason = '';
    let suggestedLessonId = '';
    let suggestedCourseId = '';
    let difficultyLevel: DifficultyLevel = 'Beginner';
    let action = '';
    let rule = '';
    let priority: 'High' | 'Medium' | 'Low' = 'Medium';

    if (score < 40) {
      // RULE 1: Remedial
      priority = 'High';
      difficultyLevel = 'Beginner';
      rule = 'Rule R-101 [Score < 40%]: Foundational Remediation Triggered';

      switch (subject) {
        case 'Angular':
          title = 'Revise Angular Standalone Components & Data Binding';
          reason = `Your recent assessment score in Angular is ${score}%. The adaptive engine detected knowledge gaps in component lifecycles and modern standalone syntax.`;
          action = 'Start Angular Foundational Review';
          suggestedCourseId = 'crs_ang_201';
          suggestedLessonId = 'les_ang_101';
          break;
        case 'Python':
          title = 'Revisit Python Syntax & Control Flow Structures';
          reason = `Your assessment score is ${score}%. Fundamental syntax, loop paradigms, and basic list slicing require immediate revision.`;
          action = 'Practice Basic Python Exercises';
          suggestedCourseId = 'crs_py_204';
          suggestedLessonId = 'les_py_101';
          break;
        case 'Database Management':
          title = 'Review Relational Models & 1NF-3NF Normalization';
          reason = `Your DBMS score is ${score}%. Understanding entity relations and relational dependencies is required before advanced querying.`;
          action = 'Read Database Normalization Guide';
          suggestedCourseId = 'crs_db_203';
          suggestedLessonId = 'les_db_101';
          break;
        default:
          title = `Revise ${subject} Core Principles`;
          reason = `Current performance is ${score}%. Foundational review is recommended before progressing.`;
          action = `Open ${subject} Primer`;
          suggestedCourseId = 'crs_js_202';
          break;
      }
    } else if (score >= 40 && score < 70) {
      // RULE 2: Practice & Consolidation
      priority = 'Medium';
      difficultyLevel = 'Intermediate';
      rule = 'Rule R-202 [40% <= Score < 70%]: Targeted Skill Consolidation';

      switch (subject) {
        case 'Database Management':
          title = 'Practice Complex SQL Joins & B-Tree Index Optimization';
          reason = `Your current score of ${score}% shows good fundamental grasp, but query optimization and indexing strategies need focused practice.`;
          action = 'Start Index Tuning Practice';
          suggestedCourseId = 'crs_db_203';
          suggestedLessonId = 'les_db_102';
          break;
        case 'Data Structures':
          title = 'Strengthen Tree Traversal & Binary Search Trees';
          reason = `With a score of ${score}%, recursive tree traversal and balancing mechanisms represent your highest-leverage growth area.`;
          action = 'Solve Tree Traversal Problems';
          suggestedCourseId = 'crs_dsa_205';
          suggestedLessonId = 'les_dsa_101';
          break;
        case 'HTML and CSS':
          title = 'Deepen CSS Grid & Responsive Alignment Techniques';
          reason = `Scored ${score}%. Responsive layout patterns and accessibility semantics require additional practical implementations.`;
          action = 'Review Grid vs Flexbox Architectures';
          suggestedCourseId = 'crs_web_206';
          suggestedLessonId = 'les_web_101';
          break;
        default:
          title = `Reinforce ${subject} Concepts Through Coding Drills`;
          reason = `Current score is ${score}%. Targeted problem solving will propel you to the 80%+ mastery bracket.`;
          action = 'Take Practice Drills';
          suggestedCourseId = 'crs_js_202';
          break;
      }
    } else if (score >= 70 && score < 90) {
      // RULE 3: Intermediate to Advanced Progression
      priority = 'Low';
      difficultyLevel = 'Intermediate';
      rule = 'Rule R-303 [70% <= Score < 90%]: Intermediate Expansion';

      switch (subject) {
        case 'JavaScript':
          title = 'Explore Async Iterators & Advanced Microtask Profiling';
          reason = `Your score of ${score}% indicates strong proficiency! You are ready to tackle V8 engine internals and performance profiling.`;
          action = 'Read Event Loop In-Depth';
          suggestedCourseId = 'crs_js_202';
          suggestedLessonId = 'les_js_101';
          break;
        default:
          title = `Advance to Complex ${subject} Architectures`;
          reason = `Scoring ${score}% demonstrates solid mastery. Moving onto enterprise patterns is recommended.`;
          action = 'Explore Advanced Module';
          break;
      }
    } else {
      // RULE 4: Mastery
      priority = 'Low';
      difficultyLevel = 'Advanced';
      rule = 'Rule R-404 [Score >= 90%]: Subject Mastery & Peer Leadership';
      title = `Mastery Achieved in ${subject}: Undertake Capstone Challenges`;
      reason = `Outstanding performance of ${score}%! You have mastered this domain's curriculum. Recommended to undertake capstone implementations.`;
      action = 'View Capstone Challenges';
    }

    return {
      id: 'rec_' + subject.toLowerCase().replace(/\s+/g, '_'),
      subject,
      currentPerformance: score,
      recommendationTitle: title,
      reason,
      suggestedCourseId,
      suggestedLessonId,
      difficultyLevel,
      recommendedAction: action,
      ruleTriggered: rule,
      priority,
      completed: false
    };
  }

  /**
   * Invoked whenever a student completes a quiz
   * Synchronously updates:
   * 1. Subject performance & attempts
   * 2. Strength categories (Strong, Average, Weak)
   * 3. Improvement tracking & delta calculation
   * 4. Rule-based recommendations
   * 5. Personalized learning roadmap
   */
  public recordQuizResult(attempt: QuizAttempt): void {
    const performances = [...this.subjectPerformancesSubject.getValue()];
    const index = performances.findIndex(p => p.subject === attempt.subject);

    let oldScore = 0;
    if (index !== -1) {
      const existing = performances[index];
      oldScore = existing.score;

      // Weighted moving average: 70% current, 30% previous to reflect ongoing progress
      const newScore = Math.round((existing.score * 0.3) + (attempt.scorePercentage * 0.7));
      const strength = this.calculateStrength(newScore);

      performances[index] = {
        ...existing,
        score: newScore,
        attemptsCount: existing.attemptsCount + 1,
        lastAttemptDate: new Date().toISOString().split('T')[0],
        strengthCategory: strength
      };
    } else {
      const strength = this.calculateStrength(attempt.scorePercentage);
      oldScore = attempt.scorePercentage;
      performances.push({
        subject: attempt.subject,
        score: attempt.scorePercentage,
        attemptsCount: 1,
        lastAttemptDate: new Date().toISOString().split('T')[0],
        strengthCategory: strength,
        topicsToReview: []
      });
    }

    this.subjectPerformancesSubject.next(performances);
    this.storage.setItem(this.PERFORMANCES_KEY, performances);

    // Update Improvement Metrics
    this.updateImprovementMetric(attempt.subject, oldScore, performances.find(p => p.subject === attempt.subject)?.score || attempt.scorePercentage);

    // Update Adaptive Recommendations
    this.recalculateAdaptiveRecommendations(performances);

    // Check Roadmap Progression
    this.updateRoadmapProgression(performances);

    // Notify user
    this.notificationService.addNotification({
      title: `Adaptive Engine Updated: ${attempt.subject}`,
      message: `Your latest score (${attempt.scorePercentage}%) generated fresh recommendations for your learning path.`,
      type: 'recommendation',
      link: '/adaptive-learning'
    });
  }

  public markRecommendationCompleted(id: string): void {
    const updated = this.recommendationsSubject.getValue().map(rec => {
      if (rec.id === id) {
        return { ...rec, completed: true };
      }
      return rec;
    });

    this.recommendationsSubject.next(updated);
    this.storage.setItem(this.RECOMMENDATIONS_KEY, updated);

    // Increment completed recommendations in improvement metric
    const rec = updated.find(r => r.id === id);
    if (rec) {
      const improvements = [...this.improvementsSubject.getValue()];
      const impIndex = improvements.findIndex(i => i.subject === rec.subject);
      if (impIndex !== -1) {
        improvements[impIndex] = {
          ...improvements[impIndex],
          recommendationsResolved: improvements[impIndex].recommendationsResolved + 1
        };
        this.improvementsSubject.next(improvements);
        this.storage.setItem(this.IMPROVEMENTS_KEY, improvements);
      }
    }
  }

  private calculateStrength(score: number): 'Strong' | 'Average' | 'Weak' {
    if (score >= 75) return 'Strong';
    if (score >= 40) return 'Average';
    return 'Weak';
  }

  private updateImprovementMetric(subject: SubjectName, oldScore: number, newScore: number): void {
    const improvements = [...this.improvementsSubject.getValue()];
    const index = improvements.findIndex(i => i.subject === subject);
    const diff = newScore - oldScore;
    const pct = oldScore > 0 ? parseFloat(((diff / oldScore) * 100).toFixed(1)) : 0;
    const trend = diff > 0 ? 'up' : diff < 0 ? 'down' : 'steady';

    if (index !== -1) {
      improvements[index] = {
        ...improvements[index],
        previousScore: oldScore,
        latestScore: newScore,
        improvementPercentage: pct,
        trend,
        consistencyDays: improvements[index].consistencyDays + 1
      };
    } else {
      improvements.push({
        subject,
        previousScore: oldScore,
        latestScore: newScore,
        improvementPercentage: pct,
        trend,
        consistencyDays: 1,
        recommendationsResolved: 0
      });
    }

    this.improvementsSubject.next(improvements);
    this.storage.setItem(this.IMPROVEMENTS_KEY, improvements);
  }

  private updateRoadmapProgression(performances: SubjectPerformance[]): void {
    const roadmap = [...this.roadmapSubject.getValue()];
    
    // Evaluate if current active steps should transition to completed based on subject mastery
    for (let i = 0; i < roadmap.length; i++) {
      const step = roadmap[i];
      const perf = performances.find(p => p.subject === step.subject);

      if (perf && perf.score >= 70 && step.status === 'current') {
        roadmap[i] = { ...step, status: 'completed' };
        // Advance next upcoming step
        const nextStep = roadmap.find(s => s.status === 'upcoming');
        if (nextStep) {
          nextStep.status = 'current';
        }
      }
    }

    this.roadmapSubject.next(roadmap);
    this.storage.setItem(this.ROADMAP_KEY, roadmap);
  }

  public resetDemoData(): void {
    this.subjectPerformancesSubject.next(INITIAL_SUBJECT_PERFORMANCES);
    this.storage.setItem(this.PERFORMANCES_KEY, INITIAL_SUBJECT_PERFORMANCES);

    this.roadmapSubject.next(INITIAL_ROADMAP_STEPS);
    this.storage.setItem(this.ROADMAP_KEY, INITIAL_ROADMAP_STEPS);

    this.improvementsSubject.next(INITIAL_IMPROVEMENT_METRICS);
    this.storage.setItem(this.IMPROVEMENTS_KEY, INITIAL_IMPROVEMENT_METRICS);

    this.recalculateAdaptiveRecommendations(INITIAL_SUBJECT_PERFORMANCES);
  }
}
