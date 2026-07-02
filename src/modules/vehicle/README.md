# Exemplo - Módulo Vehicle

Este é um exemplo completo do módulo **Vehicle** seguindo a arquitetura DDD + Clean Architecture documentada.

## 📚 Estrutura do Módulo

```
vehicle/
├── application/
│   ├── commands/
│   │   └── register-vehicle.use-case.ts      [Criar um novo veículo]
│   └── queries/
│       └── find-vehicle-by-id.use-case.ts    [Buscar veículo por ID]
├── domain/
│   ├── entities/
│   │   └── vehicle.ts                        [Entidade Vehicle - regras de negócio]
│   ├── value-objects/
│   │   └── license-plate.ts                  [Value Object - Placa de veículo]
│   ├── repositories/
│   │   └── vehicle.repository.ts             [Interface do repositório]
│   └── exceptions/
│       └── vehicle.exception.ts              [Exceções de negócio]
├── infrastructure/
│   └── repositories/
│       └── prisma-vehicle.repository.ts      [Implementação com Prisma]
├── presentation/
│   └── controllers/
│       └── vehicle.controller.ts             [Endpoints HTTP]
├── dto/
│   ├── request/
│   │   └── register-vehicle.request.ts       [Contrato de entrada]
│   └── response/
│       └── vehicle.response.ts               [Contrato de saída]
└── vehicle.module.ts                         [Módulo NestJS que une tudo]
```

## 🔄 Fluxo de Dados

### Exemplo: Registrar um novo veículo

```
HTTP POST /vehicles
    ↓
VehicleController.register()
    ↓
RegisterVehicleRequest (validação com class-validator)
    ↓
RegisterVehicleUseCase (orquestração)
    ↓
LicensePlate.create() (validação com regra de negócio)
    ↓
Vehicle.create() (agregado root com lógica de domínio)
    ↓
VehicleRepository.save() (interface)
    ↓
PrismaVehicleRepository (implementação)
    ↓
Prisma Client → PostgreSQL
    ↓
HTTP Response 201 Created
```

## 🎯 Conceitos-Chave

### 1. **Entity** (Vehicle)
- Tem identidade única (ID)
- Contém lógica de negócio
- Agregado Root - coordena tudo relacionado a veículos
- Imutável através de getters
- Mudanças através de métodos que representam ações

```typescript
// Criar um veículo
const vehicle = Vehicle.create(id, licensePlate, category);

// Mudanças se fazem através de métodos
vehicle.updateDetails({ brand: 'Toyota' });
```

### 2. **Value Object** (LicensePlate)
- Identificado pelo valor, não por identidade
- Imutável
- Encapsula validações
- Exemplos: Dinheiro, Peso, Email, Localização Geográfica

```typescript
// LicensePlate valida e formata a placa
const plate = LicensePlate.create('ABC-1234'); // ✓ Válido
const plate = LicensePlate.create('INVALID');  // ✗ Lança exceção
```

### 3. **Repository** (Interface)
- Definido no domínio (não dependemos de Prisma)
- Implementado na infraestrutura
- Abstrai dados: traduz entre domínio e banco

```typescript
// Interface no domínio
export interface VehicleRepository {
  save(vehicle: Vehicle): Promise<void>;
  findById(id: string): Promise<Vehicle | null>;
}

// Implementação na infraestrutura
export class PrismaVehicleRepository implements VehicleRepository {
  // Usa Prisma, SQL, MongoDB, etc...
}
```

### 4. **Use Case** (Aplicação)
- Orquestra a lógica de negócio
- Abre transações
- Publica eventos (futuramente)
- NÃO contém lógica de negócio (isso é no domínio!)

```typescript
// Use Case orquestra
const vehicleId = await registerVehicleUseCase.execute(command);

// O que acontece dentro:
// 1. Valida entrada
// 2. Checa se placa existe (regra BR-010)
// 3. Cria Vehicle (domínio valida)
// 4. Salva através do repositório
// 5. Retorna ID
```

### 5. **DTO** (Transferência de Dados)
- Request: Valida entrada HTTP
- Response: Define contrato de saída
- Nunca use Entity como DTO!

```typescript
// Request DTO com validação
export class RegisterVehicleRequest {
  @IsString()
  plate: string;

  @IsEnum(VehicleCategory)
  category: VehicleCategory;
}

// Response DTO
export class VehicleResponse {
  id: string;
  plate: string;
  category: VehicleCategory;
  // Apenas o que a API deve expor
}
```

## 📐 Regras de Dependência

✓ **Permitido:**
```
Controller → Use Case → Repository (interface) → Domínio
```

✗ **Não permitido:**
```
Controller → Infraestrutura (Prisma direto)
Domain → NestJS
Domain → Prisma
```

O domínio é o coração - tudo depende dele, ele não depende de nada!

## 🧪 Testabilidade

Por causa dessa arquitetura, testar é fácil:

```typescript
describe('RegisterVehicleUseCase', () => {
  it('should register a new vehicle', async () => {
    // Mock do repositório (não precisa do banco)
    const mockRepository = {
      plateExists: jest.fn().mockResolvedValue(false),
      save: jest.fn(),
    };

    const useCase = new RegisterVehicleUseCase(mockRepository);
    const vehicleId = await useCase.execute(command);

    expect(mockRepository.save).toHaveBeenCalled();
    expect(vehicleId).toBeDefined();
  });
});
```

## 🚀 Próximos Passos

Para entender melhor:

1. **Copie este padrão** para os outros módulos (Parking, Ticket, Payment, etc)
2. **Adicione mais Use Cases** (UpdateVehicle, DeleteVehicle, etc)
3. **Implemente testes** unitários para cada camada
4. **Adicione Domain Events** quando precisar comunicação entre módulos
5. **Leia** a documentação em `docs/architecture/`

## 📖 Mapeamento com Documentação

- **folder-structure.md**: Veja como cada arquivo está organizado
- **coding-guidelines.md**: Convenções de nomenclatura
- **business-rules.md**: Regras que este módulo implementa (BR-009, BR-010)
- **architecture.md**: Princípios gerais (DDD, Clean Architecture)

---

**Dúvidas?** Compare cada arquivo deste exemplos com os outras módulos que você criar - o padrão deve ser consistente!
