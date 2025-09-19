import { Repository } from 'typeorm';
import { ImcResult } from '../imc.entity';
import { AppDataSource } from '../../../data-source';
import { IImcRepository } from './interface-imc.repository';

export class ImcRepository implements IImcRepository {
    private repo: Repository<ImcResult>;

    constructor() {
        // Asegurarse que AppDataSource está inicializado antes de usar
        if (!AppDataSource.isInitialized) {
            throw new Error('AppDataSource no inicializado. Llama a initializeDataSource() en bootstrap.');
        }
        this.repo = AppDataSource.getRepository(ImcResult);
    }

    async save(imc: Partial<ImcResult>): Promise<ImcResult> {
        const ent = this.repo.create(imc);
        return await this.repo.save(ent);
    }

    async findById(id: number): Promise<ImcResult | null> {
        return (await this.repo.findOne({ where: { id } })) ?? null;
    }

    async findAllBetweenDates(start?: Date, end?: Date): Promise<ImcResult[]> {
        const qb = this.repo.createQueryBuilder('r').orderBy('r.createdAt', 'DESC');

        if (start) qb.andWhere('r.createdAt >= :start', { start: start.toISOString() });
        if (end) qb.andWhere('r.createdAt <= :end', { end: end.toISOString() });

        return await qb.getMany();
    }

    async deleteById(id: number): Promise<void> {
        await this.repo.delete(id);
    }
}
