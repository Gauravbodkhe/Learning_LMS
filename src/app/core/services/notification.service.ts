import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppNotification } from '../models/lms.models';
import { INITIAL_NOTIFICATIONS } from './demo-data';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private storage = inject(StorageService);
  private readonly STORAGE_KEY = 'notifications';

  private notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  public notifications$: Observable<AppNotification[]> = this.notificationsSubject.asObservable();

  public unreadCount$: Observable<number> = this.notifications$.pipe(
    map(notifs => notifs.filter(n => !n.read).length)
  );

  constructor() {
    this.loadNotifications();
  }

  private loadNotifications(): void {
    const saved = this.storage.getItem<AppNotification[]>(this.STORAGE_KEY, INITIAL_NOTIFICATIONS);
    this.notificationsSubject.next(saved);
  }

  getNotifications(): AppNotification[] {
    return this.notificationsSubject.getValue();
  }

  addNotification(notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): void {
    const newNotif: AppNotification = {
      ...notification,
      id: 'notif_' + Date.now(),
      timestamp: 'Just now',
      read: false
    };

    const updated = [newNotif, ...this.notificationsSubject.getValue()];
    this.notificationsSubject.next(updated);
    this.storage.setItem(this.STORAGE_KEY, updated);
  }

  markAsRead(id: string): void {
    const updated = this.notificationsSubject.getValue().map(n => {
      if (n.id === id) {
        return { ...n, read: true };
      }
      return n;
    });
    this.notificationsSubject.next(updated);
    this.storage.setItem(this.STORAGE_KEY, updated);
  }

  markAllAsRead(): void {
    const updated = this.notificationsSubject.getValue().map(n => ({ ...n, read: true }));
    this.notificationsSubject.next(updated);
    this.storage.setItem(this.STORAGE_KEY, updated);
  }

  clearAll(): void {
    this.notificationsSubject.next([]);
    this.storage.setItem(this.STORAGE_KEY, []);
  }

  resetDemoNotifications(): void {
    this.notificationsSubject.next(INITIAL_NOTIFICATIONS);
    this.storage.setItem(this.STORAGE_KEY, INITIAL_NOTIFICATIONS);
  }
}
