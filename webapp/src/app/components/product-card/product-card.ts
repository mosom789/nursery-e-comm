// import { Component, inject, Input } from '@angular/core';
// import { Product } from '../../types/product';
// import { RouterLink } from '@angular/router';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
// import { WishlistService } from '../../services/wishlistService';

// @Component({
//   selector: 'app-product-card',
//   imports: [RouterLink, MatIconModule,MatButtonModule],
//   templateUrl: './product-card.html',
//   styleUrl: './product-card.scss'
// })
// export class ProductCard {
// @Input() product!:Product;
// wishlistService=inject(WishlistService)

// addToWishlist(product:Product){
//   console.log(product)
//   if (this.isInWishlist(product)) {
//     this.wishlistService.removeFromWishlists(product._id!).subscribe((result)=>{
//       this.wishlistService.init()
//     })
//   } else{
//     this.wishlistService.addInWishlists(product._id!).subscribe((result)=>{
//       this.wishlistService.init()
//     })
//   }
// }

// // isInWishlist(product:Product){
// //     let isExits=this.wishlistService.wishlists.find(x=>x._id==product._id)
// //     if (isExits) {
// //       return true 
// //     } else {
// //       return false
// //     }
// // }

// isInWishlist(product: Product): boolean {
//     return this.wishlistService.isInWishlist(product._id!);
//   }

// }

import { Component, inject, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Product } from '../../types/product';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WishlistService } from '../../services/wishlistService';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cartService';

@Component({
  selector: 'app-product-card',
  imports: [MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss'
})
export class ProductCard implements OnInit, OnDestroy {
  @Input() product!: Product;
  wishlistService = inject(WishlistService);
  cartService = inject(CartService)
  cdr = inject(ChangeDetectorRef)

  wishlists: Product[] = [];
  sub!: Subscription;

  ngOnInit() {
    this.sub = this.wishlistService.wishlists$.subscribe(list => {
       this.wishlists = list
      this.cdr.detectChanges()
      });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  addToWishlist(product: Product) {
    if (this.isInWishlist(product)) {
      this.wishlistService.removeFromWishlists(product._id!);
    } else {
      this.wishlistService.addInWishlists(product._id!);
    }
    setTimeout(() => this.cdr.detectChanges(), 0);
  }

  isInWishlist(product: Product): boolean {
    return this.wishlists.some(p => p._id === product._id);
  }

  addToCart(product: Product){
    console.log(product);
    if (!this.isProductInCart(product._id!)) {
      this.cartService.addToCart(product._id!, 1).subscribe(()=>{
        this.cartService.init();
        setTimeout(() => this.cdr.detectChanges(), 0);
      })
    } else{
      this.cartService.removeFromCart(product._id!).subscribe(()=>{
        this.cartService.init();
        setTimeout(() => this.cdr.detectChanges(), 0);
    })
   }
  }
  
  isProductInCart(productId:string){
    if (this.cartService.items.find(x=>x.product._id==productId)) {
      return true;
    } else {
      return false;
    }
  }

}
