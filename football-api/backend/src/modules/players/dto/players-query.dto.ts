import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

const toOptionalInt = ({ value }: { value: any }) =>
  value === undefined || value === null || value === '' ? undefined : parseInt(value, 10);

export class PlayersQueryDto {
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
  sort?: string;
}
