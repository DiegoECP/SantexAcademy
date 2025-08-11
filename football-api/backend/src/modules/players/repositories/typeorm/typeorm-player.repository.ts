import { Injectable } from '@nestjs/common';
import { IPlayerRepository, PlayersListFilters } from '../../interfaces/player-repository.interface';
import { Player } from '../../entities/player.entity';

@Injectable()
export class TypeOrmPlayerRepository implements IPlayerRepository {
  // No inyectamos Repository ni importamos entidad, porque este repo no se usa en runtime

  async findOneById(_id: number): Promise<Player | undefined> {
    // Stub: no implementado porque no usamos TypeORM en este proyecto
    return undefined;
  }

  async findAll(): Promise<Player[]> {
    // Stub: lista vacía para cumplir la interfaz
    return [];
  }

  async findManyAndCount(_filters: PlayersListFilters): Promise<{ rows: Player[]; count: number }> {
    // Stub: cumple la interfaz (paginación/filtros se resuelven en otros repos reales)
    return { rows: [], count: 0 };
  }
}
