import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImcModule } from './module/imc/imc.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImcResult } from './module/imc/imc.entity'; // tu entidad

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      url: process.env.DATABASE_URL, // Railway URL completa
      autoLoadEntities: true, // carga automáticamente las entidades
      synchronize: false,    // siempre false en producción
    }),
    ImcModule, // tu módulo feature
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
