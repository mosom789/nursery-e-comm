import { Component, inject } from '@angular/core';
import { Order } from '../../types/order';
import { OrderService } from '../../services/orderService';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-customer-orders',
  imports: [CommonModule, MatIconModule],
  templateUrl: './customer-orders.html',
  styleUrl: './customer-orders.scss'
})
export class CustomerOrders {

orders:Order[]=[]
subtotal = 0;
discount = 0;
total = 0;
orderService=inject(OrderService);

ngOnInit(){
  this.orderService.getCustomerOrders().subscribe(result=>{
    this.orders=result;
    console.log("===>", this.orders);
    this.calculateTotals();
  })
}

  calculateTotals() {
    const cartItems = this.orders.flatMap(order => order.items);

    this.subtotal = cartItems.reduce(
      (sum: number, item: any) => sum + item.product.price * item.quantity,
      0
    );

    this.discount = cartItems.reduce(
      (sum: number, item: any) => sum + ((item.product.discount || 0) * item.quantity),
      0
    );

    this.total = this.subtotal - this.discount;
  }

  trackByOrderId(index: number, order: any) {
    return order._id || index;
  }

  trackByItemId(index: number, item: any) {
    return item._id || index;
  }

}
