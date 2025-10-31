import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cartService';
import { AuthService } from '../../services/authService';
import { OrderService } from '../../services/orderService';
import { Order } from '../../types/order';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class Checkout implements OnInit {
  private cartService = inject(CartService);
  private router = inject(Router);
  authService = inject(AuthService)
  private cdr = inject(ChangeDetectorRef);
  orderService=inject(OrderService)

  address: any = null;
  // paymentMethod = 'COD';
  paymentType: string = 'COD';
  subtotal = 0;
  discount = 0;
  total = 0;
  cartItems: any[] = [];
  isLoading = true;
  error: string | null = null;
  addreform: any = { city: '', zip: '' };
  totalAmount: number = 0;

  ngOnInit() {
    // ✅ load saved address (from profile page or localStorage)
    this.loadCartData();
   const userEmail = this.authService.userEmail;

    // ✅ Load address specific to the current user
    const savedAddress = localStorage.getItem(`userAddress_${userEmail}`);
    if (savedAddress) {
      this.address = JSON.parse(savedAddress);
    }

       this.cartService.getCartitems().subscribe((items: any[]) => {
      this.subtotal = items.reduce(
        (sum: number, i: any) => sum + i.product.price * i.quantity,
        0
      );

        this.discount = items.reduce(
        (sum: number, i: any) => sum + ((i.product.discount || 0) * i.quantity),
        0
      );

      this.total = this.subtotal - this.discount;
    });
  }

  private loadCartData() {
    console.log('Loading cart data...');
    this.isLoading = true;
    this.error = null;

    this.cartService.getCartitems().subscribe({
      next: (items: any[]) => {
        console.log('✅ Cart items received:', items);
        console.log('Number of items:', items?.length);

        if (!items || items.length === 0) {
          console.warn('Cart is empty');
          this.cartItems = [];
          this.isLoading = false;
          this.cdr.detectChanges();
          return;
        }

        this.cartItems = items;

        // Calculate subtotal
        this.subtotal = items.reduce(
          (sum: number, i: any) => {
            const price = i.product?.price || 0;
            const quantity = i.quantity || 0;
            console.log(`Item: ${i.product?.name}, Price: ${price}, Qty: ${quantity}`);
            return sum + (price * quantity);
          },
          0
        );

        // Calculate discount
        this.discount = items.reduce(
          (sum: number, i: any) => {
            const discount = i.product?.discount || 0;
            const quantity = i.quantity || 0;
            return sum + (discount * quantity);
          },
          0
        );

        // Calculate total
        this.total = this.subtotal - this.discount;

        console.log('Subtotal:', this.subtotal);
        console.log('Discount:', this.discount);
        console.log('Total:', this.total);

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error loading cart:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          statusText: error.statusText,
          url: error.url
        });

        this.error = 'Failed to load cart items. Please try again.';
        this.isLoading = false;
        this.cartItems = [];
        this.subtotal = 0;
        this.discount = 0;
        this.total = 0;
        this.cdr.detectChanges();
      },
      complete: () => {
        console.log('Cart loading completed');
      }
    });
  }

  placeOrder() {
    console.log('Place order clicked');
    console.log('Address:', this.address);
    console.log('Total:', this.total);

    if (!this.address) {
      alert('Please add your address first!');
      this.router.navigate(['/profile']);
      return;
    }

    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
      this.router.navigate(['/']);
      return;
    }

    const transformedItems = this.cartItems.map(item => {
      console.log('Transforming item:', {
        productId: item.product?._id,
        quantity: item.quantity
      });
      
      return {
        productId: item.product._id,
        quantity: item.quantity
      };
    });

    let order :Order = {
          items: transformedItems,
          paymentType: this.paymentType,
          address: this.address,
          date: new Date(),
          totalAmount: this.total,
        };
        console.log("Order Data: ",order)
        
        this.orderService.addOrder(order).subscribe(result=>{
          alert("Order Completed")
          this.cartService.init();
          this.loadCartData();
          console.log("Result==>", result);
        });
        
    alert(
      `✅ Order placed successfully!\nPayment Mode: ${this.paymentType}\nTotal: ₹${this.total}`
    );
    
    // Clear cart after order
    this.cartService.init();
    
    // Navigate to orders or home
    this.router.navigate(['/']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  retryLoading() {
    this.loadCartData();
  }

}