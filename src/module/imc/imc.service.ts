import { Injectable } from "@nestjs/common";
import { CalcularImcDto } from "./dto/calcular-imc-dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ImcResult } from "./imc.entity";
import { Repository } from "typeorm";

export interface ImcResponse {
  imc: number;
  categoria: string;
  peso: number;
  altura: number;
  fechaHora: Date;
}
@Injectable()
export class ImcService {
  constructor(
    @InjectRepository(ImcResult)
    private imcRepository: Repository<ImcResult>
  ) { }

  async calcularImc(data: CalcularImcDto): Promise<{ imc: number; categoria: string; }> {
    const { altura, peso } = data;
    const imc = peso / (altura * altura);
    const imcRedondeado = Math.round(imc * 100) / 100; // Dos decimales

    let categoria: string;
    if (imc < 18.5) {
      categoria = 'Bajo peso';
    } else if (imc < 25) {
      categoria = 'Normal';
    } else if (imc < 30) {
      categoria = 'Sobrepeso';
    } else {
      categoria = 'Obeso';
    }

    const result = this.imcRepository.create({
      peso,
      altura,
      imc: imcRedondeado,
      categoria
    });
    const saveResult = await this.imcRepository.save(result);

    return { imc: imcRedondeado, categoria };
  }

  async obtenerHistorial(
    fechaInicio?: Date,
    fechaFin?: Date,
  ): Promise<ImcResult[]> {
    const queryBuilder = this.imcRepository.createQueryBuilder('imc')
      // ordenar por la propiedad existente en la entidad (según tu log: createdAt)
      .orderBy('imc.createdAt', 'DESC');

    // Filtros posibles: ambos, sólo inicio, sólo fin
    if (fechaInicio && fechaFin) {
      queryBuilder.where('imc.createdAt BETWEEN :start AND :end', {
        start: fechaInicio,
        end: fechaFin,
      });
    } else if (fechaInicio) {
      queryBuilder.where('imc.createdAt >= :start', { start: fechaInicio });
    } else if (fechaFin) {
      queryBuilder.where('imc.createdAt <= :end', { end: fechaFin });
    }

    return await queryBuilder.getMany();
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
}

