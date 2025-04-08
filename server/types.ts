export interface CartItem {
  product: { price: number; title: string; description: string; _doc?: any };
  quantity: number;
}

export interface IUser {
  _id: any;
  name: string;
  email: string;
  password: string;
  resetToken?: string;
  resetTokenExpiration?: Date;
  cart?: { items: any[] };
  save(): Promise<IUser>;
}
