import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CustomerService } from '../../services/customerService';
import { Product } from '../../types/product';
import { ProductCard } from '../product-card/product-card';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../services/wishlistService';
import { CartService } from '../../services/cartService';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [ProductCard, CarouselModule , CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

   customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 200,
    items:1,
    navText: ['', ''],
    autoplay:true,
    // responsive: {
    //   0: {
    //     items: 1
    //   },
    //   400: {
    //     items: 2
    //   },
    //   740: {
    //     items: 3
    //   },
    //   940: {
    //     items: 4
    //   }
    // },
    nav: false
  }

  customerService = inject(CustomerService);
  cdr =inject(ChangeDetectorRef)
  newproducts:Product[]=[];
  featuredProducts:Product[]=[];
  wishlistService=inject(WishlistService)
  cartService=inject(CartService)

  bannerImages:string[] = [
    'assets/banners/ban5.jpeg',
    'assets/banners/ban6.jpg',
    'assets/banners/ban8.jpeg'
  ];
  
 ngOnInit() {
  this.customerService.getFeaturedProducts().subscribe(result => {
    // Defer update until after current detection cycle
    Promise.resolve().then(() => {
      this.featuredProducts = result;
      this.cdr.detectChanges(); // safe timing
    });
  });

  this.customerService.getNewProducts().subscribe(result => {
    Promise.resolve().then(() => {
      this.newproducts = result;
      this.cdr.detectChanges();
    });
  });

  // this.wishlistService.init();
  // this.cartService.init()
}


}

// import { ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
// import { CustomerService } from '../../services/customerService';
// import { Product } from '../../types/product';
// import { ProductCard } from '../product-card/product-card';
// import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
// import { CommonModule } from '@angular/common';
// import { WishlistService } from '../../services/wishlistService';

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [ProductCard, CarouselModule, CommonModule],
//   templateUrl: './home.html',
//   styleUrl: './home.scss'
// })
// export class Home {
//   customerService = inject(CustomerService);
//   cdr =inject(ChangeDetectorRef)
//   newproducts:Product[]=[];
//   featuredProducts:Product[]=[];
//   wishlistService=inject(WishlistService)

  
//   bannerImages:string[] = [
//     'assets/banners/ban1.jpeg',
//     'assets/banners/ban2.jpg',
//     'assets/banners/ban3.jpeg'
//   ];

//    customOptions: OwlOptions = {
//     loop: true,
//     mouseDrag: false,
//     touchDrag: false,
//     pullDrag: false,
//     dots: false,
//     navSpeed: 200,
//     items:1,
//     navText: ['', ''],
//     autoplay:true,
//     // responsive: {
//     //   0: {
//     //     items: 1
//     //   },
//     //   400: {
//     //     items: 2
//     //   },
//     //   740: {
//     //     items: 3
//     //   },
//     //   940: {
//     //     items: 4
//     //   }
//     // },
//     nav: false
//   }
  
//   ngOnInit() {
//   this.customerService.getFeaturedProducts().subscribe(result => this.featuredProducts = result);
//   this.customerService.getNewProducts().subscribe(result => this.newproducts = result);
// }

// }
