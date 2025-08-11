import { Inject, Injectable } from '@nestjs/common';
import { IPlayerRepository, PlayersListFilters } from './interfaces/player-repository.interface';
import { PlayersQueryDto } from './dto/players-query.dto';
import { PlayerDto } from './dto/player.dto';
import { Parser as Json2CsvParser } from 'json2csv';

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
      // si luego agregás Defense/Physical, los sumás acá
    ];

    return new PlayerDto({ ...player, radar });
  }

  // Listado con filtros + paginación
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
      // sin "order": cada repo decide (Sequelize: longName ASC)
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

  // Export CSV con mismos filtros
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
