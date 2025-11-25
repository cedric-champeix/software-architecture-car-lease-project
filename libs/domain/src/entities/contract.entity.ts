export class Contract {
  id: string;
  vehicleId: string;
  clientId: string;
  startDate: Date;
  endDate: Date;
  status: ContractStatus;

  constructor(init?: Partial<Contract>) {
    Object.assign(this, init);
  }
}

export enum ContractStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  COMPLETED = 'completed',
  OVERDUE = 'overdue',
  PENDING = 'pending',
}
