// src/imc/imc.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'imc_result', timestamps: { createdAt: true, updatedAt: false } })
export class ImcResult extends Document {
    @Prop({ type: Number, required: true })
    peso: number;

    @Prop({ type: Number, required: true })
    altura: number;

    @Prop({ type: Number, required: true })
    imc: number;

    @Prop({ type: String, required: true, maxlength: 32 })
    categoria: string;

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;
}

export const ImcResultSchema = SchemaFactory.createForClass(ImcResult);
