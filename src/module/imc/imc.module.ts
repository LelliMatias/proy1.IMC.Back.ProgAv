import { Module } from '@nestjs/common';
import { ImcService } from './imc.service';
import { ImcController } from './imc.controller';
import { TypeOrmModule } from '@nestjs/typeorm'
import { ImcResult } from './imc.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'imcdb',
      entities: [ImcResult],
      logging: false,
      synchronize: true
    }),
    TypeOrmModule.forFeature([ImcResult]),
  ],
  controllers: [ImcController],
  providers: [ImcService],
  exports: [ImcModule]
})
export class ImcModule { }
