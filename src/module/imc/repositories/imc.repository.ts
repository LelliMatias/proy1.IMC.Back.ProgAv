// src/imc/repositories/imc.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImcResult } from '../imc.schema';
import { IImcRepository } from './interface-imc.repository';

@Injectable()
export class ImcRepository implements IImcRepository {
    constructor(
        @InjectModel(ImcResult.name) private readonly imcModel: Model<ImcResult>,
    ) { }

    create(payload: Partial<ImcResult>): ImcResult {
        return new this.imcModel(payload);
    }

    save(entity: ImcResult): Promise<ImcResult> {
        return entity.save();
    }

    async findAllOrderedDesc(): Promise<ImcResult[]> {
        return this.imcModel.find().sort({ createdAt: -1 }).exec();
    }

    async findByDateRange(fechaInicio?: Date, fechaFin?: Date): Promise<ImcResult[]> {
        const filter: any = {};

        if (fechaInicio && fechaFin) {
            filter.createdAt = { $gte: fechaInicio, $lte: fechaFin };
        } else if (fechaInicio) {
            filter.createdAt = { $gte: fechaInicio };
        } else if (fechaFin) {
            filter.createdAt = { $lte: fechaFin };
        }

        return this.imcModel.find(filter).sort({ createdAt: -1 }).exec();
    }

}
