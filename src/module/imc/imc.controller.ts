import { Controller, Post, Body, ValidationPipe, Query, Get } from '@nestjs/common';
import { ImcService } from './imc.service';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { IsDateString, IsOptional } from 'class-validator';

export class FiltroHistorialDto {
  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @IsOptional()
  @IsDateString()
  fechaFin?: string;
}

@Controller('imc')
export class ImcController {
  constructor(private readonly imcService: ImcService) { }

  @Post('calcular')
  async calcular(@Body(ValidationPipe) data: CalcularImcDto) {
    return await this.imcService.calcularImc(data);
  }

  @Get('historial')
  async obtenerHistorial(@Query(ValidationPipe) filtros: FiltroHistorialDto) {
    const { fechaInicio, fechaFin } = filtros;

    const fechaInicioDate = fechaInicio ? new Date(fechaInicio) : undefined;
    const fechaFinDate = fechaFin ? new Date(fechaFin) : undefined;

    return await this.imcService.obtenerHistorial(fechaInicioDate, fechaFinDate)
  }
}
