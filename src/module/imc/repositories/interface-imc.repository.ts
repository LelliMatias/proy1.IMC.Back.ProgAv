// src/imc/repositories/imc-repository.interface.ts
import { ImcResult } from '../imc.schema';

export interface IImcRepository {
    create(payload: Partial<ImcResult>): ImcResult;
    save(entity: ImcResult): Promise<ImcResult>;
    findByDateRange(fechaInicio?: Date, fechaFin?: Date): Promise<ImcResult[]>;
    findAllOrderedDesc(): Promise<ImcResult[]>;
}
