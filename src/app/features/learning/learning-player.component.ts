import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { LearningService } from '../../core/services/learning.service';
import { Course, Lesson } from '../../core/models/lms.models';

@Component({
  selector: 'app-learning-player',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './learning-player.component.html',
  styleUrl: './learning-player.component.css'
})
export class LearningPlayerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public courseService = inject(CourseService);
  public learningService = inject(LearningService);

  public course: Course | undefined;
  public currentLesson: Lesson | undefined;
  public currentChapterIndex: number = 0;
  public currentLessonIndex: number = 0;
  public allLessonsFlat: { lesson: Lesson; chapterTitle: string; chIdx: number; lIdx: number }[] = [];
  public currentFlatIndex: number = 0;
  public sidebarOpen: boolean = true;
  public isVideoPlaying: boolean = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const courseId = params.get('courseId');
      if (courseId) {
        this.loadCourse(courseId);
      }
    });

    this.route.queryParamMap.subscribe(queryParams => {
      const lessonId = queryParams.get('lesson');
      if (lessonId && this.course) {
        this.selectLessonById(lessonId);
      }
    });
  }

  loadCourse(courseId: string): void {
    this.course = this.courseService.getCourseById(courseId);
    if (!this.course) return;

    // Auto enroll if accessing learning module
    if (!this.course.enrolled) {
      this.courseService.enrollCourse(this.course.id);
      this.course = this.courseService.getCourseById(courseId);
    }

    this.buildFlatLessons();

    // Default to first incomplete lesson or first lesson
    const firstIncomplete = this.allLessonsFlat.find(item => !item.lesson.completed);
    if (firstIncomplete) {
      this.setCurrentLesson(firstIncomplete.lesson, firstIncomplete.chIdx, firstIncomplete.lIdx);
    } else if (this.allLessonsFlat.length > 0) {
      this.setCurrentLesson(this.allLessonsFlat[0].lesson, 0, 0);
    }
  }

  buildFlatLessons(): void {
    if (!this.course) return;
    this.allLessonsFlat = [];
    this.course.chapters.forEach((chapter, chIdx) => {
      chapter.lessons.forEach((lesson, lIdx) => {
        this.allLessonsFlat.push({
          lesson,
          chapterTitle: chapter.title,
          chIdx,
          lIdx
        });
      });
    });
  }

  selectLessonById(lessonId: string): void {
    const item = this.allLessonsFlat.find(i => i.lesson.id === lessonId);
    if (item) {
      this.setCurrentLesson(item.lesson, item.chIdx, item.lIdx);
    }
  }

  setCurrentLesson(lesson: Lesson, chIdx: number, lIdx: number): void {
    this.currentLesson = lesson;
    this.currentChapterIndex = chIdx;
    this.currentLessonIndex = lIdx;
    this.currentFlatIndex = this.allLessonsFlat.findIndex(i => i.lesson.id === lesson.id);
    this.isVideoPlaying = false;
  }

  toggleVideoPlay(): void {
    this.isVideoPlaying = !this.isVideoPlaying;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  markCurrentLessonComplete(): void {
    if (!this.course || !this.currentLesson) return;

    this.learningService.markLessonComplete(
      this.course.id,
      this.currentLesson.id,
      this.currentLesson.title
    );

    // Refresh local course instance
    this.course = this.courseService.getCourseById(this.course.id);
    this.buildFlatLessons();

    if (this.course) {
      const updatedItem = this.allLessonsFlat.find(i => i.lesson.id === this.currentLesson?.id);
      if (updatedItem) {
        this.currentLesson = updatedItem.lesson;
      }
    }
  }

  goToPreviousLesson(): void {
    if (this.currentFlatIndex > 0) {
      const prev = this.allLessonsFlat[this.currentFlatIndex - 1];
      this.setCurrentLesson(prev.lesson, prev.chIdx, prev.lIdx);
    }
  }

  goToNextLesson(): void {
    if (this.currentFlatIndex < this.allLessonsFlat.length - 1) {
      const next = this.allLessonsFlat[this.currentFlatIndex + 1];
      this.setCurrentLesson(next.lesson, next.chIdx, next.lIdx);
    }
  }
}
