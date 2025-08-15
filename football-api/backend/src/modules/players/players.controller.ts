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
  Header, Res,
} from '@nestjs/common';
import { Response } from 'express';
import { PlayersService } from './players.service';
import { PlayerDto } from './dto/player.dto';
import { PlayersQueryDto } from './dto/players-query.dto';

@Controller('api/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

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

  @Get('export')
  @HttpCode(HttpStatus.OK)
  async exportCsv(@Query() query: PlayersQueryDto, @Res() res: Response) {
    const csv = await this.playersService.exportCsv(query);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="players.csv"');
    return res.send(csv);
  }

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
