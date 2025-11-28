import { Contract } from 'src/entities/contract';
import { ContractStatus } from 'src/entities/contract/enum';
import { CLIENT_FIXTURE } from 'src/test/fixtures/client/client.fixture';
import { VEHICLE_FIXTURE } from 'src/test/fixtures/vehicle/vehicle.fixture';

export const CONTRACT_FIXTURE_NO_ID = {
  clientId: CLIENT_FIXTURE.id,
  vehicleId: VEHICLE_FIXTURE.id,
  startDate: new Date(),
  endDate: new Date(),
  status: ContractStatus.ACTIVE,
};

export const CONTRACT_FIXTURE = new Contract({
  ...CONTRACT_FIXTURE_NO_ID,
  id: 'contract-123',
});
