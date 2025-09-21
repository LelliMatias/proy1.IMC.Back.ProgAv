import { DataSource } from 'typeorm';
import { ImcResult } from './src/module/imc/imc.entity'; // ajusta la ruta

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'imcdbpostgres',
  entities: [ImcResult],
  migrations: ['src/migrations/*.ts'],
});
