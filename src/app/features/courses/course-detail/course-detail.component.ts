import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { Course } from '../../../core/models/lms.models';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css'
})
export class CourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public courseService = inject(CourseService);

  public course: Course | undefined;
  public totalLessonsCount = 0;
  public completedLessonsCount = 0;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const courseId = params.get('id');
      if (courseId) {
        this.loadCourse(courseId);
      }
    });
  }

  loadCourse(courseId: string): void {
    this.course = this.courseService.getCourseById(courseId);
    if (this.course) {
      let total = 0;
      let completed = 0;
      this.course.chapters.forEach(ch => {
        ch.lessons.forEach(l => {
          total++;
          if (l.completed) completed++;
        });
      });
      this.totalLessonsCount = total;
      this.completedLessonsCount = completed;
    }
  }

  onEnrollOrContinue(): void {
    if (!this.course) return;

    if (!this.course.enrolled) {
      this.courseService.enrollCourse(this.course.id);
      this.loadCourse(this.course.id);
    }

    this.router.navigate(['/learning', this.course.id]);
  }

  openSpecificLesson(lessonId: string): void {
    if (!this.course) return;
    if (!this.course.enrolled) {
      this.courseService.enrollCourse(this.course.id);
    }
    this.router.navigate(['/learning', this.course.id], { queryParams: { lesson: lessonId } });
  }
}
