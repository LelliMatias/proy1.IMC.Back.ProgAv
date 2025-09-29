import { Test, TestingModule } from '@nestjs/testing';
import { ImcController } from './imc.controller';
import { ImcService } from './imc.service';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

describe('ImcController (refactor)', () => {
  let controller: ImcController;
  let serviceMock: {
    calcularImc: jest.Mock;
    obtenerHistorial: jest.Mock;
    obtenerEstadisticas: jest.Mock;
  };

  beforeEach(async () => {
    serviceMock = {
      calcularImc: jest.fn(),
      obtenerHistorial: jest.fn(),
      obtenerEstadisticas: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImcController],
      providers: [{ provide: ImcService, useValue: serviceMock }],
    }).compile();

    controller = module.get<ImcController>(ImcController);
    jest.clearAllMocks();
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calcular -> debe devolver IMC y categoria para input valido', async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 70 };
    const expected = { imc: 22.86, categoria: 'Normal' };
    serviceMock.calcularImc.mockResolvedValue(expected);

    const res = await controller.calcular(dto);

    expect(serviceMock.calcularImc).toHaveBeenCalledWith(dto);
    expect(res).toEqual(expected);
  });

  it('calcular -> si el service tira error, debe propagarse', async () => {
    serviceMock.calcularImc.mockImplementation(() => {
      throw new Error('DB error');
    });

    const dto: CalcularImcDto = { altura: 1.75, peso: 70 };

    await expect(controller.calcular(dto)).rejects.toThrow('DB error');
    expect(serviceMock.calcularImc).toHaveBeenCalledWith(dto);
  });

  it('calcular -> ValidationPipe rechaza DTO inválido (altura negativa)', async () => {
    const invalidDto: CalcularImcDto = { altura: -1, peso: 70 };
    const validationPipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true });

    await expect(
      validationPipe.transform(invalidDto, { type: 'body', metatype: CalcularImcDto }),
    ).rejects.toThrow(BadRequestException);

    // no se llamó al service porque la validación debería bloquear antes
    expect(serviceMock.calcularImc).not.toHaveBeenCalled();
  });

  it('testCreate -> debe llamar a service.calcularImc y envolver respuesta', async () => {
    const resultFromService = { imc: 22.86, categoria: 'Normal' };
    serviceMock.calcularImc.mockResolvedValue(resultFromService);

    const res = await controller.testCreate();

    expect(serviceMock.calcularImc).toHaveBeenCalledWith({ peso: 70, altura: 1.75 });
    expect(res).toEqual({ ok: true, data: resultFromService });
  });

  it('testList -> debe devolver ok, count y data', async () => {
    const data = [
      { peso: 70, altura: 1.75, imc: 22.86, createdAt: '2025-09-14T12:00:00Z' },
      { peso: 60, altura: 1.6, imc: 23.44, createdAt: '2025-09-13T12:00:00Z' },
    ];
    serviceMock.obtenerHistorial.mockResolvedValue(data);

    const res = await controller.testList();

    expect(serviceMock.obtenerHistorial).toHaveBeenCalled();
    expect(res).toEqual({ ok: true, count: data.length, data });
  });

  it('obtenerHistorial -> sin filtros debe llamar service.obtenerHistorial(undefined, undefined)', async () => {
    const mockHistorial = [{ imc: 22 }];
    serviceMock.obtenerHistorial.mockResolvedValue(mockHistorial);

    const res = await controller.obtenerHistorial({});

    expect(serviceMock.obtenerHistorial).toHaveBeenCalledWith(undefined, undefined);
    expect(res).toEqual(mockHistorial);
  });

  it('obtenerHistorial -> con filtros válidos debe parsear fechas y pasarlas al service', async () => {
    const mockHistorial: any[] = [];
    serviceMock.obtenerHistorial.mockResolvedValue(mockHistorial);

    const query = { fechaInicio: '2025-09-01', fechaFin: '2025-09-30' };
    await controller.obtenerHistorial(query);

    expect(serviceMock.obtenerHistorial).toHaveBeenCalledWith(
      new Date(query.fechaInicio),
      new Date(query.fechaFin),
    );
  });

  it('obtenerHistorial -> fechaInicio inválida debe lanzar BadRequestException', async () => {
    const badQuery = { fechaInicio: 'no-es-una-fecha' };

    await expect(controller.obtenerHistorial(badQuery)).rejects.toThrow(BadRequestException);
    expect(serviceMock.obtenerHistorial).not.toHaveBeenCalled();
  });

  it('obtenerHistorial -> fechaInicio posterior a fechaFin debe lanzar BadRequestException', async () => {
    const badQuery = { fechaInicio: '2025-10-01', fechaFin: '2025-09-01' };

    await expect(controller.obtenerHistorial(badQuery)).rejects.toThrow(BadRequestException);
    expect(serviceMock.obtenerHistorial).not.toHaveBeenCalled();
  });

  it('obtenerHistorial -> cuando el service devuelve [], debe retornar []', async () => {
    serviceMock.obtenerHistorial.mockResolvedValue([]);
    const res = await controller.obtenerHistorial({});
    expect(res).toEqual([]);
  });

  it('obtenerEstadisticas -> debe parsear filtros y llamar a service.obtenerEstadisticas', async () => {
    const agg = { total: 10, promedioImc: 24.12 };
    serviceMock.obtenerEstadisticas.mockResolvedValue(agg);

    const query = { fechaInicio: '2025-09-01', fechaFin: '2025-09-30' };
    const res = await controller.obtenerEstadisticas(query);

    expect(serviceMock.obtenerEstadisticas).toHaveBeenCalledWith(
      new Date(query.fechaInicio),
      new Date(query.fechaFin),
    );
    expect(res).toEqual(agg);
  });
});
