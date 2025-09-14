import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class CalcularImcDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0.1) // Altura mínima razonable
  altura: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1) // Peso mínimo razonable
  peso: number;
}
