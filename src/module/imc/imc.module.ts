import { Module } from '@nestjs/common';
import { ImcService } from './imc.service';
import { ImcController } from './imc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImcResult } from './imc.entity';
import { ImcRepository } from './repositories/imc.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ImcResult])],
  controllers: [ImcController],
  providers: [
    ImcService,
    ImcRepository,
    {
      provide: 'IImcRepository',
      useClass: ImcRepository,
    },
  ],
  exports: [ImcService],
})
export class ImcModule { }
