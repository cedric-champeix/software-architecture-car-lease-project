import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty({ message: 'First name should not be empty' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name should not be empty' })
  lastName: string;

  @IsDateString()
  birthDate: Date;

  @IsString()
  driverLicenseNumber: string;

  @IsString()
  address: string;

  @IsString()
  email: string;
}
