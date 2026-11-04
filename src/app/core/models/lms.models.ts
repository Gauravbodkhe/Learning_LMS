export type SubjectName =
  | 'JavaScript'
  | 'Angular'
  | 'HTML and CSS'
  | 'Database Management'
  | 'Python'
  | 'Data Structures';

export type CourseCategory =
  | 'All'
  | 'Programming'
  | 'Web Development'
  | 'Artificial Intelligence'
  | 'Data Science'
  | 'Database Management'
  | 'Computer Science Fundamentals';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  department: string;
  avatarUrl?: string;
  joinedDate: string;
  bio?: string;
  studentId: string;
}

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  completed: boolean;
  type: 'video' | 'reading' | 'interactive';
  videoUrl?: string;
  content: string;
  summary: string;
  keyTakeaways: string[];
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  instructor: {
    name: string;
    title: string;
    avatar: string;
  };
  category: CourseCategory;
  difficulty: DifficultyLevel;
  durationHours: number;
  thumbnail: string;
  enrolled: boolean;
  enrolledDate?: string;
  progressPercentage: number;
  objectives: string[];
  learningOutcomes: string[];
  chapters: Chapter[];
  subjectTag: SubjectName;
}

export interface SubjectPerformance {
  subject: SubjectName;
  score: number; // 0 - 100
  attemptsCount: number;
  lastAttemptDate: string;
  strengthCategory: 'Strong' | 'Average' | 'Weak';
  topicsToReview: string[];
}

export interface AdaptiveRecommendation {
  id: string;
  subject: SubjectName;
  currentPerformance: number;
  recommendationTitle: string;
  reason: string;
  suggestedLessonId?: string;
  suggestedCourseId?: string;
  difficultyLevel: DifficultyLevel;
  recommendedAction: string;
  ruleTriggered: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

export interface RoadmapStep {
  id: string;
  level: DifficultyLevel;
  title: string;
  subject: SubjectName;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  estimatedHours: number;
  order: number;
}

export interface ImprovementMetric {
  subject: SubjectName;
  previousScore: number;
  latestScore: number;
  improvementPercentage: number;
  trend: 'up' | 'down' | 'steady';
  consistencyDays: number;
  recommendationsResolved: number;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  subject: SubjectName;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  timeLimitMinutes: number;
  passPercentage: number;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  subject: SubjectName;
  date: string;
  totalQuestions: number;
  correctAnswersCount: number;
  scorePercentage: number;
  passed: boolean;
  selectedAnswers: { [questionIndex: number]: number };
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'recommendation' | 'quiz' | 'course' | 'achievement' | 'alert';
  link?: string;
}

export interface ActivityLog {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'lesson' | 'quiz' | 'enrollment' | 'recommendation';
  icon?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  module: string;
  summary: string;
}
