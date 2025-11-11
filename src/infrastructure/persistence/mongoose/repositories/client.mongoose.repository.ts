import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from 'src/domain/entities/client.entity';
import {
  ClientRepository,
  CreateClientInput,
  DeleteClientInput,
  FindClientByIdInput,
  UpdateClientInput,
} from 'src/domain/repositories/client.repository';
import { ClientModel } from 'src/infrastructure/persistence/mongoose/schemas/client.schema';

@Injectable()
export class ClientMongooseRepository implements ClientRepository {
  constructor(
    @InjectModel(ClientModel.name) private readonly model: Model<ClientModel>,
  ) {}

  private toDomain(clientModel: ClientModel): Client {
    return new Client({
      id: clientModel.id,
      firstName: clientModel.firstName,
      lastName: clientModel.lastName,
      birthDate: clientModel.birthDate,
      driverLicenseNumber: clientModel.driverLicenseNumber,
      address: clientModel.address,
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
