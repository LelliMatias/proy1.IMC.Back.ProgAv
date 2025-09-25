import { Controller, Post, Body, ValidationPipe, Query, Get, BadRequestException } from '@nestjs/common';
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

  @Post('test-create')
  async testCreate() {
    const testData = { peso: 70, altura: 1.75 }; // datos de prueba
    const result = await this.imcService.calcularImc(testData);
    return { ok: true, data: result };
  }

  // Endpoint de prueba para leer todos los registros
  @Get('test-list')
  async testList() {
    const data = await this.imcService.obtenerHistorial();
    return { ok: true, count: data.length, data };
  }

  @Get('historial')
  async obtenerHistorial(@Query(ValidationPipe) filtros: FiltroHistorialDto) {
    const { fechaInicio, fechaFin } = filtros;

    let fechaInicioDate: Date | undefined = undefined;
    let fechaFinDate: Date | undefined = undefined;

    if (fechaInicio) {
      fechaInicioDate = new Date(fechaInicio);
      if (isNaN(fechaInicioDate.getTime())) {
        throw new BadRequestException('fechaInicio inválida. Usar formato ISO (ej: 2025-09-01 o 2025-09-01T00:00:00Z).');
      }
    }

    if (fechaFin) {
      fechaFinDate = new Date(fechaFin);
      if (isNaN(fechaFinDate.getTime())) {
        throw new BadRequestException('fechaFin inválida. Usar formato ISO (ej: 2025-09-10 o 2025-09-10T23:59:59Z).');
      }
    }

    if (fechaInicioDate && fechaFinDate && fechaInicioDate.getTime() > fechaFinDate.getTime()) {
      throw new BadRequestException('fechaInicio no puede ser posterior a fechaFin.');
    }

    return await this.imcService.obtenerHistorial(fechaInicioDate, fechaFinDate);
  }
}
