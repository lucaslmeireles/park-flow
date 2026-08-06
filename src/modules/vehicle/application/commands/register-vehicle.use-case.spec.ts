import {
  RegisterVehicleCommand,
  RegisterVehicleUseCase,
} from './register-vehicle.use-case';
import { VehicleCategory } from 'src/generated/prisma/enums';
import type { VehicleRepository } from '../../domain/repositories/vehicle.repository';

describe('RegisterVehicleUseCase', () => {
  let vehicleRepository: jest.Mocked<VehicleRepository>;
  let registerVehicleUseCase: RegisterVehicleUseCase;

  beforeEach(() => {
    vehicleRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn(),
      findByPlate: jest.fn(),
      findByOwnerId: jest.fn(),
      plateExists: jest.fn(),
      delete: jest.fn(),
    };

    registerVehicleUseCase = new RegisterVehicleUseCase(vehicleRepository);
  });

  it('creates a vehicle when the plate is valid and not already registered', async () => {
    vehicleRepository.plateExists.mockResolvedValue(false);

    const command = new RegisterVehicleCommand(
      'ABC-1234',
      VehicleCategory.CAR,
      'owner-1',
      'MyCar',
      'Toyota',
      'Corolla',
      'Blue',
    );

    const vehicleId = await registerVehicleUseCase.execute(command);

    expect(vehicleRepository.plateExists).toHaveBeenCalledWith('ABC-1234');
    expect(vehicleRepository.save).toHaveBeenCalled();
    expect(vehicleId).toHaveLength(36);
  });

  it('throws when the plate already exists', async () => {
    vehicleRepository.plateExists.mockResolvedValue(true);

    const command = new RegisterVehicleCommand(
      'ABC-1234',
      VehicleCategory.CAR,
      'owner-1',
    );

    await expect(registerVehicleUseCase.execute(command)).rejects.toThrow(
      'Vehicle with plate "ABC-1234" already exists',
    );
  });
});
