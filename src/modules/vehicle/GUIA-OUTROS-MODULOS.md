# 🎓 Guia: Como Usar Este Exemplo para Criar Outros Módulos

Você tem o módulo **Vehicle** como referência. Aqui está um guia passo-a-passo para criar os outros módulos.

## 📋 Módulos para Criar

- [ ] Identity (autenticação de usuários)
- [ ] Organization (gerenciamento de organizações)
- [ ] Parking (zonas e vagas de estacionamento)
- [ ] Pricing (regras e períodos de preço)
- [ ] Ticket (sessões de estacionamento)
- [ ] Payment (pagamentos)
- [ ] Wallet (carteira digital)

## 🔧 Passo-a-Passo para Um Novo Módulo

### Passo 1: Entender o Domínio

Antes de codificar, estude:
- O que é o agregado principal? (ex: `Vehicle`, `Ticket`, `Payment`)
- Que value objects ele tem? (ex: `LicensePlate`)
- Que regras de negócio (BR) aplicam?
- Que exceções podem acontecer?

**Para Parking:**
```
Agregado: ParkingZone
Value Objects: GeoLocation, Geometry, Capacity
Regras: BR-001 até BR-008 (veja docs/domain/business-rules.md)
Exceções: ParkingZoneNotFound, InvalidGeometry
```

### Passo 2: Criar a Estrutura de Pastas

Use a estrutura do Vehicle como template. Todas as pastas já foram criadas!

```
src/modules/[nome-modulo]/
├── application/      ← Use Cases
├── domain/           ← Business Logic
├── infrastructure/   ← Database
├── presentation/     ← HTTP
├── dto/              ← Contratos HTTP
└── [nome].module.ts ← Módulo NestJS
```

### Passo 3: Implementar em Ordem

**3.1 Domain (sempre primeiro!)**

```typescript
// 1. Crie Value Objects (se houver)
src/modules/[nome]/domain/value-objects/seu-vo.ts

// 2. Crie Exceções
src/modules/[nome]/domain/exceptions/seu.exception.ts

// 3. Crie a Entidade (Agregado Root)
src/modules/[nome]/domain/entities/seu-agregado.ts

// 4. Crie a Interface do Repositório
src/modules/[nome]/domain/repositories/seu.repository.ts
```

**Exemplo para Parking (ParkingZone):**

```typescript
// Value Object para localização geográfica
export class GeoLocation extends ValueObject<any> {
  static create(lat: number, lng: number): GeoLocation {
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw new Error('Invalid coordinates');
    }
    return new GeoLocation({ lat, lng });
  }
}

// Entidade
export class ParkingZone extends Entity<ParkingZoneProps> {
  static create(
    id: string,
    organizationId: string,
    displayName: string,
    geometry: GeoLocation,
  ): ParkingZone {
    // Regra BR-001: deve pertencer a uma organização
    // Regra BR-004: capacidade derivada de spots
    return new ParkingZone(id, { organizationId, displayName, geometry });
  }
}

// Interface
export interface ParkingZoneRepository {
  save(zone: ParkingZone): Promise<void>;
  findById(id: string): Promise<ParkingZone | null>;
  findByOrganizationId(orgId: string): Promise<ParkingZone[]>;
}
```

**3.2 Application (Use Cases)**

```typescript
// Commands (modificam estado)
src/modules/[nome]/application/commands/criar-[nome].use-case.ts
src/modules/[nome]/application/commands/atualizar-[nome].use-case.ts
src/modules/[nome]/application/commands/deletar-[nome].use-case.ts

// Queries (só leem)
src/modules/[nome]/application/queries/buscar-[nome]-por-id.use-case.ts
src/modules/[nome]/application/queries/listar-[nome].use-case.ts
```

**Estrutura básica:**

```typescript
@Injectable()
export class CreateParkingZoneCommand {
  constructor(
    readonly organizationId: string,
    readonly displayName: string,
    readonly geometry: any,
  ) {}
}

@Injectable()
export class CreateParkingZoneUseCase {
  constructor(private repository: ParkingZoneRepository) {}

  async execute(command: CreateParkingZoneCommand): Promise<string> {
    // 1. Validar entrada
    // 2. Aplicar regras de negócio
    // 3. Criar entidade
    // 4. Persistir
    // 5. Retornar ID

    const zone = ParkingZone.create(uuid(), ...);
    await this.repository.save(zone);
    return zone.getId();
  }
}
```

**3.3 Infrastructure**

```typescript
// Implementar o repositório com Prisma
src/modules/[nome]/infrastructure/repositories/prisma-[nome].repository.ts
```

**Template:**

```typescript
@Injectable()
export class PrismaParkingZoneRepository implements ParkingZoneRepository {
  constructor(private prisma: PrismaClient) {}

  async save(zone: ParkingZone): Promise<void> {
    const props = zone.getProps();
    
    await this.prisma.parkingZone.upsert({
      where: { id: zone.getId() },
      create: { /* mapear props para schema */ },
      update: { /* mapear props para schema */ },
    });
  }

  async findById(id: string): Promise<ParkingZone | null> {
    const data = await this.prisma.parkingZone.findUnique({ where: { id } });
    if (!data) return null;
    return this.toDomain(data);
  }

  private toDomain(data: any): ParkingZone {
    // Converter dados do banco para entidade
    return ParkingZone.reconstruct(data.id, {
      organizationId: data.organization_id,
      displayName: data.display_name,
      // ...
    });
  }
}
```

