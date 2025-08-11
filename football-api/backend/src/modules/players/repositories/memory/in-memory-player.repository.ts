import { Injectable } from '@nestjs/common';
import { IPlayerRepository, PlayersListFilters } from '../../interfaces/player-repository.interface';
import { Player } from '../../entities/player.entity';

@Injectable()
export class InMemoryPlayerRepository implements IPlayerRepository {
  private store: Player[] = [];

  async findOneById(id: number): Promise<Player | undefined> {
    return this.store.find(p => p.id === id);
  }
  // Devuelve todos los jugadores en memoria
  async findAll(): Promise<Player[]> {
    return this.store;
  }

  // NUEVO
  async findManyAndCount(filters: PlayersListFilters): Promise<{ rows: Player[]; count: number }> {
    // base: todo el arreglo en memoria
    let data = await this.findAll();

    // filtros (sobre campos de la entidad Player)
    if (filters.name)        data = data.filter(p => p.name?.toLowerCase().includes(filters.name!.toLowerCase()));
    if (filters.club)        data = data.filter(p => p.club?.toLowerCase().includes(filters.club!.toLowerCase()));
    if (filters.nationality) data = data.filter(p => p.nationality?.toLowerCase().includes(filters.nationality!.toLowerCase()));
    if (filters.position)    data = data.filter(p => p.position?.toLowerCase().includes(filters.position!.toLowerCase()));

    if (filters.minRating != null) data = data.filter(p => (p.rating ?? 0) >= filters.minRating!);
    if (filters.maxRating != null) data = data.filter(p => (p.rating ?? 0) <= filters.maxRating!);

    if (filters.minSpeed  != null) data = data.filter(p => (p.speed ?? 0) >= filters.minSpeed!);
    if (filters.maxSpeed  != null) data = data.filter(p => (p.speed ?? 0) <= filters.maxSpeed!);

    // orden (por defecto name ASC)
    const order = filters.order ?? [['name', 'ASC']] as any;
    const [key, dir] = order[0] as [keyof Player, 'ASC'|'DESC'];
    data = [...data].sort((a,b) => {
      const av = (a[key] ?? '') as any;
      const bv = (b[key] ?? '') as any;
      return (String(av)).localeCompare(String(bv)) * (dir === 'ASC' ? 1 : -1);
    });

    const count = data.length;
    const start = filters.offset ?? 0;
    const end   = start + (filters.limit ?? count);
    const rows  = data.slice(start, end);

    return { rows, count };
  }
}
