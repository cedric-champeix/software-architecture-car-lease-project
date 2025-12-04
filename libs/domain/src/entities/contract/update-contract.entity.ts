import type { ContractStatus } from './enum';

export class UpdateContract {
  vehicleId?: string;
  clientId?: string;
  startDate?: Date;
  endDate?: Date;
  status?: ContractStatus;

  constructor(init: Partial<UpdateContract>) {
    Object.assign(this, init);
  }
}
