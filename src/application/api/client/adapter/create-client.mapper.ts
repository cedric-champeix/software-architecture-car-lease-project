import type { CreateClientDto } from 'src/application/api/client/dto/create-client.dto';
import type { CreateClientUseCaseInput } from 'src/domain/use-cases/client/create-client.use-case';

export class CreateClientDtoMapper {
  static toUseCaseInput(dto: CreateClientDto): CreateClientUseCaseInput {
    return {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      birthDate: dto.birthDate,
      driverLicenseNumber: dto.driverLicenseNumber,
      address: dto.address,
    };
  }
}
