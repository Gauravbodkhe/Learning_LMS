import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="app-footer">
      <div class="footer-container">
        <span class="footer-credits">M1: Gaurav Bodkhe · M2: Shantanu Gadhave · M3: Samarth Tanpure · M4: Pranav Pagar · M5: Pranav Pagire</span>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer {
      min-height: 40px;
      border-top: 1px solid var(--border);
      background-color: var(--bg-surface);
      margin-top: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px 16px;
      transition: background-color 150ms ease, border-color 150ms ease;
    }
    .footer-container {
      width: 100%;
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .footer-credits {
      font-size: 0.75rem;
      font-weight: 400;
      color: var(--text-secondary);
      line-height: 1.5;
      word-break: normal;
      overflow-wrap: break-word;
    }
  `]
})
export class FooterComponent {}
