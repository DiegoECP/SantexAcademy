import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions, OrderItem } from 'sequelize';
import { PlayerModel } from './player.model';
import { IPlayerRepository, PlayersListFilters } from '../../interfaces/player-repository.interface';
import { Player } from '../../entities/player.entity';

@Injectable()
export class SequelizePlayerRepository implements IPlayerRepository {
  constructor(
    @InjectModel(PlayerModel)
    private readonly playerModel: typeof PlayerModel,
  ) {}

  // Si ya no se usa, podés borrar findAll. Lo dejo por compatibilidad.
  async findAll(): Promise<Player[]> {
    const playerList = await this.playerModel.findAll();
    return playerList.map((x) => this.mapToEntity(x));
  }

  async findOneById(id: number): Promise<Player | undefined> {
    const model = await this.playerModel.findByPk(id);
    if (!model) return undefined;
    return this.mapToEntity(model);
  }

  // NUEVO: listado con filtros + paginación + conteo
  async findManyAndCount(filters: PlayersListFilters): Promise<{ rows: Player[]; count: number }> {
    const where: WhereOptions = {};

    // --- Mapeo de filtros (DTO -> columnas reales) ---
    // name -> longName (contains)
    if (filters.name) {
      (where as any).longName = { [Op.like]: `%${filters.name}%` };
    }

    // club -> clubName (contains)
    if (filters.club) {
      (where as any).clubName = { [Op.like]: `%${filters.club}%` };
    }

    // nationality -> nationalityName (contains)
    if (filters.nationality) {
      (where as any).nationalityName = { [Op.like]: `%${filters.nationality}%` };
    }

    // position -> playerPositions (contains)
    // Nota: playerPositions suele venir "ST, CF" => usamos LIKE.
    if (filters.position) {
      (where as any).playerPositions = { [Op.like]: `%${filters.position}%` };
    }

    // rating -> overall (range)
    if (filters.minRating || filters.maxRating) {
      (where as any).overall = {};
      if (filters.minRating) (where as any).overall[Op.gte] = filters.minRating;
      if (filters.maxRating) (where as any).overall[Op.lte] = filters.maxRating;
    }

    // speed -> pace (range)
    if (filters.minSpeed || filters.maxSpeed) {
      (where as any).pace = {};
      if (filters.minSpeed) (where as any).pace[Op.gte] = filters.minSpeed;
      if (filters.maxSpeed) (where as any).pace[Op.lte] = filters.maxSpeed;
    }

    // Ordenamiento por defecto o el provisto
    const order: OrderItem[] = (filters.order as any) ?? [['longName', 'ASC']];

    const { rows, count } = await this.playerModel.findAndCountAll({
      where,
      limit: filters.limit,
      offset: filters.offset,
      order,
    });

    return {
      rows: rows.map((r) => this.mapToEntity(r)),
      count,
    };
  }

  // --- Mapper entity ---
  private mapToEntity(model: PlayerModel): Player {
    if (!model) {
      throw new Error('Attempted to map null model to Player entity');
    }

    const player = new Player();
    player.id = model.id;

    // Campos reales del modelo:
    player.name = model.longName;
    player.club = model.clubName || 'Unknown Club';
    player.position = model.playerPositions?.split(',')[0].trim() ?? 'Unknown';
    player.nationality = model.nationalityName || 'Unknown Nationality';

    // Stats
    player.rating = model.overall;
    player.speed = model.pace ?? 0;
    player.shooting = model.shooting ?? 0;
    player.dribbling = model.dribbling ?? 0;
    player.passing = model.passing ?? 0;

    return player;
  }
}
