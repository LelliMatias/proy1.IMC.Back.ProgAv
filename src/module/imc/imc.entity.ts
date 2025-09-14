import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('imc_result')
export class ImcResult {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    peso: number;

    @Column({ type: 'decimal', precision: 4, scale: 2 })
    altura: number;

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    imc: number;

    @Column({ type: 'varchar', length: 32 })
    categoria: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}