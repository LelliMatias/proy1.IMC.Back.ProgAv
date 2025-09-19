import { ImcResult } from '../imc.entity';

export interface IImcRepository {
    save(imc: Partial<ImcResult>): Promise<ImcResult>;
    findById(id: number): Promise<ImcResult | null>;
    findAllBetweenDates(start?: Date, end?: Date): Promise<ImcResult[]>;
    deleteById(id: number): Promise<void>;
}
