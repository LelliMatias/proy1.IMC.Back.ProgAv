import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController; // Instancia de controlador
  let appService: AppService; // Instancia de servicio

  const mockAppService = {
    getHello: jest.fn().mockReturnValue('Hello World!'),
  };
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService, // El mock reemplaza el service real
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    // se verifia que el controlador devuelva la string del servicio (Hello World!)
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
      expect(appService.getHello()).toBe('Hello World!');
    });
    // se verifica que el controlador llama al metodo del servicio
    it('should call AppService.getHello', () => {
      appController.getHello();
      expect(mockAppService.getHello).toHaveBeenCalled();
    });
    // service devuelve otra string
    it('should return the value provided by the service', () => {   
      (appService.getHello as jest.Mock).mockReturnValue('Devuelve el valor del servicio');
      expect(appController.getHello()).toBe('Devuelve el valor del servicio');
    });
    // service lanza un error
    it('should throw an error if the service throws an error', () => {
      (appService.getHello as jest.Mock).mockImplementation(() => {
        throw new Error('Error del servicio');
      });
      expect(() => appController.getHello()).toThrow('Error del servicio');
    });
    it('should return correct values of multiple calls', () => {
      (appService.getHello as jest.Mock)
      .mockReturnValueOnce('Hola 1')  //  Utilizo mockReturnValueOnce para que el mock devuelva un valor una vez DADO QUE SINO LO PISA CON EL SIGUIENTE VALOR
      .mockReturnValueOnce('Hola 2');

      expect(appController.getHello()).toBe('Hola 1');
      expect(appController.getHello()).toBe('Hola 2');
    });
  });
});