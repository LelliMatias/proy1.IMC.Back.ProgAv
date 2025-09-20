// src/imc/imc-repository.interface.ts
import { ImcResult } from '../imc.entity';

export interface IImcRepository {
    create(payload: Partial<ImcResult>): ImcResult;
    save(entity: ImcResult): Promise<ImcResult>;
    findByDateRange(fechaInicio?: Date, fechaFin?: Date): Promise<ImcResult[]>;
    findAllOrderedDesc(): Promise<ImcResult[]>;
}
