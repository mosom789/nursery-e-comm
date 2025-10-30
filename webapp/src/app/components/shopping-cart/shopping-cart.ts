import { Component, inject, OnInit } from '@angular/core';
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

  constructor(private cartService: CartService, private router: Router) {}
  orderService=inject(OrderService)

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCartitems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotals();
      console.log('Loaded cart items:', this.cartItems);
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
    item.quantity++;
    this.cartService.addToCart(item.product._id, item.quantity);
    this.calculateTotals();
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.cartService.addToCart(item.product._id, item.quantity);
      this.calculateTotals();
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

