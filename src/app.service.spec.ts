import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    // devuelve el string esperado
    it('should return "Hello World!"', () => {
      const service =  new AppService();
      expect(service.getHello()).toBe('Hello World!');
    });
    // deberia devolver una string
    it('should return a string', () => {
        const service = new AppService();
        const result = service.getHello();
        expect(typeof result).toBe('string');
    });
    // getHello deberia devolver siempre el mismo valor
    it('should return the same value every time', () => {
        const service = new AppService();
        expect(service.getHello()).toBe('Hello World!');
        expect(service.getHello()).toBe('Hello World!');
    });
    // No manejamos errores por lo que no tiene sentido realizar un test cuando no puede lanzar un error
});
});