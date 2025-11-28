import type { UpdateClientDto } from '../dto/update-client.dto';

export class UpdateClientDtoMapper {
  static toUseCaseInput(dto: UpdateClientDto) {
    return {
      address: dto.address,
      birthDate: dto.birthDate,
      driverLicenseNumber: dto.driverLicenseNumber,
      firstName: dto.firstName,
      lastName: dto.lastName,
    };
  }
}
