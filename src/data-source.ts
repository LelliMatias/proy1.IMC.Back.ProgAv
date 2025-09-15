import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
console.log('Connecting to:', process.env.DATABASE_URL);
export const AppDataSource = new DataSource({
    type: 'mysql',
    url: process.env.DATABASE_URL,
    entities: ['src/module/**/*.entity.{ts,js}'], // carga todas las entidades automáticamente
    migrations: ['src/migrations/*.{ts,js}'],
    synchronize: false,
});
