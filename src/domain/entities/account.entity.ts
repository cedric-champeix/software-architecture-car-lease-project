export class Account {
  public readonly id: string;
  private _name: string;
  private _type: string;
  private _balance: number;

  constructor({
    id,
    name,
    type,
    balance,
  }: {
    id: string;
    name: string;
    type: string;
    balance: number;
  }) {
    this.id = id;
    this._name = name;
    this._type = type;
    this._balance = balance;
  }

  public get name(): string {
    return this._name;
  }

  public get type(): string {
    return this._type;
  }

  public get balance(): number {
    return this._balance;
  }
}
