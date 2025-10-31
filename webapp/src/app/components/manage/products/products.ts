import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
// import { Brand } from '../../../services/brandService';
import { ProductService } from '../../../services/productService';
import { Product } from '../../../types/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, RouterLink, CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products {

     displayedColumns: string[] = ['id', 'name', 'shortDescription', 'price', 'discount', 'action'];
      dataSource: MatTableDataSource<Product>;
      products: Product[] = [];

      @ViewChild(MatPaginator) paginator!: MatPaginator;
      @ViewChild(MatSort) sort!: MatSort;

      // (product) comes from services
      productService=inject(ProductService); 
      private cdr = inject(ChangeDetectorRef); 

      constructor() {
        this.dataSource = new MatTableDataSource<Product>([]);
      }

      ngOnInit() {
        //  this.getServerData();
      }

      private getServerData() {
    console.log('Fetching products...');
    this.productService.getAllProducts().subscribe({
      next: (result) => {
        console.log('Products received:', result);
        console.log('Number of products:', result.length);
        
        this.products = result;
        this.dataSource.data = result;
        
        this.cdr.detectChanges();
        
        console.log('DataSource data:', this.dataSource.data);
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

      ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.getServerData();
      }

      applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }

      delete(id:string){
        this.productService.deleteProduct(id).subscribe(result=>{
          alert("Product Deleted");
          this.getServerData();
        })
      }

}
