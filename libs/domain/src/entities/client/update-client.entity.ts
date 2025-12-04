export class UpdateClient {
  public email?: string;
  public phoneNumber?: string;
  public driverLicenseNumber?: string;
  public address?: string;

  constructor(init: Partial<UpdateClient>) {
    Object.assign(this, init);
  }
}
