import type { ContractStatus } from './enum';

export class CreateContract {
  vehicleId: string;
  clientId: string;
  startDate: Date;
  endDate: Date;
  status: ContractStatus;

  constructor(init: CreateContract) {
    Object.assign(this, init);
  }
}
