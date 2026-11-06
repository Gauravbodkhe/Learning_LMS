import { Injectable, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private storage = inject(StorageService);
  private readonly THEME_KEY = 'ui_theme';

  public currentTheme = signal<ThemeMode>('light');
  public isDark = signal<boolean>(false);

  constructor() {
    this.initTheme();
  }

  private initTheme(): void {
    // Default to 'light' mode on first launch or if not explicitly set to 'dark'
    const saved = this.storage.getItem<string>(this.THEME_KEY, 'light');
    const initialMode: ThemeMode = saved === 'dark' ? 'dark' : 'light';
    this.currentTheme.set(initialMode);
    this.applyTheme(initialMode, false);
  }

  public setTheme(mode: ThemeMode): void {
    this.currentTheme.set(mode);
    this.storage.setItem(this.THEME_KEY, mode);
    this.applyTheme(mode, true);
  }

  public toggleTheme(): void {
    const next: ThemeMode = this.isDark() ? 'light' : 'dark';
    this.setTheme(next);
  }

  private applyTheme(mode: ThemeMode, animate: boolean): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    let effectiveDark = false;

    if (animate) {
      root.classList.add('theme-transitioning');
      setTimeout(() => root.classList.remove('theme-transitioning'), 160);
    }

    if (mode === 'dark') {
      root.setAttribute('data-theme', 'dark');
      effectiveDark = true;
    } else {
      root.setAttribute('data-theme', 'light');
      effectiveDark = false;
    }

    this.isDark.set(effectiveDark);
  }
}
