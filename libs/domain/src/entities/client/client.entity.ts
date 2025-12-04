export class Client {
  public id: string;
  public email: string;
  public phoneNumber: string;
  public firstName: string;
  public lastName: string;
  public birthDate: Date;
  public driverLicenseNumber: string;
  public address: string;

  constructor(init: Client) {
    Object.assign(this, init);
  }
}
