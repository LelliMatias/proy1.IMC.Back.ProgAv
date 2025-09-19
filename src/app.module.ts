import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImcModule } from './module/imc/imc.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImcResult } from './module/imc/imc.entity'; // tu entidad

@Module({
  imports: [
    // PRODUCCION (mantener comentado en dev)
    TypeOrmModule.forRoot({
      type: 'mysql',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false,
      retryAttempts: 10,
      retryDelay: 3000,
    }),

    // DESARROLLO
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: process.env.DB_HOST || 'localhost',
    //   port: Number(process.env.DB_PORT) || 3306,
    //   username: process.env.DB_USER || 'root',
    //   password: process.env.DB_PASS || 'root',
    //   database: process.env.DB_NAME || 'imcdb',
    //   entities: [ImcResult],
    //   synchronize: true, // solo en dev
    //   logging: true,
    // }),

    ImcModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
