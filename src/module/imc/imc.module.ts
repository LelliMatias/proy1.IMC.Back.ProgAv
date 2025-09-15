import { Module } from '@nestjs/common';
import { ImcService } from './imc.service';
import { ImcController } from './imc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImcResult } from './imc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ImcResult])], // solo las entidades del módulo
  controllers: [ImcController],
  providers: [ImcService],
})
export class ImcModule { }
