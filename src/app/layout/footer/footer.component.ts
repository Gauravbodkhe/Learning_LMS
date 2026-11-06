import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamService } from '../../core/services/team.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="app-footer">
      <div class="footer-container">
        @if (teamService.team$ | async; as members) {
          <span class="footer-credits">
            @for (m of members; track m.id; let last = $last) {
              {{ m.id.toUpperCase() }}: {{ m.name }}{{ !last ? ' · ' : '' }}
            }
          </span>
        }
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
export class FooterComponent {
  public teamService = inject(TeamService);
}
