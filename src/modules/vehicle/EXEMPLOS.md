/**
 * EXEMPLOS PRÁTICOS - Módulo Vehicle
 *
 * Aqui mostram exemplos de como usar o módulo Vehicle
 * Estes exemplos demonstram todos os conceitos implementados
 */

// ============================================
// EXEMPLO 1: Registrar um novo veículo
// ============================================

/**
 * Cliente faz requisição HTTP
 */
const request = {
  method: 'POST',
  path: '/vehicles',
  body: {
    plate: 'ABC-1234',
    category: 'PRIVATE',
    brand: 'Toyota',
    model: 'Corolla',
    color: 'Silver',
  },
};

/**
 * O que acontece internamente:
 */

// 1️⃣ VehicleController recebe e valida
class VehicleController {
  async register(request: RegisterVehicleRequest) {
    // RegisterVehicleRequest valida entrada HTTP
    // @IsString(), @IsEnum(), etc.
    // Se inválido, o NestJS retorna 400 Bad Request automaticamente

    // ✓ Entrada validada, creia um command
    const command = new RegisterVehicleCommand(
      request.plate, // 'ABC-1234'
      request.category, // 'PRIVATE'
      // ... mais campos
    );

    // Chama o use case
    const vehicleId = await registerVehicleUseCase.execute(command);

    // Retorna resposta
    return new RegisterVehicleResponse(vehicleId);
  }
}

// 2️⃣ RegisterVehicleUseCase orquestra
class RegisterVehicleUseCase {
  async execute(command: RegisterVehicleCommand): Promise<string> {
    // Cria o Value Object (aplica validações)
    const licensePlate = LicensePlate.create(command.plate);
    // Se 'ABC-1234' for inválido (ex: 'INVALID'), lança VehicleException

    // Valida regra de negócio BR-010: placa deve ser única
    const plateExists = await this.vehicleRepository.plateExists(
      licensePlate.toString(),
    );
    if (plateExists) {
      throw new VehiclePlateAlreadyExistsException(licensePlate.toString());
    }

    // Cria a entidade Vehicle
    const vehicleId = uuid(); // gera novo ID
    const vehicle = Vehicle.create(vehicleId, licensePlate, command.category, {
      brand: command.brand,
      model: command.model,
      color: command.color,
    });

    // Persiste através do repositório
    await this.vehicleRepository.save(vehicle);

    // Retorna o ID criado
    return vehicleId;
  }
}

// 3️⃣ Vehicle.create() garante regras de negócio
class Vehicle {
  static create(
    id: string,
    plate: LicensePlate,
    category: VehicleCategory,
    props?: Partial<VehicleProps>,
  ): Vehicle {
    // A placa já foi validada no Value Object
    // Aqui apenas criamos a entidade com segurança
    return new Vehicle(id, {
      plate,
      category,
      ...props,
    });
  }

  updateDetails(details: any): void {
    // A placa NÃO pode ser mudada (regra de negócio)
    if (details.brand) this.brand = details.brand;
    // Não temos setPlate() - é imutável!
  }
}

// 4️⃣ VehicleRepository (interface) é implementada por PrismaVehicleRepository
interface VehicleRepository {
  save(vehicle: Vehicle): Promise<void>;
  plateExists(plate: string): Promise<boolean>;
  // ... mais métodos
}

class PrismaVehicleRepository implements VehicleRepository {
  async save(vehicle: Vehicle): Promise<void> {
    // Extrai dados da entidade
    const props = vehicle.getProps();

    // Salva no banco de dados
    await this.prisma.vehicle.create({
      data: {
        id: vehicle.getId(),
        plate: props.plate.toString(),
        category: props.category,
        brand: props.brand,
        model: props.model,
        color: props.color,
      },
    });
  }

  async plateExists(plate: string): Promise<boolean> {
    const count = await this.prisma.vehicle.count({
      where: { plate, deleted_at: null },
    });
    return count > 0;
  }
}

// 5️⃣ Resposta retorna ao cliente
const response = {
  status: 201,
  body: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    message: 'Vehicle registered successfully with ID: 550e8400...',
  },
};

// ============================================
// EXEMPLO 2: Buscar um veículo
// ============================================

/**
 * Cliente faz requisição
 */
const getRequest = {
  method: 'GET',
  path: '/vehicles/550e8400-e29b-41d4-a716-446655440000',
};

/**
 * O que acontece:
 */

class VehicleController {
  async getById(id: string): Promise<VehicleResponse> {
    // 1. Chama o use case (query)
    const vehicle = await findVehicleByIdUseCase.execute(id);
    // Se não encontrar, lança VehicleNotFoundException

    // 2. Converte para DTO (Response)
    return VehicleResponse.fromEntity({
      id: vehicle.getId(),
      plate: vehicle.getPlate().toString(),
      category: vehicle.getCategory(),
      brand: vehicle.getBrand(),
      // ... dados
    });
  }
}

