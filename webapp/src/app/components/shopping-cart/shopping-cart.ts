import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../services/cartService';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { Router, RouterModule } from '@angular/router';
import { OrderService } from '../../services/orderService';
import { Order } from '../../types/order';

@Component({
  selector: 'app-shopping-cart',
  imports: [MatIconModule,CommonModule,RouterModule],
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.scss'
})
export class ShoppingCart implements OnInit {
  cartItems: any[] = [];
  subtotal = 0;
  discount = 0;
  total = 0;
  paymentType: string = 'COD';
  addreform: any = { city: '', zip: '' };
  totalAmount: number = 0;
  isLoading = true;

  constructor(private cartService: CartService, private router: Router) {}
  orderService=inject(OrderService)
  cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    console.log('ShoppingCart ngOnInit');
    this.cartService.init();
    
    // Add a small delay to ensure init completes
    setTimeout(() => {
      this.loadCart();
    }, 100);
  }

  loadCart() {
    this.cartService.getCartitems().subscribe({
      next: (items) => {
        console.log('✅ Cart items received:', items);
        this.cartItems = items || [];
        this.calculateTotals();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error loading cart:', error);
        this.isLoading = false;
        this.cartItems = [];
        this.cdr.detectChanges();
      }
    });
  }

  trackByProductId(index: number, item: any) {
    return item.product._id;
  }

  calculateTotals() {
    this.subtotal = this.cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    this.discount = this.cartItems.reduce(
      (sum, i) => sum + ((i.product.discount || 0) * i.quantity),
      0
    );
    this.total = this.subtotal - this.discount;
  }

//   getImageUrl(image: string | undefined): string {
//   if (!image) return 'assets/images/placeholder.jpg';
//   if (image.startsWith('http')) return image;
//   return `${environment.apiUrl}/${image}`;
// }

  increaseQuantity(item: any) {
    const newQuantity = item.quantity + 1;
    console.log(`Increasing quantity for ${item.product.name} to ${newQuantity}`);

    this.cartService.addToCart(item.product._id, 1).subscribe({
      next: (response) => {
        console.log('✅ Quantity increased successfully:', response);
        item.quantity = item.quantity + 1;
        this.calculateTotals();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error increasing quantity:', error);
        alert('Failed to update quantity');
      }
    });
  }

  decreaseQuantity(item: any) {
  if (item.quantity > 1) {
    console.log(`Decreasing quantity for ${item.product.name} by 1`);

    // Send -1 to decrease by 1
    this.cartService.addToCart(item.product._id, -1).subscribe({
      next: (response) => {
        console.log('✅ Quantity decreased successfully:', response);
        item.quantity = item.quantity - 1; // Update local state
        this.calculateTotals();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error decreasing quantity:', error);
        alert('Failed to update quantity');
      }
    });
  }
}

  removeFromCart(item: any) {
    this.cartService.removeFromCart(item.product._id).subscribe(() => {
      this.loadCart();
    });
  }

  // orderStep:number=0
  checkout() {
    // this.orderStep=1;
    alert('Proceeding to checkout...');
    this.router.navigate(['/checkout'])
  }

  completeOrder(){
    let order :Order = {
      items: this.cartItems,
      paymentType: this.paymentType,
      address: this.addreform.value,
      date: new Date(),
      totalAmount: this.totalAmount,
    };
    this.orderService.addOrder(order).subscribe(result=>{
      alert("Order Completed")
      this.cartService.init();
      this.loadCart();
  
    })
    console.log(order)
  }

//  completeOrder() {
//   let order: Order = {
//     items: this.cartItems.map(item => ({
//       productId: item._id,
//       quantity: item.quantity,
//     })),
//     paymentType: this.paymentType,
//     address: this.addreform.value,
//     date: new Date(),
//     totalAmount: this.totalAmount,
//   };

//   this.orderService.addOrder(order).subscribe({
//     next: (result) => {
//       alert('Order Completed!');
//       this.cartService.init(); // clear cart
//       console.log('Order Saved:', result);
//     },
//     error: (err) => {
//       console.error('Order Failed:', err);
//       alert('Failed to complete order. Check console.');
//     },
//   });
// } 


}