**3.4 DTOs**

```typescript
// Request - valida entrada HTTP
export class CreateParkingZoneRequest {
  @IsString()
  displayName: string;

  @IsString()
  displayAddress: string;

  @IsObject()
  geometry: any;
}

// Response - contrato de saída
export class ParkingZoneResponse {
  id: string;
  displayName: string;
  displayAddress: string;
  // Apenas o que a API deve expor
}
```

**3.5 Presentation (Controller)**

```typescript
@Controller('parking-zones')
export class ParkingZoneController {
  constructor(
    private createUseCase: CreateParkingZoneUseCase,
    private findByIdUseCase: FindParkingZoneByIdUseCase,
  ) {}

  @Post()
  async create(
    @Body() request: CreateParkingZoneRequest,
  ): Promise<CreateParkingZoneResponse> {
    const command = new CreateParkingZoneCommand(
      request.organizationId,
      request.displayName,
      request.geometry,
    );

    const id = await this.createUseCase.execute(command);
    return new CreateParkingZoneResponse(id);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<ParkingZoneResponse> {
    const zone = await this.findByIdUseCase.execute(id);
    return ParkingZoneResponse.from(zone);
  }
}
```

**3.6 Module**

```typescript
@Module({
  controllers: [ParkingZoneController],
  providers: [
    // Use Cases
    CreateParkingZoneUseCase,
    FindParkingZoneByIdUseCase,

    // Repository Implementation
    {
      provide: ParkingZoneRepository,
      useClass: PrismaParkingZoneRepository,
    },

    // Infrastructure
    PrismaClient,
  ],
  exports: [ParkingZoneRepository],
})
export class ParkingModule {}
```

### Passo 4: Integrar no App Module

```typescript
// src/app.module.ts

@Module({
  imports: [
    VehicleModule,      // ✓ Já implementado
    ParkingModule,      // + Novo
    PricingModule,      // + Novo
    TicketModule,       // + Novo
    PaymentModule,      // + Novo
    // etc...
  ],
})
export class AppModule {}
```

## ✅ Checklist por Módulo

Para cada novo módulo, certifique-se:

- [ ] ✓ Domain layer implementada (entities, value-objects, repository interface)
- [ ] ✓ Exceções de negócio definidas
- [ ] ✓ Use Cases criados (commands + queries)
- [ ] ✓ Repository implementado com Prisma
- [ ] ✓ DTOs criados (request + response)
- [ ] ✓ Controller implementado
- [ ] ✓ Module criado com providers
- [ ] ✓ Testes para domain e use cases
- [ ] ✓ README documentando o módulo

## 📚 Referências Rápidas

Quando criar um novo módulo, sempre consulte:

| Documento | Para Entender |
|-----------|---------------|
| `docs/domain/business-rules.md` | Que regras meu módulo deve implementar? |
| `docs/domain/domain-events.md` | Que eventos meu módulo publica? |
| `docs/domain/aggregates.md` | Qual é meu agregado root? |
| `docs/architecture/modules.md` | Dependências entre módulos |
| `docs/database/schema.dbml` | Como meus dados são persistidos? |
| `src/modules/vehicle/*` | Exemplo de estrutura |

## 💡 Dicas Importantes

1. **Comece pelo Domínio**: Sempre implemente a lógica de negócio PRIMEIRO
2. **Uma Entidade por Módulo**: Cada módulo tem UM agregado root (nem mais)
3. **Value Objects**: Use para conceitos imutáveis (Money, GeoLocation, Email)
4. **Erros de Negócio**: Crie exceções específicas para cada erro esperado
5. **Testes**: Teste a lógica de domínio independentemente do banco
6. **Interfaces**: Use interfaces para abstração (especialmente repositórios)

## 🚨 Erros Comuns

❌ **NÃO faça isso:**

```typescript
// Lógica de negócio no Use Case
class CreateVehicleUseCase {
  async execute(cmd) {
    if (cmd.plate.length !== 8) { // ← Regra de negócio NO USE CASE
      throw new Error('Invalid plate');
    }
  }
}

// Banco de dados no Domain
export class Vehicle {
  async save() { // ← Domínio não fala com banco
    await prisma.vehicle.create(...);
  }
}

// Dependência reversa
export class Vehicle {
  constructor(private prisma: PrismaClient) {} // ← Domínio não depende de NestJS/Prisma
}
```

✓ **Faça assim:**

```typescript
// Regra de negócio NO Value Object
export class LicensePlate extends ValueObject {
  static create(plate: string): LicensePlate {
    if (!/^[A-Z]{3}-\d{4}$/.test(plate)) { // ← Validação no VO
      throw new Error('Invalid plate');
    }
    return new LicensePlate(plate);
  }
}

// Use Case apenas orquestra
@Injectable()
export class RegisterVehicleUseCase {
  async execute(cmd): Promise<string> {
    const plate = LicensePlate.create(cmd.plate); // ← Delega ao VO
    const vehicle = Vehicle.create(...);
    await this.repository.save(vehicle);
    return vehicle.getId();
  }
}

// Repositório implementa abstração
@Injectable()
export class PrismaVehicleRepository implements VehicleRepository {
  async save(vehicle: Vehicle): Promise<void> {
    // ← Infraestrutura implementa a interface
  }
}
```

---

**Agora você tem um template! Comece com o module Parking ou Identity. Siga a ordem do Vehicle e você terá uma arquitetura consistente e profissional.** 🚀
