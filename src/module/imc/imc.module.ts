import { Module } from '@nestjs/common';
import { ImcService } from './imc.service';
import { ImcController } from './imc.controller';
import { ImcRepository } from './repositories/imc.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ImcResult, ImcResultSchema } from './imc.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ImcResult.name, schema: ImcResultSchema }]),
  ],
  controllers: [ImcController],
  providers: [
    ImcService,
    { provide: 'IImcRepository', useClass: ImcRepository },
  ],
  exports: [ImcService],
})
export class ImcModule { }
