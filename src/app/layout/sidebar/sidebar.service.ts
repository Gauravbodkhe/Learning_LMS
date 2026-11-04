import { Injectable, inject, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { StorageService } from '../../core/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private storage = inject(StorageService);
  private router = inject(Router);
  private readonly COLLAPSE_KEY = 'sidebar_collapsed';

  public isCollapsed = signal<boolean>(false);
  public isMobileOpen = signal<boolean>(false);

  constructor() {
    const saved = this.storage.getItem<boolean>(this.COLLAPSE_KEY, false);
    this.isCollapsed.set(saved);

    // Auto-close mobile drawer when route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeMobile();
      });
  }

  public toggleCollapse(): void {
    const next = !this.isCollapsed();
    this.isCollapsed.set(next);
    this.storage.setItem(this.COLLAPSE_KEY, next);
  }

  public toggleMobile(): void {
    this.isMobileOpen.update(v => !v);
  }

  public openMobile(): void {
    this.isMobileOpen.set(true);
  }

  public closeMobile(): void {
    this.isMobileOpen.set(false);
  }
}
