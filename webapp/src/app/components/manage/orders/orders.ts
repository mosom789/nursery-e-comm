import { Component, inject } from '@angular/core';
import { StatsService } from '../../../services/statsService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.scss'
})
export class Orders {
statsService = inject(StatsService)

 orders:any[] = [];

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.statsService.getAdminOrder().subscribe((res:any) => {
      this.orders = res.orders || [];
    });
  }

  updateOrderStatus(order:any) {
    this.statsService.updateOrder(order._id, { status: order.status }).subscribe(() => {
      alert('Order status updated');
    });
  }

  // viewOrder(order:any) {
  //   // navigate to order detail page later
  //   console.log(order);
  // }

  deleteOrder(orderId:string) {
    if(confirm('Delete this order?')) {
      this.statsService.deleteOrder(orderId).subscribe(() => {
        this.orders = this.orders.filter(o => o._id !== orderId);
        alert('Order deleted');
      });
    }
  }

}
