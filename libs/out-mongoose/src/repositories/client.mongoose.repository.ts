import { Client } from '@lib/domain/entities/client/client.entity';
import {
  ClientRepository,
  CreateClientInput,
  DeleteClientInput,
  FindAllClientsInput,
  FindClientByIdInput,
  UpdateClientInput,
} from '@lib/domain/repositories/client.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import type { ClientDocument } from '../schemas/client.schema';
import { ClientModel } from '../schemas/client.schema';

@Injectable()
export class ClientMongooseRepository implements ClientRepository {
  constructor(
    @InjectModel(ClientModel.name)
    private readonly model: Model<ClientDocument>,
  ) {}

  private toDomain(clientModel: ClientDocument): Client {
    return new Client({
      address: clientModel.address,
      birthDate: clientModel.birthDate,
      driverLicenseNumber: clientModel.driverLicenseNumber,
      email: clientModel.email,
      firstName: clientModel.firstName,
      id: clientModel._id.toString(),
      lastName: clientModel.lastName,
      phoneNumber: clientModel.phoneNumber,
    });
  }

  async create({ client }: CreateClientInput): Promise<Client> {
    const created = await this.model.create(client);
    return this.toDomain(created);
  }

  async findById({ id }: FindClientByIdInput): Promise<Client | null> {
    const doc = await this.model.findById(id);
    return doc ? this.toDomain(doc) : null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findAll(_input: FindAllClientsInput): Promise<Client[]> {
    const docs = await this.model.find();
    return docs.map((d) => this.toDomain(d));
  }

  async update({ id, clientData }: UpdateClientInput): Promise<Client | null> {
    const updated = await this.model.findByIdAndUpdate(id, clientData, {
      new: true,
    });

    if (!updated) return null;

    return this.toDomain(updated);
  }

  async deleteById({ id }: DeleteClientInput): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return result !== null;
  }
}
