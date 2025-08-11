import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { debounceTime, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { PlayersService, Player, Paged } from '../../services/players.service';

@Component({
  selector: 'app-players-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './players-list.component.html',
})
export class PlayersListComponent implements OnInit, OnDestroy {
  data: Player[] = [];
  total = 0;
  page = 1;
  limit = 10;
  loading = false;

  form = this.fb.group({
    name: [''],
    club: [''],
    nationality: [''],
    position: [''],
    minRating: [''],
    maxRating: [''],
    minSpeed: [''],
    maxSpeed: [''],
  });

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private players: PlayersService) {}

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => (this.page = 1)),
        switchMap(() => this.fetch()),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.fetch().pipe(takeUntil(this.destroy$)).subscribe();
  }

  fetch() {
    this.loading = true;
    const v = this.form.value;
    return this.players
      .list({
        page: this.page,
        limit: this.limit,
        name: v.name || undefined,
        club: v.club || undefined,
        nationality: v.nationality || undefined,
        position: v.position || undefined,
        minRating: v.minRating ? Number(v.minRating) : undefined,
        maxRating: v.maxRating ? Number(v.maxRating) : undefined,
        minSpeed: v.minSpeed ? Number(v.minSpeed) : undefined,
        maxSpeed: v.maxSpeed ? Number(v.maxSpeed) : undefined,
      })
      .pipe(
        tap((res: Paged<Player>) => {
          this.data = res.items;
          this.total = res.meta.total;
          this.loading = false;
        })
      );
  }

  prev() {
    if (this.page > 1) {
      this.page -= 1;
      this.fetch().subscribe();
    }
  }

  next() {
    const totalPages = Math.max(1, Math.ceil(this.total / this.limit));
    if (this.page < totalPages) {
      this.page += 1;
      this.fetch().subscribe();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
