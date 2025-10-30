// import { Component, inject, ViewChild } from '@angular/core';
// import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
// import {MatSort, MatSortModule} from '@angular/material/sort';
// import {MatTableDataSource, MatTableModule} from '@angular/material/table';
// import {MatInputModule} from '@angular/material/input';
// import {MatFormFieldModule} from '@angular/material/form-field';
// import { MatButtonModule } from '@angular/material/button';
// import { RouterLink } from '@angular/router';
// import { BrandService } from '../../../services/brandService';
// import { CommonModule } from '@angular/common';
// import { Brand } from '../../../types/brand';


// @Component({
//   selector: 'app-brands',
//   imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, CommonModule ,RouterLink],
//   templateUrl: './brands.html',
//   styleUrl: './brands.scss'
// })
// export class Brands {
//   displayedColumns: string[] = ['id', 'name', 'action'];
//       dataSource: MatTableDataSource<Brand>;

//       @ViewChild(MatPaginator) paginator!: MatPaginator;
//       @ViewChild(MatSort) sort!: MatSort;

//       brandService=inject(BrandService)

//       constructor() {
       
//         this.dataSource = new MatTableDataSource([] as any);
//       }

//       ngOnInit() {
//          this.getServerData();
//       }

//   private getServerData() {
//     this.brandService.getBrands().subscribe((result) => {
//       console.log(result);
//       this.dataSource.data = result;
//     });
//   }

//       ngAfterViewInit() {
//         this.dataSource.paginator = this.paginator;
//         this.dataSource.sort = this.sort;
//       }

//       applyFilter(event: Event) {
//         const filterValue = (event.target as HTMLInputElement).value;
//         this.dataSource.filter = filterValue.trim().toLowerCase();

//         if (this.dataSource.paginator) {
//           this.dataSource.paginator.firstPage();
//         }
//       }

//       delete(id:string){
//         console.log(id)
//         this.brandService.deleteBrandById(id).subscribe((result:any)=>{
//           alert("Brand Deleted");
//           this.getServerData();
//         })
//       }
// }


import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BrandService } from '../../../services/brandService';
import { Brand } from '../../../types/brand';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './brands.html',
  styleUrls: ['./brands.scss']
})
export class Brands {
  dataSource: Brand[] = [];
  brandService = inject(BrandService);
  page = 1;
  limit = 5;

  ngOnInit() {
    this.getServerData();
  }

 getServerData() {
    this.brandService.getBrands().subscribe((result: Brand[]) => {
      this.dataSource = result;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.dataSource = this.dataSource.filter((brand) =>
      brand.name.toLowerCase().includes(filterValue)
    );
  }

  delete(id?: string) {
    if (!id) return;
    this.brandService.deleteBrandById(id).subscribe(() => {
      alert('Brand Deleted');
      this.getServerData();
    });
  }

  pagedData() {
    const start = (this.page - 1) * this.limit;
    return this.dataSource.slice(start, start + this.limit);
  }

  totalPages() {
    return Math.ceil(this.dataSource.length / this.limit);
  }
}
