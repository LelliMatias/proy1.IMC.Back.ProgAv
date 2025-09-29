import { Test, TestingModule } from "@nestjs/testing";
import { ImcService } from "./imc.service";

/**
 * Nota: definido localmente para evitar problemas de paths en tests.
 * Si en tu proyecto ya existe el DTO real, podés importar en vez de definirlo.
 */
type CalcularImcDto = { altura: number; peso: number };

describe("ImcService (mocks para Mongo)", () => {
  let service: ImcService;

  // Mock del repositorio que debería coincidir con los métodos que usa ImcService
  const repoMock = {
    create: jest.fn(),
    save: jest.fn(),
    findByDateRange: jest.fn(),
    findAllOrderedDesc: jest.fn(),
    aggregateStats: jest.fn(),
    distribucionPorCategoria: jest.fn(),
    timeSeries: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImcService,
        // Asegurate de que este token coincida con el que usás en tu servicio.
        // Si usás un Symbol o nombre distinto en @Inject(...), reemplazar por ese valor.
        { provide: "IImcRepository", useValue: repoMock },
      ],
    }).compile();

    service = module.get<ImcService>(ImcService);
    jest.clearAllMocks();
  });

  it("service should be defined", () => {
    expect(service).toBeDefined();
  });

  it("calcularImc -> Normal", async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 70 };
    const mockEntity = { ...dto, imc: 22.86, categoria: "Normal" };

    repoMock.create.mockReturnValue(mockEntity);
    repoMock.save.mockResolvedValue(mockEntity);

    const res = await service.calcularImc(dto);

    expect(res.imc).toBeCloseTo(22.86, 2);
    expect(res.categoria).toBe("Normal");
    expect(repoMock.create).toHaveBeenCalled();
    expect(repoMock.save).toHaveBeenCalledWith(mockEntity);
  });

  it("calcularImc -> Bajo peso", async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 50 };
    const mockEntity = { ...dto, imc: 16.33, categoria: "Bajo peso" };

    repoMock.create.mockReturnValue(mockEntity);
    repoMock.save.mockResolvedValue(mockEntity);

    const res = await service.calcularImc(dto);
    expect(res.categoria).toBe("Bajo peso");
  });

  it("calcularImc -> Sobrepeso", async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 80 };
    const mockEntity = { ...dto, imc: 26.12, categoria: "Sobrepeso" };

    repoMock.create.mockReturnValue(mockEntity);
    repoMock.save.mockResolvedValue(mockEntity);

    const res = await service.calcularImc(dto);
    expect(res.categoria).toBe("Sobrepeso");
  });

  it("calcularImc -> Obeso", async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 100 };
    const mockEntity = { ...dto, imc: 32.65, categoria: "Obeso" };

    repoMock.create.mockReturnValue(mockEntity);
    repoMock.save.mockResolvedValue(mockEntity);

    const res = await service.calcularImc(dto);
    expect(res.categoria).toBe("Obeso");
  });

  it("obtenerHistorial -> con rango de fechas usa findByDateRange", async () => {
    const desde = new Date("2025-09-01");
    const hasta = new Date("2025-09-30");

    repoMock.findByDateRange.mockResolvedValue([]);
    await service.obtenerHistorial(desde, hasta);

    expect(repoMock.findByDateRange).toHaveBeenCalledWith(desde, hasta);
  });

  it("obtenerHistorial -> sin fechas usa findAllOrderedDesc", async () => {
    repoMock.findAllOrderedDesc.mockResolvedValue([]);
    await service.obtenerHistorial();
    expect(repoMock.findAllOrderedDesc).toHaveBeenCalled();
  });

  it("obtenerEstadisticas -> debe combinar agregados, distribucion y serie", async () => {
    const agg = {
      count: 10,
      avgImc: 24.1234,
      minImc: 16.33,
      maxImc: 32.65,
    };
    const distrib = [
      { categoria: "Normal", cantidad: 6 },
      { categoria: "Sobrepeso", cantidad: 2 },
      { categoria: "Obeso", cantidad: 2 },
    ];
    const series = [
      { fecha: "2025-09-01", avgImc: 23.5, avgPeso: 70, count: 2 },
      { fecha: "2025-09-02", avgImc: 25.1, avgPeso: 72, count: 3 },
    ];

    repoMock.aggregateStats.mockResolvedValue(agg);
    repoMock.distribucionPorCategoria.mockResolvedValue(distrib);
    repoMock.timeSeries.mockResolvedValue(series);

    const res = await service.obtenerEstadisticas();

    expect(repoMock.aggregateStats).toHaveBeenCalled();
    expect(repoMock.distribucionPorCategoria).toHaveBeenCalled();
    expect(repoMock.timeSeries).toHaveBeenCalled();

    expect(res.total).toBe(10);
    expect(res.promedioImc).toBeCloseTo(24.12, 2);
    expect(res.minImc).toBe(16.33);
    expect(res.maxImc).toBe(32.65);
    expect(Array.isArray(res.distribucionCategorias)).toBe(true);
    expect(Array.isArray(res.series)).toBe(true);
  });
});
