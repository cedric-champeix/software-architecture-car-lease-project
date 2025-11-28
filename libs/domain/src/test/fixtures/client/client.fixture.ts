import { Client } from 'src/entities/client';

export const CLIENT_FIXTURE_NO_ID = {
  email: 'client@example.com',
  phoneNumber: '123456789',
  firstName: 'John',
  lastName: 'Doe',
  address: '123 Main St',
  birthDate: new Date(),
  driverLicenseNumber: '123456789',
};

export const CLIENT_FIXTURE = new Client({
  ...CLIENT_FIXTURE_NO_ID,
  id: '123',
});
