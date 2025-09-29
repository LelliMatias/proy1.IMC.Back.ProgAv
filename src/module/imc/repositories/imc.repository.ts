// src/imc/repositories/imc.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
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

    async aggregateStats(fechaInicio?: Date, fechaFin?: Date, userId?: string) {
        const match: any = {};
        if (fechaInicio || fechaFin) {
            match.createdAt = {};
            if (fechaInicio) match.createdAt.$gte = fechaInicio;
            if (fechaFin) match.createdAt.$lte = fechaFin;
        }
        if (userId) match.userId = userId;

        const pipeline: PipelineStage[] = [
            { $match: match },
            {
                $group: {
                    _id: null,
                    avgImc: { $avg: '$imc' },
                    avgPeso: { $avg: '$peso' },
                    avgImcSq: { $avg: { $multiply: ['$imc', '$imc'] } },
                    count: { $sum: 1 },
                    minImc: { $min: '$imc' },
                    maxImc: { $max: '$imc' },
                },
            },
        ];

        const res = await this.imcModel.aggregate(pipeline).exec();
        return res[0] ?? null;
    }

    async distribucionPorCategoria(fechaInicio?: Date, fechaFin?: Date, userId?: string) {
        const match: any = {};
        if (fechaInicio || fechaFin) {
            match.createdAt = {};
            if (fechaInicio) match.createdAt.$gte = fechaInicio;
            if (fechaFin) match.createdAt.$lte = fechaFin;
        }
        if (userId) match.userId = userId;

        const pipeline: PipelineStage[] = [
            { $match: match },
            {
                $group: {
                    _id: '$categoria',
                    cantidad: { $sum: 1 },
                },
            },
            { $project: { categoria: '$_id', cantidad: 1, _id: 0 } },
            { $sort: { cantidad: -1 } },
        ];

        return this.imcModel.aggregate(pipeline).exec();
    }
    async timeSeries(
        fechaInicio?: Date,
        fechaFin?: Date,
        userId?: string,
        periodo: 'day' | 'month' = 'day',
    ) {
        const match: any = {};
        if (fechaInicio || fechaFin) {
            match.createdAt = {};
            if (fechaInicio) match.createdAt.$gte = fechaInicio;
            if (fechaFin) match.createdAt.$lte = fechaFin;
        }
        if (userId) match.userId = userId;

        const dateFormat = periodo === 'month' ? '%Y-%m' : '%Y-%m-%d';

        const pipeline: PipelineStage[] = [
            { $match: match },
            {
                $group: {
                    _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
                    avgImc: { $avg: '$imc' },
                    avgPeso: { $avg: '$peso' },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    fecha: '$_id',
                    avgImc: { $round: ['$avgImc', 2] },
                    avgPeso: { $round: ['$avgPeso', 2] },
                    count: 1,
                    _id: 0,
                },
            },
            { $sort: { fecha: 1 } },
        ];

        return this.imcModel.aggregate(pipeline).exec();
    }

}