import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from 'src/domain/entities/client.entity';
import {
  ClientRepository,
  CreateClientInput,
  DeleteClientInput,
  UpdateClientInput,
} from 'src/domain/repositories/client.repository';
import type { ClientDocument } from 'src/infrastructure/persistence/mongoose/schemas/client.schema';
import { ClientModel } from 'src/infrastructure/persistence/mongoose/schemas/client.schema';

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
      firstName: clientModel.firstName,
      id: clientModel._id.toString(),
      lastName: clientModel.lastName,
    });
  }

  async create({ client }: CreateClientInput): Promise<Client> {
    const created = await this.model.create(client);
    return this.toDomain(created);
  }

  async findById(id: string): Promise<Client | null> {
    const doc = await this.model.findById(id);
    return doc ? this.toDomain(doc) : null;
  }

  async findAll(): Promise<Client[]> {
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

  async delete({ id }: DeleteClientInput): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return result !== null;
  }
}
