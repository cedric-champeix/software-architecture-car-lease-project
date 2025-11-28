import { CreateClient } from '@lib/domain/entities/client';
import { Client } from '@lib/domain/entities/client/client.entity';
import type { ClientRepository } from '@lib/domain/repositories/client.repository';
import {
  CLIENT_FIXTURE,
  CLIENT_FIXTURE_NO_ID,
} from '@lib/domain/test/fixtures/client/client.fixture';

import type { CreateClientUseCaseInput } from '.';
import { CreateClientUseCaseValidator } from './create-client.use-case.validator';

describe('CreateClientUseCaseValidator', () => {
  let createClientUseCase: CreateClientUseCaseValidator;
  let clientRepository: ClientRepository;

  beforeEach(() => {
    clientRepository = {
      create: jest.fn(),
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    };
    createClientUseCase = new CreateClientUseCaseValidator(clientRepository);
  });

  describe('successful creation', () => {
    it('should create a new client when all validations pass', async () => {
      const clientData = {
        ...CLIENT_FIXTURE_NO_ID,
      };

      const client = new Client({ ...CLIENT_FIXTURE, firstName: 'John' });

      (clientRepository.findAll as jest.Mock).mockResolvedValue([]);

      (clientRepository.create as jest.Mock).mockResolvedValue(client);

      const result = await createClientUseCase.execute(CLIENT_FIXTURE);

      expect(clientRepository.findAll).toHaveBeenCalled();

      expect(clientRepository.create).toHaveBeenCalledWith({
        client: new CreateClient({
          ...clientData,
        }),
      });

      expect(result).toEqual(client);
    });
  });

  describe('unique client validation', () => {
    it('should throw an error when a client with the same firstName, lastName, and birthDate already exists', async () => {
      const existingClient = new Client({
        ...CLIENT_FIXTURE,
      });

      const newClientData: CreateClientUseCaseInput = {
        ...CLIENT_FIXTURE_NO_ID,
        driverLicenseNumber: '12345',
      };

      (clientRepository.findAll as jest.Mock).mockResolvedValue([
        existingClient,
      ]);

      await expect(createClientUseCase.execute(newClientData)).rejects.toThrow(
        'A client with the same first name, last name, and birth date already exists',
      );

      expect(clientRepository.findAll).toHaveBeenCalled();
      expect(clientRepository.create).not.toHaveBeenCalled();
    });

    it('should allow creation when firstName, lastName, or birthDate differs', async () => {
      const existingClient = new Client({
        ...CLIENT_FIXTURE,
      });

      const newClientData = {
        ...CLIENT_FIXTURE,
        birthDate: new Date('1990-01-02'),
        driverLicenseNumber: '12345',
      };

      const newClient = new Client({ ...newClientData });

      (clientRepository.findAll as jest.Mock).mockResolvedValue([
        existingClient,
      ]);

      (clientRepository.create as jest.Mock).mockResolvedValue(newClient);

      const result = await createClientUseCase.execute(newClientData);

      expect(result).toEqual(newClient);

      expect(clientRepository.create).toHaveBeenCalled();
    });
  });

  describe('unique driver license validation', () => {
    it('should throw an error when a client with the same driverLicenseNumber already exists', async () => {
      const existingClient = new Client({
        ...CLIENT_FIXTURE,
        driverLicenseNumber: '12345',
      });

      const newClientData = {
        ...CLIENT_FIXTURE_NO_ID,
        driverLicenseNumber: '12345',
        firstName: 'Jane',
      };

      (clientRepository.findAll as jest.Mock).mockResolvedValue([
        existingClient,
      ]);

      await expect(createClientUseCase.execute(newClientData)).rejects.toThrow(
        'A client with driver license number "12345" already exists',
      );

      expect(clientRepository.findAll).toHaveBeenCalled();
      expect(clientRepository.create).not.toHaveBeenCalled();
    });

    it('should allow creation when driverLicenseNumber is unique', async () => {
      const existingClient = new Client({
        ...CLIENT_FIXTURE,
        driverLicenseNumber: '99999',
      });

      const newClientData = {
        ...CLIENT_FIXTURE_NO_ID,
        driverLicenseNumber: '12345',
        firstName: 'Jane',
      };

      const newClient = new Client({ ...newClientData, id: '2' });

      (clientRepository.findAll as jest.Mock).mockResolvedValue([
        existingClient,
      ]);
      (clientRepository.create as jest.Mock).mockResolvedValue(newClient);

      const result = await createClientUseCase.execute(newClientData);

      expect(result).toEqual(newClient);
      expect(clientRepository.create).toHaveBeenCalled();
    });
  });

  describe('multiple clients validation', () => {
    it('should validate against all existing clients', async () => {
      const existingClients = [
        new Client({
          address: '456 Oak Ave',
          birthDate: new Date('1985-05-15'),
          driverLicenseNumber: '11111',
          email: 'jane@email.com',
          firstName: 'Jane',
          id: '1',
          lastName: 'Smith',
          phoneNumber: '+1111111111',
        }),
        new Client({
          address: '789 Pine Rd',
          birthDate: new Date('1992-08-20'),
          driverLicenseNumber: '22222',
          email: 'bob@email.com',
          firstName: 'Bob',
          id: '2',
          lastName: 'Johnson',
          phoneNumber: '+2222222222',
        }),
      ];

      const newClientData = {
        address: '123 Main St',
        birthDate: new Date('1990-01-01'),
        driverLicenseNumber: '33333',
        email: 'john.doe@email.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+1234567890',
      };

      const newClient = new Client({ ...newClientData, id: '3' });

      (clientRepository.findAll as jest.Mock).mockResolvedValue(
        existingClients,
      );
      (clientRepository.create as jest.Mock).mockResolvedValue(newClient);

      const result = await createClientUseCase.execute(newClientData);

      expect(result).toEqual(newClient);
      expect(clientRepository.create).toHaveBeenCalled();
    });
  });
});
