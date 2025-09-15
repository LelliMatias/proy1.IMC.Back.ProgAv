import { Test, TestingModule } from "@nestjs/testing";
import { ImcService } from "./imc.service";
import { CalcularImcDto } from "./dto/calcular-imc-dto";
import { ImcResult } from "./imc.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

describe('ImcService', () => {
  let service: ImcService;
  let repo: jest.Mocked<Repository<ImcResult>>;

  beforeEach(async () => {
    const repoMock: Partial<jest.Mocked<Repository<ImcResult>>> = {
      create: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImcService,
        { provide: getRepositoryToken(ImcResult), useValue: repoMock },
      ],
    }).compile();

    service = module.get<ImcService>(ImcService);
    repo = module.get(getRepositoryToken(ImcResult));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // -----------------------------
  // 🔹 Tests originales de cálculo
  // -----------------------------
  it('should calculate IMC correctly', async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 70 };
    const mockEntity = { ...dto, imc: 22.86, categoria: 'Normal' } as ImcResult;

    (repo.create as jest.Mock).mockReturnValue(mockEntity);
    (repo.save as jest.Mock).mockResolvedValue(mockEntity);

    const result = await service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(22.86, 2);
    expect(result.categoria).toBe('Normal');
  });

  it('should return Bajo peso for IMC < 18.5', async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 50 };
    const mockEntity = { ...dto, imc: 16.33, categoria: 'Bajo peso' } as ImcResult;

    (repo.create as jest.Mock).mockReturnValue(mockEntity);
    (repo.save as jest.Mock).mockResolvedValue(mockEntity);

    const result = await service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(16.33, 2);
    expect(result.categoria).toBe('Bajo peso');
  });

  it('should return Sobrepeso for 25 <= IMC < 30', async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 80 };
    const mockEntity = { ...dto, imc: 26.12, categoria: 'Sobrepeso' } as ImcResult;

    (repo.create as jest.Mock).mockReturnValue(mockEntity);
    (repo.save as jest.Mock).mockResolvedValue(mockEntity);

    const result = await service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(26.12, 2);
    expect(result.categoria).toBe('Sobrepeso');
  });

  it('should return Obeso for IMC >= 30', async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 100 };
    const mockEntity = { ...dto, imc: 32.65, categoria: 'Obeso' } as ImcResult;

    (repo.create as jest.Mock).mockReturnValue(mockEntity);
    (repo.save as jest.Mock).mockResolvedValue(mockEntity);

    const result = await service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(32.65, 2);
    expect(result.categoria).toBe('Obeso');
  });

  // -----------------------------
  // 🔹 Tests de historial
  // -----------------------------
  it('should call queryBuilder with no filters', async () => {
    const mockGetMany = jest.fn().mockResolvedValue([]);
    (repo.createQueryBuilder as jest.Mock).mockReturnValue({
      orderBy: jest.fn().mockReturnThis(),
      getMany: mockGetMany,
    } as any);

    const result = await service.obtenerHistorial();
    expect(result).toEqual([]);
    expect(mockGetMany).toHaveBeenCalled();
  });

  it('should apply start and end date filters', async () => {
    const mockWhere = jest.fn().mockReturnThis();
    const mockGetMany = jest.fn().mockResolvedValue([]);
    (repo.createQueryBuilder as jest.Mock).mockReturnValue({
      orderBy: jest.fn().mockReturnThis(),
      where: mockWhere,
      getMany: mockGetMany,
    } as any);

    const start = new Date('2025-09-01');
    const end = new Date('2025-09-30');
    await service.obtenerHistorial(start, end);

    expect(mockWhere).toHaveBeenCalledWith(
      'DATE(imc.createdAt) BETWEEN :start AND :end',
      expect.any(Object),
    );
    expect(mockGetMany).toHaveBeenCalled();
  });

  it('should apply only start date filter', async () => {
    const mockWhere = jest.fn().mockReturnThis();
    const mockGetMany = jest.fn().mockResolvedValue([]);
    (repo.createQueryBuilder as jest.Mock).mockReturnValue({
      orderBy: jest.fn().mockReturnThis(),
      where: mockWhere,
      getMany: mockGetMany,
    } as any);

    const start = new Date('2025-09-01');
    await service.obtenerHistorial(start);

    expect(mockWhere).toHaveBeenCalledWith('DATE(imc.createdAt) >= :start', { start: '2025-09-01' });
  });

  it('should apply only end date filter', async () => {
    const mockWhere = jest.fn().mockReturnThis();
    const mockGetMany = jest.fn().mockResolvedValue([]);
    (repo.createQueryBuilder as jest.Mock).mockReturnValue({
      orderBy: jest.fn().mockReturnThis(),
      where: mockWhere,
      getMany: mockGetMany,
    } as any);

    const end = new Date('2025-09-30');
    await service.obtenerHistorial(undefined, end);

    expect(mockWhere).toHaveBeenCalledWith('DATE(imc.createdAt) <= :end', { end: '2025-09-30' });
  });
});
