import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Course, CourseCategory, DifficultyLevel, Lesson } from '../models/lms.models';
import { INITIAL_COURSES } from './demo-data';
import { StorageService } from './storage.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private storage = inject(StorageService);
  private notificationService = inject(NotificationService);

  private readonly COURSES_KEY = 'courses_list';

  private coursesSubject = new BehaviorSubject<Course[]>([]);
  public courses$: Observable<Course[]> = this.coursesSubject.asObservable();

  constructor() {
    this.loadCourses();
  }

  private loadCourses(): void {
    const saved = this.storage.getItem<Course[]>(this.COURSES_KEY, INITIAL_COURSES);
    this.coursesSubject.next(saved);
  }

  getCourses(): Course[] {
    return this.coursesSubject.getValue();
  }

  getCourseById(courseId: string): Course | undefined {
    return this.coursesSubject.getValue().find(c => c.id === courseId);
  }

  getEnrolledCourses(): Course[] {
    return this.coursesSubject.getValue().filter(c => c.enrolled);
  }

  enrollCourse(courseId: string): boolean {
    const courses = [...this.coursesSubject.getValue()];
    const index = courses.findIndex(c => c.id === courseId);
    if (index === -1) return false;

    if (courses[index].enrolled) return true;

    courses[index] = {
      ...courses[index],
      enrolled: true,
      enrolledDate: new Date().toISOString().split('T')[0],
      progressPercentage: 0
    };

    this.coursesSubject.next(courses);
    this.storage.setItem(this.COURSES_KEY, courses);

    this.notificationService.addNotification({
      title: 'Course Enrolled!',
      message: `You are now enrolled in "${courses[index].title}". Ready to begin learning!`,
      type: 'course',
      link: `/learning/${courseId}`
    });

    return true;
  }

  updateLessonStatus(courseId: string, lessonId: string, completed: boolean): void {
    const courses = [...this.coursesSubject.getValue()];
    const courseIndex = courses.findIndex(c => c.id === courseId);
    if (courseIndex === -1) return;

    const course = { ...courses[courseIndex] };
    let totalLessons = 0;
    let completedLessons = 0;

    course.chapters = course.chapters.map(chapter => {
      const updatedLessons = chapter.lessons.map(lesson => {
        let isComp = lesson.completed;
        if (lesson.id === lessonId) {
          isComp = completed;
        }
        totalLessons++;
        if (isComp) completedLessons++;
        return { ...lesson, completed: isComp };
      });
      return { ...chapter, lessons: updatedLessons };
    });

    // Auto enroll if not yet enrolled
    if (!course.enrolled) {
      course.enrolled = true;
      course.enrolledDate = new Date().toISOString().split('T')[0];
    }

    const newProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    course.progressPercentage = newProgress;

    courses[courseIndex] = course;
    this.coursesSubject.next(courses);
    this.storage.setItem(this.COURSES_KEY, courses);
  }

  findLesson(courseId: string, lessonId: string): { lesson: Lesson; course: Course } | null {
    const course = this.getCourseById(courseId);
    if (!course) return null;

    for (const chapter of course.chapters) {
      const lesson = chapter.lessons.find(l => l.id === lessonId);
      if (lesson) {
        return { lesson, course };
      }
    }
    return null;
  }

  filterCourses(
    searchQuery: string = '',
    category: CourseCategory = 'All',
    difficulty: 'All' | DifficultyLevel = 'All',
    sortBy: 'title' | 'progress' | 'duration' | 'default' = 'default'
  ): Course[] {
    let list = [...this.coursesSubject.getValue()];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.shortDescription.toLowerCase().includes(q) ||
        c.instructor.name.toLowerCase().includes(q) ||
        c.subjectTag.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'All') {
      list = list.filter(c => c.category === category);
    }

    if (difficulty && difficulty !== 'All') {
      list = list.filter(c => c.difficulty === difficulty);
    }

    if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'progress') {
      list.sort((a, b) => b.progressPercentage - a.progressPercentage);
    } else if (sortBy === 'duration') {
      list.sort((a, b) => a.durationHours - b.durationHours);
    }

    return list;
  }

  resetDemoCourses(): void {
    this.coursesSubject.next(INITIAL_COURSES);
    this.storage.setItem(this.COURSES_KEY, INITIAL_COURSES);
  }
}
