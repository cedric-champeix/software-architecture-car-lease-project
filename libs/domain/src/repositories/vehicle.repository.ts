import type {
  CreateVehicle,
  UpdateVehicle,
  Vehicle,
} from 'src/entities/vehicle';

type FindVehicleByIdInput = { id: Vehicle['id'] };

type FindVehicleByLicensePlateInput = { licensePlate: Vehicle['licensePlate'] };

type FindAllVehicleInput = {};

type CreateVehicleInput = { vehicle: CreateVehicle };

type UpdateVehicleInput = { id: Vehicle['id']; vehicle: UpdateVehicle };

type DeleteVehicleInput = { id: Vehicle['id'] };

export abstract class VehicleRepository {
  abstract findById({ id }: FindVehicleByIdInput): Promise<Vehicle | null>;

  abstract findByLicensePlate({
    licensePlate,
  }: FindVehicleByLicensePlateInput): Promise<Vehicle | null>;

  abstract findAll({}: FindAllVehicleInput): Promise<Vehicle[]>;

  abstract create({ vehicle }: CreateVehicleInput): Promise<Vehicle>;

  abstract update({ id, vehicle }: UpdateVehicleInput): Promise<Vehicle>;

  abstract deleteById({ id }: DeleteVehicleInput): Promise<boolean>;
}
