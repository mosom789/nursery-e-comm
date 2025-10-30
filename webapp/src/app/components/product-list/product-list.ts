import { Component, inject } from '@angular/core';
import { CustomerService } from '../../services/customerService';
import { Product } from '../../types/product';
import { ProductCard } from '../product-card/product-card';
import { ActivatedRoute, Router } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Category } from '../../types/category';
import { Brand } from '../../types/brand';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-list',
  imports: [ProductCard,MatSelectModule,FormsModule,MatButtonModule,CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList {

  customerService = inject(CustomerService)
    searchTerm:string = '';
    categoryId:string = '';
    sortBy:string = '';
    sortOrder:number = -1;
    brandId:string = '';
    products:Product[]=[];
    page=1;
    pageSize=6;
    isNext = true

    route = inject (ActivatedRoute);
    router= inject(Router);
    category:Category[]=[];
    brands:Brand[]=[];

  ngOnInit(){
    this.customerService.getCategories().subscribe(result=>{
      this.category = result;
    })
     this.customerService.getBrands().subscribe(result=>{
      this.brands = result;
    })
   this.route.queryParams.subscribe((x:any)=>{
    this.products = []
    this.searchTerm = x.search || ''
    this.categoryId = x.categoryId || ''

    this.getProducts()
   })
  }

  getProducts(){
     setTimeout(()=>{
      this.customerService.getProducts(
      this.searchTerm,
      this.categoryId,
      this.sortBy,
      this.sortOrder,
      this.brandId,
      this.page,
      this.pageSize
    ).subscribe((result)=>{
      this.products=result;
      this.isNext = result.length === this.pageSize;
    });
     });
  }

  orderChange(event:any){
      this.sortBy='price';
      this.sortOrder=event;
      this.getProducts()
  }

 
  pageChange(page:number){
    if (page < 1) return;
    this.page=page;
    this.getProducts();
  }



  // selectCategory(id: string) {
  //   this.router.navigate(['/products'], { queryParams: { categoryId: id } });
  // }

  // onSearch(value: string) {
  //   this.router.navigate(['/products'], { queryParams: { search: value } });
  // }

}
