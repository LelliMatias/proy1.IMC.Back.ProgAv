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
}


// async obtenerEstadisticas() {
//   const total = await this.imcRepository.count();
//   const promedioImc = await this.imcRepository
//     .createQueryBuilder('imc')
//     .select('AVG(imc.imc)', 'promedio')
//     .getRawOne();

//   const categorias = await this.imcRepository
//     .createQueryBuilder('imc')
//     .select('imc.categoria', 'categoria')
//     .addSelect('COUNT(*)', 'cantidad')
//     .groupBy('imc.categoria')
//     .getRawMany();

//   return {
//     total,
//     promedioImc: Math.round(promedioImc.promedio * 100) / 100,
//     distribucionCategorias: categorias,
//   };
// }

