import type { ContractStatus } from './enum';

export class Contract {
  id: string;
  vehicleId: string;
  clientId: string;
  startDate: Date;
  endDate: Date;
  status: ContractStatus;

  constructor(init: Contract) {
    Object.assign(this, init);
  }
}
