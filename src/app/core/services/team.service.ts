import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TeamMember } from '../models/lms.models';
import { DEFAULT_TEAM_MEMBERS } from './demo-data';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private storage = inject(StorageService);
  private readonly TEAM_KEY = 'project_team_members';

  private teamSubject = new BehaviorSubject<TeamMember[]>([]);
  public team$: Observable<TeamMember[]> = this.teamSubject.asObservable();

  constructor() {
    this.loadTeam();
  }

  private loadTeam(): void {
    const saved = this.storage.getItem<any[]>(this.TEAM_KEY, []);
    // Discard stale data: must be 5 members and have no rollNumber/rollNo
    const isValid = Array.isArray(saved) &&
      saved.length === 5 &&
      saved.every(m => m && m.id && m.name && m.module && m.summary && !('rollNumber' in m) && !('rollNo' in m));

    if (isValid) {
      this.teamSubject.next(saved as TeamMember[]);
    } else {
      this.teamSubject.next(DEFAULT_TEAM_MEMBERS);
      this.storage.setItem(this.TEAM_KEY, DEFAULT_TEAM_MEMBERS);
    }
  }

  getTeam(): TeamMember[] {
    return this.teamSubject.getValue();
  }

  updateMember(id: string, name: string): boolean {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 40) {
      return false;
    }

    const updated = this.teamSubject.getValue().map(member => {
      if (member.id === id) {
        return { ...member, name: trimmed };
      }
      return member;
    });

    this.teamSubject.next(updated);
    this.storage.setItem(this.TEAM_KEY, updated);
    return true;
  }

  resetTeam(): void {
    this.teamSubject.next(DEFAULT_TEAM_MEMBERS);
    this.storage.setItem(this.TEAM_KEY, DEFAULT_TEAM_MEMBERS);
  }
}
