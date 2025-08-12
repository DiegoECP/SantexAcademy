import { Inject, Injectable } from '@nestjs/common';
import { IPlayerRepository, PlayersListFilters } from './interfaces/player-repository.interface';
import { PlayersQueryDto } from './dto/players-query.dto';
import { PlayerDto } from './dto/player.dto';
import { Parser as Json2CsvParser } from 'json2csv';

// --- NUEVO: helper para parsear ?sort=name,-rating a un array tipado --- //
type SortKey = 'name' | 'club' | 'nationality' | 'position' | 'rating' | 'speed';
type OrderItem = [SortKey, 'ASC' | 'DESC'];

function parseSort(sort?: string): OrderItem[] | undefined {
  if (!sort) return undefined;
  const allowed = new Set<SortKey>(['name','club','nationality','position','rating','speed']);
  const tokens = sort.split(',').map(s => s.trim()).filter(Boolean);
  const out: OrderItem[] = [];
  for (const t of tokens) {
    const dir: 'ASC' | 'DESC' = t.startsWith('-') ? 'DESC' : 'ASC';
    const key = (t.startsWith('-') ? t.slice(1) : t) as SortKey;
    if (allowed.has(key)) out.push([key, dir]);
  }
  return out.length ? out : undefined;
}
// ---------------------------------------------------------------------- //

@Injectable()
export class PlayersService {
  constructor(
    @Inject('IPlayerRepository')
    private readonly playerRepository: IPlayerRepository,
  ) {}

  // Detalle + radar
  async getPlayerById(id: number): Promise<PlayerDto | undefined> {
    const player = await this.playerRepository.findOneById(id);
    if (!player) return undefined;

    const radar = [
      { label: 'Speed',     value: player.speed ?? 0 },
      { label: 'Shooting',  value: player.shooting ?? 0 },
      { label: 'Passing',   value: player.passing ?? 0 },
      { label: 'Dribbling', value: player.dribbling ?? 0 },
    ];

    return new PlayerDto({ ...player, radar });
  }

  // Listado con filtros + paginación + ORDENAMIENTO
  async list(q: PlayersQueryDto): Promise<{ items: PlayerDto[]; meta: any }> {
    const page = q.page ?? 1;
    const limit = q.limit ?? 10;
    const offset = (page - 1) * limit;

    const filters: PlayersListFilters = {
      name: q.name,
      club: q.club,
      nationality: q.nationality,
      position: q.position,
      minRating: q.minRating,
      maxRating: q.maxRating,
      minSpeed: q.minSpeed,
      maxSpeed: q.maxSpeed,
      limit,
      offset,
      order: parseSort(q.sort), // ← NUEVO: pasamos el orden al repo (en claves de dominio)
    };

    const { rows, count } = await this.playerRepository.findManyAndCount(filters);

    return {
      items: rows.map((p) => new PlayerDto(p)),
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit) || 1,
      },
    };
  }

  // Export CSV con mismos filtros (y podés mantener o quitar "order" según prefieras)
  async exportCsv(q: PlayersQueryDto): Promise<string> {
    const limit = 100000; // grande para exportar
    const offset = 0;

    const filters: PlayersListFilters = {
      name: q.name,
      club: q.club,
      nationality: q.nationality,
      position: q.position,
      minRating: q.minRating,
      maxRating: q.maxRating,
      minSpeed: q.minSpeed,
      maxSpeed: q.maxSpeed,
      limit,
      offset,
      order: parseSort(q.sort), // opcional: exportar respetando el sort
    };

    const { rows } = await this.playerRepository.findManyAndCount(filters);
    const data = rows.map((p) => new PlayerDto(p));

    const fields = [
      'id',
      'name',
      'club',
      'position',
      'nationality',
      'rating',
      'speed',
      'shooting',
      'dribbling',
      'passing',
    ];

    const parser = new Json2CsvParser({ fields });
    return parser.parse(data);
  }
}
