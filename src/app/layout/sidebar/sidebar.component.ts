import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from './sidebar.service';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  public sidebar = inject(SidebarService);
  public theme = inject(ThemeService);
  public auth = inject(AuthService);

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    // Press '[' to toggle sidebar collapse (unless typing in input/textarea)
    const target = event.target as HTMLElement;
    const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

    if (event.key === '[' && !isInput && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      this.sidebar.toggleCollapse();
    } else if (event.key === 'Escape' && this.sidebar.isMobileOpen()) {
      this.sidebar.closeMobile();
    }
  }

  onNavClick(): void {
    if (this.sidebar.isMobileOpen()) {
      this.sidebar.closeMobile();
    }
  }
}
