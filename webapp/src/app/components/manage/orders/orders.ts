import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { StatsService } from '../../../services/statsService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.scss'
})
export class Orders implements OnInit {
  statsService = inject(StatsService);
  private cdr = inject(ChangeDetectorRef);

  orders: any[] = [];
  isLoading = true;
  error: string | null = null;

  ngOnInit() {
    console.log('Orders component ngOnInit called');
    this.loadOrders();
  }

  loadOrders() {
    console.log('Loading orders...');
    this.isLoading = true;
    this.error = null;

    this.statsService.getAdminOrder().subscribe({
      next: (res: any) => {
        console.log('✅ Orders response received:', res);
        console.log('Orders array:', res.orders);
        console.log('Number of orders:', res.orders?.length);

        this.orders = res.orders || [];
        this.isLoading = false;
        this.cdr.detectChanges();

        console.log('Orders loaded:', this.orders.length);
      },
      error: (error) => {
        console.error('❌ Error loading orders:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          error: error.error
        });

        this.error = 'Failed to load orders. Please try again.';
        this.isLoading = false;
        this.orders = [];
        this.cdr.detectChanges();
      },
      complete: () => {
        console.log('Orders loading completed');
      }
    });
  }

  updateOrderStatus(order: any) {
    console.log('Updating order status:', order._id, 'to', order.status);

    this.statsService.updateOrder(order._id, { status: order.status }).subscribe({
      next: (response) => {
        console.log('✅ Order status updated:', response);
        alert('Order status updated successfully');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error updating order:', error);
        alert('Failed to update order status');
        // Reload orders to revert UI changes
        this.loadOrders();
      }
    });
  }

  deleteOrder(orderId: string) {
    if (confirm('Are you sure you want to delete this order?')) {
      console.log('Deleting order:', orderId);

      this.statsService.deleteOrder(orderId).subscribe({
        next: (response) => {
          console.log('✅ Order deleted:', response);
          
          // Remove from local array
          this.orders = this.orders.filter(o => o._id !== orderId);
          this.cdr.detectChanges();
          
          alert('Order deleted successfully');
        },
        error: (error) => {
          console.error('❌ Error deleting order:', error);
          alert('Failed to delete order');
        }
      });
    }
  }

  retryLoading() {
    this.loadOrders();
  }
}