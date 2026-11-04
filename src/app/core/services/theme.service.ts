import { Injectable, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private storage = inject(StorageService);
  private readonly THEME_KEY = 'ui_theme';

  public currentTheme = signal<ThemeMode>('system');
  public isDark = signal<boolean>(false);

  constructor() {
    this.initTheme();
  }

  private initTheme(): void {
    const saved = this.storage.getItem<ThemeMode>(this.THEME_KEY, 'system');
    this.currentTheme.set(saved);
    this.applyTheme(saved, false);

    // Watch for OS preference changes when in system mode
    if (typeof window !== 'undefined' && window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this.currentTheme() === 'system') {
          this.applyTheme('system', true);
        }
      });
    }
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
    } else if (mode === 'light') {
      root.setAttribute('data-theme', 'light');
      effectiveDark = false;
    } else {
      root.removeAttribute('data-theme');
      effectiveDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    this.isDark.set(effectiveDark);
  }
}
