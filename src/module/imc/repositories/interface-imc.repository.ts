// src/imc/repositories/imc-repository.interface.ts
import { ImcResult } from '../imc.schema';

export interface IImcRepository {
    create(payload: Partial<ImcResult>): ImcResult;
    save(entity: ImcResult): Promise<ImcResult>;
    findByDateRange(fechaInicio?: Date, fechaFin?: Date): Promise<ImcResult[]>;
    findAllOrderedDesc(): Promise<ImcResult[]>;
    aggregateStats(fechaInicio?: Date, fechaFin?: Date, userId?: string): Promise<any>;
    distribucionPorCategoria(fechaInicio?: Date, fechaFin?: Date, userId?: string): Promise<any[]>;
    timeSeries(fechaInicio?: Date, fechaFin?: Date, userId?: string, periodo?: 'day' | 'month'): Promise<any[]>;

}
