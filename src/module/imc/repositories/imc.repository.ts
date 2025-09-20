// src/imc/imc.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImcResult } from '../imc.entity';
import { IImcRepository } from '../repositories/interface-imc.repository';

@Injectable()
export class ImcRepository implements IImcRepository {
    constructor(
        @InjectRepository(ImcResult)
        private readonly repo: Repository<ImcResult>,
    ) { }

    create(payload: Partial<ImcResult>): ImcResult {
        return this.repo.create(payload);
    }

    save(entity: ImcResult): Promise<ImcResult> {
        return this.repo.save(entity);
    }

    findAllOrderedDesc(): Promise<ImcResult[]> {
        return this.repo.createQueryBuilder('imc')
            .orderBy('imc.createdAt', 'DESC')
            .getMany();
    }

    async findByDateRange(fechaInicio?: Date, fechaFin?: Date): Promise<ImcResult[]> {
        const qb = this.repo.createQueryBuilder('imc')
            .orderBy('imc.createdAt', 'DESC');

        if (fechaInicio && fechaFin) {
            const startStr = fechaInicio.toISOString().split('T')[0];
            const endStr = fechaFin.toISOString().split('T')[0];
            qb.where('DATE(imc.createdAt) BETWEEN :start AND :end', { start: startStr, end: endStr });
        } else if (fechaInicio) {
            const startStr = fechaInicio.toISOString().split('T')[0];
            qb.where('DATE(imc.createdAt) >= :start', { start: startStr });
        } else if (fechaFin) {
            const endStr = fechaFin.toISOString().split('T')[0];
            qb.where('DATE(imc.createdAt) <= :end', { end: endStr });
        }

        return qb.getMany();
    }
}
