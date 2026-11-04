import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  show(text: string, type: 'success' | 'error' | 'info' = 'success'): void {
    const id = 'toast_' + Date.now();
    const current = this.toastsSubject.getValue();
    this.toastsSubject.next([...current, { id, text, type }]);

    setTimeout(() => {
      this.dismiss(id);
    }, 3000);
  }

  dismiss(id: string): void {
    this.toastsSubject.next(this.toastsSubject.getValue().filter(t => t.id !== id));
  }
}
