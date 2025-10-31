import { CartItem } from "./cartItem"
import { Product } from "./product";

// export interface Order{
//     items: CartItem[],
//       paymentType: string,
//       address: any,
//       date: Date,
//       totalAmount: number,
//       status?:string
// }

export interface OrderItem {
  productId: string;
  quantity: number;
}


export interface Order {
  _id?: string;
  userId?: string;
  // items: {
  //   product: Product;
  //   quantity: number;
  // }[];
  items: OrderItem[],
  paymentType: string;
  address: any;
  date: Date;
  totalAmount: number;
  status?: string;
  createdAt?: string;      
  updatedAt?: string;
}
