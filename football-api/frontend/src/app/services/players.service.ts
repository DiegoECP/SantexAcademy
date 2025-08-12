import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Player {
  id: number;
  name: string;
  club: string;
  position: string;
  nationality: string;
  rating: number;
  speed: number;
  shooting: number;
  dribbling: number;
  passing: number;
  radar?: { label: string; value: number }[];
}

export interface Paged<T> {
  items: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

@Injectable({ providedIn: 'root' })
export class PlayersService {
  constructor(private http: HttpClient) {}

  list(params: {
    page?: number;
    limit?: number;
    name?: string;
    club?: string;
    nationality?: string;
    position?: string;
    minRating?: number;
    maxRating?: number;
    minSpeed?: number;
    maxSpeed?: number;
    sort?: string;
  }) {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') httpParams = httpParams.set(k, String(v));
    });

    return this.http.get<Paged<Player>>('/api/players', { params: httpParams });
  }

  get(id: number) {
    return this.http.get<Player>(`/api/players/${id}`);
  }
  
}
