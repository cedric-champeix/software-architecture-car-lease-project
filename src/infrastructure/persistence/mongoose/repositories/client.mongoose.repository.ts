import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from 'src/domain/entities/client.entity';
import type {
  ClientRepository,
  CreateClientInput,
  DeleteClientInput,
  FindClientByIdInput,
  UpdateClientInput,
} from 'src/domain/repositories/client.repository';
import { ClientDocument } from 'src/infrastructure/persistence/mongoose/schemas/client.schema';

export class MongoClientRepository implements ClientRepository {
  constructor(
    @InjectModel('Client') private readonly model: Model<ClientDocument>,
  ) {}

  async create({ client }: CreateClientInput): Promise<Client> {
    const created = await this.model.create(client);

    return new Client({
      id: created._id.toString(),
      email: created.email,
      firstName: created.firstName,
      lastName: created.lastName,
    });
  }

  async findById({ id }: FindClientByIdInput): Promise<Client | null> {
    const doc = await this.model.findById(id);

    return doc
      ? new Client({
          id: doc._id.toString(),
          email: doc.email,
          firstName: doc.firstName,
          lastName: doc.lastName,
        })
      : null;
  }

  async findAll(): Promise<Client[]> {
    const docs = await this.model.find();

    return docs.map(
      (d) =>
        new Client({
          id: d._id.toString(),
          email: d.email,
          firstName: d.firstName,
          lastName: d.lastName,
        }),
    );
  }

  async update({ id, clientData }: UpdateClientInput): Promise<Client | null> {
    const updated = await this.model.findByIdAndUpdate(id, clientData, {
      new: true,
    });

    if (!updated) return null;

    return new Client({
      id: updated._id.toString(),
      email: updated.email,
      firstName: updated.firstName,
      lastName: updated.lastName,
    });
  }

  async delete({ id }: DeleteClientInput): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);

    return result !== null;
  }
}
