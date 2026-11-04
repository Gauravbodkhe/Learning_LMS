import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly PREFIX = 'lms_adaptive_';

  getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(this.PREFIX + key);
      if (data === null || data === undefined) {
        return defaultValue;
      }
      return JSON.parse(data) as T;
    } catch (error) {
      console.warn(`Error reading key "${key}" from LocalStorage:`, error);
      return defaultValue;
    }
  }

  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving key "${key}" to LocalStorage:`, error);
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(this.PREFIX + key);
    } catch (error) {
      console.error(`Error removing key "${key}" from LocalStorage:`, error);
    }
  }

  clearAll(): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(this.PREFIX)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (error) {
      console.error('Error clearing LocalStorage:', error);
    }
  }
}
