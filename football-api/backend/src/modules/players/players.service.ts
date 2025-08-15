import { Inject, Injectable } from '@nestjs/common';
import { IPlayerRepository, PlayersListFilters } from './interfaces/player-repository.interface';
import { PlayersQueryDto } from './dto/players-query.dto';
import { PlayerDto } from './dto/player.dto';
import { Parser as Json2CsvParser } from 'json2csv';

// --- Helper: parsear ?sort=name,-rating a array tipado --- //
type SortKey = 'name' | 'club' | 'nationality' | 'position' | 'rating' | 'speed';
type OrderItem = [SortKey, 'ASC' | 'DESC'];

function parseSort(sort?: string): OrderItem[] | undefined {
  if (!sort) return undefined;
  const allowed = new Set<SortKey>(['name', 'club', 'nationality', 'position', 'rating', 'speed']);
  const tokens = sort.split(',').map((s) => s.trim()).filter(Boolean);
  const out: OrderItem[] = [];
  for (const t of tokens) {
    const dir: 'ASC' | 'DESC' = t.startsWith('-') ? 'DESC' : 'ASC';
    const key = (t.startsWith('-') ? t.slice(1) : t) as SortKey;
    if (allowed.has(key)) out.push([key, dir]);
  }
  return out.length ? out : undefined;
}

// --- Helper: normalizar a número (evita null/undefined/NaN) --- //
const num = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

@Injectable()
export class PlayersService {
  constructor(
    @Inject('IPlayerRepository')
    private readonly playerRepository: IPlayerRepository,
  ) {}

  // Detalle + radar (con números siempre válidos)
  async getPlayerById(id: number): Promise<PlayerDto | undefined> {
    const player = await this.playerRepository.findOneById(id);
    if (!player) return undefined;

    const radar = [
      { label: 'Speed',     value: num((player as any).speed) },
      { label: 'Shooting',  value: num((player as any).shooting) },
      { label: 'Passing',   value: num((player as any).passing) },
      { label: 'Dribbling', value: num((player as any).dribbling) },
    ];

    // además normalizamos las props numéricas del DTO
    return new PlayerDto({
      ...player,
      speed:     num((player as any).speed),
      shooting:  num((player as any).shooting),
      passing:   num((player as any).passing),
      dribbling: num((player as any).dribbling),
      rating:    num((player as any).rating),
      radar,
    });
  }

  // Listado con filtros + paginación + ordenamiento
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
      order: parseSort(q.sort),
    };

    const { rows, count } = await this.playerRepository.findManyAndCount(filters);

    return {
      items: rows.map((p) =>
        new PlayerDto({
          ...p,
          speed:     num((p as any).speed),
          shooting:  num((p as any).shooting),
          passing:   num((p as any).passing),
          dribbling: num((p as any).dribbling),
          rating:    num((p as any).rating),
        }),
      ),
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit) || 1,
      },
    };
  }

  // Export CSV con mismos filtros (respetando sort)
  async exportCsv(q: PlayersQueryDto): Promise<string> {
    const limit = 100000;
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
      order: parseSort(q.sort),
    };

    const { rows } = await this.playerRepository.findManyAndCount(filters);
    const data = rows.map((p) =>
      new PlayerDto({
        ...p,
        speed:     num((p as any).speed),
        shooting:  num((p as any).shooting),
        passing:   num((p as any).passing),
        dribbling: num((p as any).dribbling),
        rating:    num((p as any).rating),
      }),
    );

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
