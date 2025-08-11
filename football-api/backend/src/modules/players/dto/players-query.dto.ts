import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

const toOptionalInt = ({ value }: { value: any }) =>
  value === undefined || value === null || value === '' ? undefined : parseInt(value, 10);

export class PlayersQueryDto {
  @Transform(toOptionalInt)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Transform(toOptionalInt)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @IsString() @IsOptional() name?: string;
  @IsString() @IsOptional() club?: string;
  @IsString() @IsOptional() nationality?: string;
  @IsString() @IsOptional() position?: string;

  @Transform(toOptionalInt) @IsInt() @IsOptional() minRating?: number;
  @Transform(toOptionalInt) @IsInt() @IsOptional() maxRating?: number;
  @Transform(toOptionalInt) @IsInt() @IsOptional() minSpeed?: number;
  @Transform(toOptionalInt) @IsInt() @IsOptional() maxSpeed?: number;
}
