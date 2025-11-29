import type { CreateClientUseCaseInput } from '@lib/domain/use-cases/client/create-client';

import type { CreateClientDto } from '../dto/create-client.dto';

export class CreateClientDtoMapper {
  static toUseCaseInput(dto: CreateClientDto): CreateClientUseCaseInput {
    return {
      address: dto.address,
      birthDate: dto.birthDate,
      driverLicenseNumber: dto.driverLicenseNumber,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phoneNumber: dto.phoneNumber,
    };
  }
}
