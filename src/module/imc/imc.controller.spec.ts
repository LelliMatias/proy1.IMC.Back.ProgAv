import { Test, TestingModule } from '@nestjs/testing';
import { ImcController } from './imc.controller';
import { ImcService } from './imc.service';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

describe('ImcController', () => {
  let controller: ImcController;
  let service: ImcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImcController],
      providers: [
        {
          provide: ImcService,
          useValue: {
            calcularImc: jest.fn(),
            obtenerHistorial: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ImcController>(ImcController);
    service = module.get<ImcService>(ImcService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return IMC and category for valid input', async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 70 };
    jest.spyOn(service, 'calcularImc').mockResolvedValue({ imc: 22.86, categoria: 'Normal' });

    const result = await controller.calcular(dto);
    expect(result).toEqual({ imc: 22.86, categoria: 'Normal' });
    expect(service.calcularImc).toHaveBeenCalledWith(dto);
  });

  it('should throw BadRequestException for invalid input', async () => {
    const invalidDto: CalcularImcDto = { altura: -1, peso: 70 };

    const validationPipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true });

    await expect(
      validationPipe.transform(invalidDto, { type: 'body', metatype: CalcularImcDto }),
    ).rejects.toThrow(BadRequestException);

    expect(service.calcularImc).not.toHaveBeenCalled();
  });

  it('should return historial ordered by date', async () => {
    const mockHistorial = [
      { id: 2, peso: 80, altura: 1.8, imc: 24.69, categoria: 'Normal', createdAt: '2025-09-14T12:00:00Z' },
      { id: 1, peso: 60, altura: 1.6, imc: 23.44, categoria: 'Normal', createdAt: '2025-09-13T12:00:00Z' },
    ];
    (service.obtenerHistorial as jest.Mock).mockResolvedValue(mockHistorial);

    const result = await controller.obtenerHistorial({});
    expect(service.obtenerHistorial).toHaveBeenCalled();
    expect(result).toEqual(mockHistorial);
    expect(new Date(result[0].createdAt).getTime()).toBeGreaterThan(
      new Date(result[1].createdAt).getTime(),
    );
  });

  it('should pass date filters to service when provided', async () => {
    const mockHistorial = [];
    (service.obtenerHistorial as jest.Mock).mockResolvedValue(mockHistorial);

    const query = { fechaInicio: '2025-09-01', fechaFin: '2025-09-30' };
    await controller.obtenerHistorial(query);

    expect(service.obtenerHistorial).toHaveBeenCalledWith(
      new Date(query.fechaInicio),
      new Date(query.fechaFin),
    );
  });

  // 🔹 Nuevo test: historial vacío
  it('should return empty array when no historial found', async () => {
    (service.obtenerHistorial as jest.Mock).mockResolvedValue([]);

    const result = await controller.obtenerHistorial({});
    expect(result).toEqual([]);
  });

  // 🔹 Nuevo test: service error propagates
  it('should throw if service throws an error', async () => {
    (service.calcularImc as jest.Mock).mockImplementation(() => {
      throw new Error('DB error');
    });

    const dto: CalcularImcDto = { altura: 1.75, peso: 70 };

    await expect(controller.calcular(dto)).rejects.toThrow('DB error');
  });
});
