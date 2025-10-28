import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateClientDto {
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  @IsNotEmpty({ message: 'First name should not be empty' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name should not be empty' })
  lastName: string;
}
