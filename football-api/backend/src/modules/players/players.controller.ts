import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
  UsePipes,
  ValidationPipe,
  Header,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayerDto } from './dto/player.dto';
import { PlayersQueryDto } from './dto/players-query.dto'; // <-- NUEVO

@Controller('api/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  // NUEVO: listado con filtros y paginación
  @Get()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async list(@Query() query: PlayersQueryDto) {
    // Devuelve: { items: PlayerDto[], meta: { total, page, limit, totalPages } }
    const res = await this.playersService.list(query);
    return {
      items: res.items.map((p) => new PlayerDto(p)),
      meta: res.meta,
    };
  }
  // NUEVO: exportar CSV
  @Get('export')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="players.csv"')
  async exportCsv(@Query() query: PlayersQueryDto) {
    return this.playersService.exportCsv(query); // retorna string CSV
  }

  // EXISTENTE: detalle por id (lo dejamos tal cual)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getPlayerById(@Param('id', ParseIntPipe) id: number): Promise<PlayerDto> {
    const player = await this.playersService.getPlayerById(id);
    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found.`);
    }
    return player; // PlayerDto con "radar"
  }

}
