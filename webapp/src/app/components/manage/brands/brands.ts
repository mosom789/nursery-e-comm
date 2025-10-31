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


import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BrandService } from '../../../services/brandService';
import { Brand } from '../../../types/brand';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './brands.html',
  styleUrls: ['./brands.scss']
})
export class Brands implements OnInit, OnDestroy {
  dataSource: Brand[] = [];
  filteredData: Brand[] = []; // ✅ Keep original data separate
  isLoading = true;
  error: string | null = null;
  page = 1;
  limit = 5;
  searchText = '';

  private brandService = inject(BrandService);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  ngOnInit() {
    console.log('Brands ngOnInit called');
    console.log('BrandService exists:', !!this.brandService);
    
    setTimeout(() => {
      this.getServerData();
    }, 0);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getServerData() {
    console.log('Loading brands...');
    this.isLoading = true;
    this.error = null;

    this.brandService.getBrands()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: Brand[]) => {
          console.log('✅ Brands received:', result);
          console.log('Number of brands:', result?.length);

          this.dataSource = Array.isArray(result) ? result : [];
          this.filteredData = [...this.dataSource]; // ✅ Copy to filtered data
          
          console.log('Brands assigned:', this.dataSource.length);
          console.log('Filtered brands:', this.filteredData.length);

          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('❌ Error loading brands:', error);
          console.error('Error details:', {
            message: error.message,
            status: error.status,
            statusText: error.statusText,
            url: error.url,
            error: error.error
          });

          this.error = 'Failed to load brands. Please try again.';
          this.isLoading = false;
          this.dataSource = [];
          this.filteredData = [];
          this.cdr.detectChanges();
        },
        complete: () => {
          console.log('Brands loading completed');
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchText = filterValue;
    
    console.log('Filtering brands with:', filterValue);
    
    // ✅ Filter from original dataSource, not from already filtered data
    this.filteredData = this.dataSource.filter((brand) =>
      brand.name.toLowerCase().includes(filterValue)
    );
    
    console.log('Filtered results:', this.filteredData.length);
    
    // Reset to first page when filtering
    this.page = 1;
    this.cdr.detectChanges();
  }

  delete(id?: string) {
    if (!id) {
      console.warn('Delete called without ID');
      return;
    }

    if (confirm('Are you sure you want to delete this brand?')) {
      console.log('Deleting brand:', id);

      this.brandService.deleteBrandById(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            console.log('✅ Brand deleted successfully:', response);
            alert('Brand Deleted Successfully');
            this.getServerData(); // Reload data
          },
          error: (error) => {
            console.error('❌ Error deleting brand:', error);
            alert('Failed to delete brand. Please try again.');
          }
        });
    }
  }

  pagedData() {
    const start = (this.page - 1) * this.limit;
    const end = start + this.limit;
    return this.filteredData.slice(start, end);
  }

  totalPages() {
    return Math.ceil(this.filteredData.length / this.limit);
  }

  nextPage() {
    if (this.page < this.totalPages()) {
      this.page++;
      this.cdr.detectChanges();
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.cdr.detectChanges();
    }
  }

  goToPage(pageNum: number) {
    if (pageNum >= 1 && pageNum <= this.totalPages()) {
      this.page = pageNum;
      this.cdr.detectChanges();
    }
  }

  retryLoading() {
    this.getServerData();
  }
}
