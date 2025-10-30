import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cartService';
import { AuthService } from '../../services/authService';

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

  address: any = null;
  paymentMethod = 'COD';
  subtotal = 0;
  discount = 0;
  total = 0;

  ngOnInit() {
    // ✅ load saved address (from profile page or localStorage)
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

  placeOrder() {
    if (!this.address) {
      alert('Please add your address first!');
      this.router.navigate(['/profile']);
      return;
    }

    alert(
      `✅ Order placed successfully!\nPayment Mode: ${this.paymentMethod}\nTotal: ₹${this.total}`
    );
    // You can add order saving logic here
    this.router.navigate(['/']);
  }
}