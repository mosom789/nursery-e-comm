import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Order } from '../../types/order';
import { OrderService } from '../../services/orderService';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './customer-orders.html',
  styleUrl: './customer-orders.scss'
})
export class CustomerOrders implements OnInit {
  orders: Order[] = [];
  subtotal = 0;
  discount = 0;
  total = 0;
  isLoading = true;
  error: string | null = null;

  orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    console.log('CustomerOrders component ngOnInit called');
    this.loadOrders();
  }

  loadOrders() {
    console.log('Loading customer orders...');
    this.isLoading = true;
    this.error = null;

    this.orderService.getCustomerOrders().subscribe({
      next: (result) => {
        console.log('✅ Orders received:', result);
        console.log('Number of orders:', result?.length);

        this.orders = result || [];
        console.log('Orders assigned:', this.orders);

        if (this.orders.length > 0) {
          this.calculateTotals();
        }

        this.isLoading = false;
        this.cdr.detectChanges();

        console.log("Orders==>", this.orders);
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

        this.error = 'Failed to load your orders. Please try again.';
        this.isLoading = false;
        this.orders = [];
        this.cdr.detectChanges();
      },
      complete: () => {
        console.log('Orders loading completed');
      }
    });
  }

  calculateTotals() {
    console.log('Calculating totals...');
    
    // Flatten all items from all orders
    const allItems = this.orders.flatMap(order => order.items || []);
    console.log('Total items across all orders:', allItems.length);

    // Note: If your Order schema has items as { productId, quantity } 
    // and not populated products, this calculation won't work
    // You'll need to populate products in the backend

    this.subtotal = 0;
    this.discount = 0;
    this.total = 0;

    // Calculate from order totals instead
    this.orders.forEach(order => {
      this.total += order.totalAmount || 0;
    });

    console.log('Total across all orders: ₹', this.total);
  }

  trackByOrderId(index: number, order: Order) {
    return order._id || index;
  }

  trackByItemId(index: number, item: any) {
    return item._id || item.productId || index;
  }

  retryLoading() {
    this.loadOrders();
  }
}