class FindVehicleByIdUseCase {
  async execute(vehicleId: string): Promise<Vehicle> {
    // 1. Busca no repositório
    const vehicle = await this.vehicleRepository.findById(vehicleId);

    // 2. Valida se existe
    if (!vehicle) {
      throw new VehicleNotFoundException(vehicleId);
    }

    // 3. Retorna o agregado completo
    return vehicle;
  }
}

class PrismaVehicleRepository {
  async findById(id: string): Promise<Vehicle | null> {
    // 1. Busca no banco
    const data = await this.prisma.vehicle.findUnique({ where: { id } });

    if (!data || data.deleted_at) {
      return null;
    }

    // 2. Converte para domínio
    return this.toDomain(data);
  }

  private toDomain(data: any): Vehicle {
    // Reconstrói a entidade a partir dos dados persistidos
    const licensePlate = LicensePlate.create(data.plate);

    return Vehicle.reconstruct(data.id, {
      plate: licensePlate,
      category: data.category,
      brand: data.brand,
      model: data.model,
      color: data.color,
    });
  }
}

// Resposta:
const getResponse = {
  status: 200,
  body: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    plate: 'ABC-1234',
    category: 'PRIVATE',
    brand: 'Toyota',
    model: 'Corolla',
    color: 'Silver',
    createdAt: '2026-07-01T10:00:00Z',
    updatedAt: '2026-07-01T10:00:00Z',
  },
};

// ============================================
// EXEMPLO 3: Erros de Negócio
// ============================================

// Cenário 1: Placa inválida
try {
  const plate = LicensePlate.create('INVALID_FORMAT');
  // ❌ Lança: VehicleException - Invalid license plate format
} catch (error) {
  console.log(error.message);
}

// Cenário 2: Placa duplicada
try {
  const command = new RegisterVehicleCommand('ABC-1234', 'PRIVATE');
  await registerVehicleUseCase.execute(command); // primeira vez OK
  await registerVehicleUseCase.execute(command); // segunda vez
  // ❌ Lança: VehiclePlateAlreadyExistsException
} catch (error) {
  console.log(error.message);
}

// Cenário 3: Veículo não encontrado
try {
  await findVehicleByIdUseCase.execute('nonexistent-id');
  // ❌ Lança: VehicleNotFoundException
} catch (error) {
  console.log(error.message);
}

// ============================================
// EXEMPLO 4: Testando o Use Case
// ============================================

describe('RegisterVehicleUseCase', () => {
  it('should register a new vehicle with valid data', async () => {
    // Arrange - preparar dados e mocks
    const mockRepository = {
      plateExists: jest.fn().mockResolvedValue(false),
      save: jest.fn().mockResolvedValue(void 0),
    };

    const useCase = new RegisterVehicleUseCase(mockRepository);
    const command = new RegisterVehicleCommand('ABC-1234', 'PRIVATE');

    // Act - executar
    const vehicleId = await useCase.execute(command);

    // Assert - verificar
    expect(vehicleId).toBeDefined();
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    expect(mockRepository.plateExists).toHaveBeenCalledWith('ABC-1234');
  });

  it('should throw error when plate already exists', async () => {
    // Arrange
    const mockRepository = {
      plateExists: jest.fn().mockResolvedValue(true), // Placa existe!
      save: jest.fn(),
    };

    const useCase = new RegisterVehicleUseCase(mockRepository);
    const command = new RegisterVehicleCommand('ABC-1234', 'PRIVATE');

    // Act & Assert
    await expect(useCase.execute(command)).rejects.toThrow(
      VehiclePlateAlreadyExistsException,
    );
  });

  it('should throw error when plate format is invalid', async () => {
    // Arrange
    const mockRepository = {
      plateExists: jest.fn().mockResolvedValue(false),
      save: jest.fn(),
    };

    const useCase = new RegisterVehicleUseCase(mockRepository);
    const command = new RegisterVehicleCommand('INVALID', 'PRIVATE'); // Formato inválido

    // Act & Assert
    await expect(useCase.execute(command)).rejects.toThrow(VehicleException);
  });
});

// ============================================
// CONCEITOS CHAVE RESUMIDOS
// ============================================

/*
CAMADA APRESENTAÇÃO (presentation/)
├─ Recebe requisições HTTP
├─ Valida entrada com DTOs
├─ Chama Use Cases
└─ Retorna respostas HTTP

CAMADA APLICAÇÃO (application/)
├─ Orquestra Use Cases (Commands & Queries)
├─ Abre transações
├─ Coordena o Repositório
└─ NÃO contém lógica de negócio

CAMADA DOMÍNIO (domain/)
├─ Entidades (Vehicle) - têm identidade
├─ Value Objects (LicensePlate) - identificados pelo valor
├─ Interfaces de Repositório - abstração
├─ Exceções de Negócio - erros esperados
└─ REGRAS DE NEGÓCIO AQUI! (BR-009, BR-010)

CAMADA INFRAESTRUTURA (infrastructure/)
├─ Implementa repositório com Prisma
├─ Converte entre Domínio ↔ Banco de Dados
└─ Detalhes técnicos (SQL, MongoDB, etc.)

*/
