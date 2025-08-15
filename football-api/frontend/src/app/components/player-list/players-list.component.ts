import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { debounceTime, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { PlayersService, Player, Paged } from '../../services/players.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-players-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './players-list.component.html',
})
export class PlayersListComponent implements OnInit, OnDestroy {
  data: Player[] = [];
  total = 0;
  page = 1;
  limit = 10;
  loading = false;

  private destroy$ = new Subject<void>();
  sort?: string; // 'name' | '-rating' | 'name,-rating'

  form!: ReturnType<FormBuilder['group']>;

  constructor(private fb: FormBuilder, private players: PlayersService) {
    this.form = this.fb.group({
      name: [''],
      club: [''],
      nationality: [''],
      position: [''],
      minRating: [''],
      maxRating: [''],
      minSpeed: [''],
      maxSpeed: [''],
    });
  }

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
        sort: this.sort,
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

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.limit));
  }

  toggleSort(field: 'name' | 'club' | 'nationality' | 'position' | 'rating' | 'speed') {
    if (!this.sort || !this.sort.includes(field)) {
      this.sort = field; // asc
    } else if (this.sort === field) {
      this.sort = `-${field}`; // desc
    } else {
      this.sort = undefined; // sin orden
    }
    this.page = 1;
    this.fetch().subscribe();
  }

  /** Descargar CSV con los filtros/orden actuales */
  export() {
    const v = this.form.value;

    this.players
      .export({
        // para export no necesitamos paginar, el back usa un tope alto
        name: v.name || undefined,
        club: v.club || undefined,
        nationality: v.nationality || undefined,
        position: v.position || undefined,
        minRating: v.minRating ? Number(v.minRating) : undefined,
        maxRating: v.maxRating ? Number(v.maxRating) : undefined,
        minSpeed: v.minSpeed ? Number(v.minSpeed) : undefined,
        maxSpeed: v.maxSpeed ? Number(v.maxSpeed) : undefined,
        sort: this.sort,
      })
      .subscribe((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'players.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      });
  }
}
