import { Client } from '@lib/domain/entities/client';

export const CLIENT_FIXTURE_NO_ID = {
  address: '123 Main St',
  birthDate: new Date(),
  driverLicenseNumber: '123456789',
  email: 'client@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '123456789',
};

export const CLIENT_FIXTURE = new Client({
  ...CLIENT_FIXTURE_NO_ID,
  id: '123',
});
