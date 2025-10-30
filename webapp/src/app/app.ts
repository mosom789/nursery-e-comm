import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { WishlistService } from './services/wishlistService';
import { CartService } from './services/cartService';
import { AuthService } from './services/authService';


@Component({
  selector: 'app-root',
  imports: [MatButtonModule, RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
   title = signal('webapp');
   wishlistService=inject(WishlistService)
  cartService=inject(CartService)
  authService=inject(AuthService)

   ngOnInit(){
    if (this.authService.isLoggedIn) {
      // this.wishlistService.init();
      this.cartService.init()
    }
   
   }
}
