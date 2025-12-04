export class CreateClient {
  public email: string;
  public phoneNumber: string;
  public firstName: string;
  public lastName: string;
  public birthDate: Date;
  public driverLicenseNumber: string;
  public address: string;

  constructor(init: CreateClient) {
    Object.assign(this, init);
  }
}
