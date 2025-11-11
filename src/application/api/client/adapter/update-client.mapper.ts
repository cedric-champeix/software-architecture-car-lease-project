import { UpdateClientDto } from '../dto/update-client.dto';

export class UpdateClientDtoMapper {
  static toUseCaseInput(dto: UpdateClientDto) {
    return {
      firstName: dto.firstName,
      lastName: dto.lastName,
      birthDate: dto.birthDate,
      address: dto.address,
      driverLicenseNumber: dto.driverLicenseNumber,
    };
  }
}
