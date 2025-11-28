import type {
  CreateVehicle,
  UpdateVehicle,
  Vehicle,
} from '@lib/domain/entities/vehicle';

export type FindVehicleByIdInput = { id: Vehicle['id'] };

export type FindVehicleByLicensePlateInput = {
  licensePlate: Vehicle['licensePlate'];
};

export type FindAllVehicleInput = Record<string, never>;

export type CreateVehicleInput = { vehicle: CreateVehicle };

export type UpdateVehicleInput = { id: Vehicle['id']; vehicle: UpdateVehicle };

export type DeleteVehicleInput = { id: Vehicle['id'] };

export abstract class VehicleRepository {
  abstract findById({ id }: FindVehicleByIdInput): Promise<Vehicle | null>;

  abstract findByLicensePlate({
    licensePlate,
  }: FindVehicleByLicensePlateInput): Promise<Vehicle | null>;

  abstract findAll(input: FindAllVehicleInput): Promise<Vehicle[]>;

  abstract create({ vehicle }: CreateVehicleInput): Promise<Vehicle>;

  abstract update({ id, vehicle }: UpdateVehicleInput): Promise<Vehicle>;

  abstract deleteById({ id }: DeleteVehicleInput): Promise<boolean>;
}
