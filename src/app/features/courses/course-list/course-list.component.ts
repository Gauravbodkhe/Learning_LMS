import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { Course, CourseCategory, DifficultyLevel } from '../../../core/models/lms.models';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.css'
})
export class CourseListComponent implements OnInit {
  public courseService = inject(CourseService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public searchQuery: string = '';
  public selectedCategory: CourseCategory = 'All';
  public selectedDifficulty: 'All' | DifficultyLevel = 'All';
  public selectedSort: 'default' | 'title' | 'progress' | 'duration' = 'default';
  public myLearningOnly: boolean = false;

  public categories: CourseCategory[] = [
    'All',
    'Programming',
    'Web Development',
    'Data Science',
    'Database Management',
    'Computer Science Fundamentals'
  ];

  public difficulties: ('All' | DifficultyLevel)[] = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  public filteredCourses: Course[] = [];

  ngOnInit(): void {
    // Check if route is /my-learning
    this.route.url.subscribe(urlSegments => {
      this.myLearningOnly = urlSegments.some(s => s.path === 'my-learning');
      this.applyFilters();
    });
  }

  applyFilters(): void {
    let list = this.courseService.filterCourses(
      this.searchQuery,
      this.selectedCategory,
      this.selectedDifficulty,
      this.selectedSort
    );

    if (this.myLearningOnly) {
      list = list.filter(c => c.enrolled);
    }

    this.filteredCourses = list;
  }

  setCategory(cat: CourseCategory): void {
    this.selectedCategory = cat;
    this.applyFilters();
  }

  setDifficulty(diff: 'All' | DifficultyLevel): void {
    this.selectedDifficulty = diff;
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  getLessonsCount(course: Course): number {
    return course.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
  }

  getCompletedLessonsCount(course: Course): number {
    return course.chapters.reduce((acc, ch) => acc + ch.lessons.filter(l => l.completed).length, 0);
  }

  enrollOrContinue(course: Course, event: Event): void {
    event.stopPropagation();
    if (!course.enrolled) {
      this.courseService.enrollCourse(course.id);
    }
    this.router.navigate(['/learning', course.id]);
  }

  openCourseDetails(courseId: string): void {
    this.router.navigate(['/courses', courseId]);
  }

  onThumbError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect fill="%231e222b" width="600" height="400"/><text fill="%239aa1ad" font-family="sans-serif" font-size="20" font-weight="600" x="50%" y="50%" text-anchor="middle" dominant-baseline="middle">AdaptiveLMS Course</text></svg>';
    }
  }
}
