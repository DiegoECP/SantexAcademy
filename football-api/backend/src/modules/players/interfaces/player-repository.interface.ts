import { Player } from '../entities/player.entity';

// types simples para filtros y paginación:
export type PlayersListFilters = {
  name?: string;
  club?: string;
  nationality?: string;
  position?: string;
  minRating?: number;
  maxRating?: number;
  minSpeed?: number;
  maxSpeed?: number;
  limit: number;   // requerido
  offset: number;  // requerido
  order?: [keyof Player, 'ASC' | 'DESC'][]; // opcional
};

export interface IPlayerRepository {
  findAll(): Promise<Player[]>;
  findOneById(id: number): Promise<Player | undefined>;

  // NUEVO: listar con filtros + conteo total
  findManyAndCount(
    filters: PlayersListFilters
  ): Promise<{ rows: Player[]; count: number }>;
}

