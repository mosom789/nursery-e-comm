// import { HttpClient } from '@angular/common/http';
// import { inject, Injectable } from '@angular/core';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { environment } from '../../environments/environment';
// import { Product } from '../types/product';

// @Injectable({
//   providedIn: 'root'
// })
// export class WishlistService {
//   // http=inject(HttpClient)
//   // wishlists: Product[]=[]

// private http = inject(HttpClient);

//   // Make wishlists reactive
//   private _wishlists$ = new BehaviorSubject<Product[]>([]);
//   wishlists$ = this._wishlists$.asObservable();

//   constructor() {
//     this.init();
//   }

//   // init(){
//   //   this.getWishlists().subscribe((result)=>{
//   //       this.wishlists = result;
//   //   })
//   // }

//   init() {
//     this.getWishlists().subscribe({
//       next: (result) => this._wishlists$.next(result),
//       error: () => this._wishlists$.next([]) // fallback
//     });
//   }

//   getWishlists(){
//     return this.http.get<Product[]>(environment.apiUrl + "/customer/wishlists")
//   }

//   addInWishlists(productId:string){
//     return this.http.post(environment.apiUrl + "/customer/wishlists/" + productId, {})
//   }

//   removeFromWishlists(productId:string){
//     return this.http.delete(environment.apiUrl + "/customer/wishlists/" + productId)
//   }

//   isInWishlist(productId: string): boolean {
//     return this._wishlists$.value.some(p => p._id === productId);
//   }

//   refresh() {
//     this.init();
//   }

// }


import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../types/product';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  http = inject(HttpClient);

  private _wishlists$ = new BehaviorSubject<Product[]>([]);
  wishlists$ = this._wishlists$.asObservable();

  constructor() {
    this.refresh(); // load wishlist initially
  }

  refresh() {
    this.http.get<Product[]>(environment.apiUrl + '/customer/wishlists')
      .subscribe({
        next: res => this._wishlists$.next(res),
        error: () => this._wishlists$.next([])
      });
  }

  addInWishlists(productId: string) {
    this.http.post(environment.apiUrl + '/customer/wishlists/' + productId, {})
      .subscribe(() => this.refresh());
  }

  removeFromWishlists(productId: string) {
   this.http.delete(environment.apiUrl + '/customer/wishlists/' + productId)
      .subscribe(() => this.refresh());
  }

  isInWishlist(productId: string): boolean {
    return this._wishlists$.value.some(p => p._id === productId);
  }
}

  
