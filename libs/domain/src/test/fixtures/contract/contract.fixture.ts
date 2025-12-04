import { Contract } from '@lib/domain/entities/contract';
import { ContractStatus } from '@lib/domain/entities/contract/enum';
import { CLIENT_FIXTURE } from '@lib/domain/test/fixtures/client/client.fixture';
import { VEHICLE_FIXTURE } from '@lib/domain/test/fixtures/vehicle/vehicle.fixture';

export const CONTRACT_FIXTURE_NO_ID = {
  clientId: CLIENT_FIXTURE.id,
  endDate: new Date(),
  startDate: new Date(),
  status: ContractStatus.ACTIVE,
  vehicleId: VEHICLE_FIXTURE.id,
};

export const CONTRACT_FIXTURE = new Contract({
  ...CONTRACT_FIXTURE_NO_ID,
  id: 'contract-123',
});
