// src/imc/imc.service.ts
// src/imc/imc.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { ImcResult } from './imc.schema';
import { IImcRepository } from './repositories/interface-imc.repository';

@Injectable()
export class ImcService {
  constructor(
    @Inject('IImcRepository')
    private readonly imcRepo: IImcRepository,
  ) { }

  async calcularImc(data: CalcularImcDto): Promise<{ imc: number; categoria: string }> {
    const { altura, peso } = data;
    const imc = peso / (altura * altura);
    const imcRedondeado = Math.round(imc * 100) / 100;

    let categoria: string;
    if (imc < 18.5) categoria = 'Bajo peso';
    else if (imc < 25) categoria = 'Normal';
    else if (imc < 30) categoria = 'Sobrepeso';
    else categoria = 'Obeso';

    const result = this.imcRepo.create({ peso, altura, imc: imcRedondeado, categoria });
    await this.imcRepo.save(result);

    return { imc: imcRedondeado, categoria };
  }

  async obtenerHistorial(fechaInicio?: Date, fechaFin?: Date): Promise<ImcResult[]> {
    if (fechaInicio || fechaFin) {
      return this.imcRepo.findByDateRange(fechaInicio, fechaFin);
    }
    return this.imcRepo.findAllOrderedDesc();
  }

  async obtenerEstadisticas(fechaInicio?: Date, fechaFin?: Date) {
    const agg = await this.imcRepo.aggregateStats(fechaInicio, fechaFin);
    const distribucion = await this.imcRepo.distribucionPorCategoria(fechaInicio, fechaFin);
    const series = await this.imcRepo.timeSeries(fechaInicio, fechaFin, undefined, 'day');

    if (!agg) {
      return {
        total: 0,
        promedioImc: null,
        varianzaImc: null,
        minImc: null,
        maxImc: null,
        distribucionCategorias: [],
        series,
      };
    }

    const avgImc: number | null = agg.avgImc ?? null;
    const avgImcSq: number | null = agg.avgImcSq ?? null;

    let varianzaImc: number | null = null;
    if (avgImc != null && avgImcSq != null) {
      varianzaImc = Math.round((avgImcSq - avgImc * avgImc) * 100) / 100;
    }

    return {
      total: agg.count ?? 0,
      promedioImc: avgImc != null ? Math.round(avgImc * 100) / 100 : null,
      varianzaImc,
      minImc: agg.minImc ?? null,
      maxImc: agg.maxImc ?? null,
      distribucionCategorias: distribucion,
      series,
    };
  }

}
