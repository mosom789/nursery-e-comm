// import { Component, inject } from '@angular/core';
// import { CustomerService } from '../../services/customerService';
// import { ActivatedRoute, Router } from '@angular/router';
// import { Product } from '../../types/product';
// import { CommonModule } from '@angular/common';
// import { MatButtonModule } from '@angular/material/button';
// import { ProductCard } from '../product-card/product-card';
// import { MatIconModule } from '@angular/material/icon';
// import { WishlistService } from '../../services/wishlistService';

// @Component({
//   selector: 'app-product-detail',
//   imports: [CommonModule,MatButtonModule,ProductCard,MatIconModule],
//   templateUrl: './product-detail.html',
//   styleUrl: './product-detail.scss'
// })
// export class ProductDetail {

//   customerService = inject(CustomerService)
//   route = inject(ActivatedRoute)
//   wishlistService=inject(WishlistService)
  
//   product!:Product

//   mainImage!: string;
//   similarProducts:Product[]=[]

//   // ngOnInit(){
//   //   const id = this.route.snapshot.params["id"];
//   //   this.customerService.getProductById(id).subscribe((result)=>{
//   //     this.product = result;
//   //     this.mainImage = this.product.images?.[0] || 'https://via.placeholder.com/500';
//   //     console.log(this.product);

//   //     this.customerService.getProducts('', this.product.categoryId, '', -1, '', 1, 4).subscribe(result=>{
//   //        console.log("Similar products result:", result);
//   //       this.similarProducts = result;
//   //     })
//   //   })
//   // }


//   // Method to change main image
 
//  ngOnInit() {
//   this.route.params.subscribe((x:any)=>{
//     this.getProductDetail(x.id)
//   })
//  }

//  getProductDetail(id:string){
//   this.customerService.getProductById(id).subscribe({
//     next: (product) => {
//       this.product = product;
//       this.mainImage = product.images[0] ;
//       console.log('Main product:', this.product);

//       // ✅ Load similar products by category + brand
//       this.customerService
//         .getProducts('', product.categoryId, '', -1, '', 1, 4)
//         .subscribe({
//           next: (res) => {
//             // Exclude the current product from the similar list
//             this.similarProducts = res.filter(p => p._id !== this.product._id);
//             console.log('Similar products:', this.similarProducts);
//           },
//           error: (err) => console.error('Error fetching similar products:', err)
//         });
//     },
//     error: (err) => console.error('Error fetching product:', err)
//   });
//  }

//   setMainImage(img: string) {
//     this.mainImage = img;
//   }

//   addToWishlist(product:Product){
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

import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customerService';
import { WishlistService } from '../../services/wishlistService';
import { Product } from '../../types/product';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ProductCard } from '../product-card/product-card';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../services/productService';
import { CartService } from '../../services/cartService';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, MatButtonModule, ProductCard, MatIconModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss'
})
export class ProductDetail implements OnInit, OnDestroy {
  customerService = inject(CustomerService);
  productService = inject(ProductService)
  route = inject(ActivatedRoute);
  wishlistService = inject(WishlistService);
  cartService = inject(CartService)

  product!: Product;
  mainImage!: string;
  similarProducts: Product[] = [];
  wishlists: Product[] = [];
  wishlistSub!: Subscription;

  ngOnInit() {
    this.route.params.subscribe((params: any) => this.getProductDetail(params.id));

    this.wishlistSub = this.wishlistService.wishlists$.subscribe(list => this.wishlists = list);
  }

  ngOnDestroy() {
    this.wishlistSub?.unsubscribe();
  }

  getProductDetail(id: string) {
    this.customerService.getProductById(id).subscribe(product => {
      this.product = product;
      this.mainImage = product.images[0];

      this.customerService.getProducts('', product.categoryId, '', -1, '', 1, 4)
        .subscribe(res => {
          this.similarProducts = res.filter(p => p._id !== this.product._id);
        });
    });
  }

  setMainImage(img: string) {
    this.mainImage = img;
  }

  addToWishlist(product: Product) {
    if (this.isInWishlist(product)) {
      this.wishlistService.removeFromWishlists(product._id!);
    } else {
      this.wishlistService.addInWishlists(product._id!);
    }
  }

  isInWishlist(product: Product): boolean {
    return this.wishlists.some(p => p._id === product._id);
  }

    addToCart(product: Product){
    console.log(product);
    if (!this.isProductInCart(product._id!)) {
      this.cartService.addToCart(product._id!, 1).subscribe(()=>{
        this.cartService.init();
      })
    } else{
      this.cartService.removeFromCart(product._id!).subscribe(()=>{
        this.cartService.init();
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


