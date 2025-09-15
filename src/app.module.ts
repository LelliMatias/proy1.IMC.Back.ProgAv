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
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false,
      retryAttempts: 10,
      retryDelay: 3000, // 3 segundos
    }),

    ImcModule, // tu módulo feature
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
