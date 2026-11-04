import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { AppStateService } from '../../core/services/app-state.service';
import { SidebarService } from '../sidebar/sidebar.service';
import { AppNotification } from '../../core/models/lms.models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  public authService = inject(AuthService);
  public notificationService = inject(NotificationService);
  public sidebar = inject(SidebarService);
  private appStateService = inject(AppStateService);
  private router = inject(Router);

  public showNotifications = signal(false);
  public showProfileMenu = signal(false);

  toggleNotifications(): void {
    this.showNotifications.update(v => !v);
    if (this.showNotifications()) {
      this.showProfileMenu.set(false);
    }
  }

  toggleProfileMenu(): void {
    this.showProfileMenu.update(v => !v);
    if (this.showProfileMenu()) {
      this.showNotifications.set(false);
    }
  }

  closeDropdowns(): void {
    this.showNotifications.set(false);
    this.showProfileMenu.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.header-dropdown-container')) {
      this.showNotifications.set(false);
      this.showProfileMenu.set(false);
    }
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const q = input.value.trim();
    if (q) {
      this.router.navigate(['/courses'], { queryParams: { q } });
    }
  }

  markAsRead(notification: AppNotification, event: Event): void {
    event.stopPropagation();
    this.notificationService.markAsRead(notification.id);
    if (notification.link) {
      this.closeDropdowns();
      this.router.navigateByUrl(notification.link);
    }
  }

  markAllAsRead(event: Event): void {
    event.stopPropagation();
    this.notificationService.markAllAsRead();
  }

  clearNotifications(event: Event): void {
    event.stopPropagation();
    this.notificationService.clearAll();
  }

  onResetDemoData(): void {
    if (confirm('Reset all demo courses, quiz scores, and adaptive recommendations to original state?')) {
      this.appStateService.resetEntireDemoState();
      this.closeDropdowns();
    }
  }

  logout(): void {
    this.closeDropdowns();
    this.authService.logout();
  }
}
