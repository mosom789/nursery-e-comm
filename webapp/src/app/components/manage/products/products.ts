import { Component, inject, ViewChild } from '@angular/core';
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

      @ViewChild(MatPaginator) paginator!: MatPaginator;
      @ViewChild(MatSort) sort!: MatSort;

      // (product) comes from services
      productService=inject(ProductService);  

      constructor() {
       
        this.dataSource = new MatTableDataSource([] as any);
      }

      ngOnInit() {
         this.getServerData();
      }

      private getServerData() {
        this.productService.getAllProducts().subscribe((result) => {
          console.log(result);
          this.dataSource.data = result;
        });
      }

      ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
