import { ImcResult } from '../src/module/imc/imc.entity';

process.env.DB_TYPE = 'sqlite';


export const typeOrmTestingConfig = {
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [ImcResult],
    synchronize: true,
};
