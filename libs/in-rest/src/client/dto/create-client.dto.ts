import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

// TODO: A client must be unique by its firstName, lastName and birthdate
// TODO: driverLicenseNumber should be unique
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
  email: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  address: string;
}
