import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Player {
  id: number;
  name: string;
  club: string;
  position: string;
  nationality: string;
  rating: number;
  speed: number | null;
  shooting: number | null;
  dribbling: number | null;
  passing: number | null;
  radar?: { label: string; value: number }[];
}

export interface Paged<T> {
  items: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface PlayersQuery {
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
  sort?: string; // ej: 'name' | '-rating' | 'name,-rating'
}

@Injectable({ providedIn: 'root' })
export class PlayersService {
  private readonly baseUrl = '/api';

  constructor(private http: HttpClient) {}

  /** Helper para construir HttpParams sin claves vacías */
  private toHttpParams(params: Record<string, any>): HttpParams {
    let hp = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        hp = hp.set(k, String(v));
      }
    });
    return hp;
  }

  list(params: PlayersQuery) {
    const httpParams = this.toHttpParams(params);
    return this.http.get<Paged<Player>>(`${this.baseUrl}/players`, { params: httpParams });
  }

  get(id: number) {
    return this.http.get<Player>(`${this.baseUrl}/players/${id}`);
  }

  /** Descarga CSV respetando los mismos filtros/orden que la lista */
  export(params: PlayersQuery): Observable<Blob> {
    const httpParams = this.toHttpParams(params);
    return this.http.get(`${this.baseUrl}/players/export`, {
      params: httpParams,
      responseType: 'blob',
    });
  }
}
