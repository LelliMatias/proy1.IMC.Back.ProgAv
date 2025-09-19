import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImcModule } from '../src/module/imc/imc.module';
import { ImcResult } from '../src/module/imc/imc.entity';

describe('IMC E2E (con BD real en memoria)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    dropSchema: true,
                    entities: [ImcResult],
                    synchronize: true,
                }),
                ImcModule,
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('POST /imc debería guardar un cálculo en BD', async () => {
        const dto = { peso: 70, altura: 1.75 };

        const res = await request(app.getHttpServer())
            .post('/imc/calcular')
            .send(dto)
            .expect(201);


        expect(res.body).toHaveProperty('imc');
        expect(res.body).toHaveProperty('categoria');
    });

    it('GET /imc/historial debería devolver cálculos guardados', async () => {
        const res = await request(app.getHttpServer())
            .get('/imc/historial')
            .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('peso');
        expect(res.body[0]).toHaveProperty('altura');
        expect(res.body[0]).toHaveProperty('imc');
        expect(res.body[0]).toHaveProperty('categoria');
        expect(res.body[0]).toHaveProperty('createdAt');
    });
});
