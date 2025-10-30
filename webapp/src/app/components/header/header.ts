import { Component, inject } from '@angular/core';
import { CategoryService } from '../../services/categoryService';
import { Category } from '../../types/category';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authService';
import { CustomerService } from '../../services/customerService';
import { RouterLink } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, FormsModule, MatIcon],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  // categoryService = inject(CategoryService);
  // categoryList:Category[]=[];
  // ngOnInit(){
  //   this.categoryService.getCategories().subscribe((result)=>{
  //     console.log('✅ Categories loaded:', result);
  //     this.categoryList = result;
  //   })
  // }

  authService = inject(AuthService);
  searchTerm!:string;
  
  private customerService = inject(CustomerService)
  categoryList$: Observable<Category[]> = this.customerService.getCategories();


  router=inject(Router)
  onSearch(e:any){
    if(e.target.value){
      this.router.navigateByUrl('/products?search='+e.target.value)
    }
  }

  searchCategory(id:string){
    this.searchTerm = "";
      this.router.navigateByUrl('/products?categoryId='+id!)
  }

  logout(){
    this.authService.logout();
    this.router.navigateByUrl("/login")
  }

//   get homeLink(): string {
//   if (this.authService.isAdmin) {
//     return '/admin';
//   }
//   return '/';
// }

}

