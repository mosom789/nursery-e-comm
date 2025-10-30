// import { Component, inject, ViewChild } from '@angular/core';
// import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
// import {MatSort, MatSortModule} from '@angular/material/sort';
// import {MatTableDataSource, MatTableModule} from '@angular/material/table';
// import {MatInputModule} from '@angular/material/input';
// import {MatFormFieldModule} from '@angular/material/form-field';
// import { CategoryService} from '../../../services/categoryService';
// import { MatButtonModule } from '@angular/material/button';
// import { RouterLink } from '@angular/router';
// import { Category } from '../../../types/category';
// import { MatIcon } from '@angular/material/icon';


// @Component({
//   selector: 'app-categories',
//   imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, RouterLink,MatIcon],
//   templateUrl: './categories.html',
//   styleUrl: './categories.scss'
// })
// export class Categories {
//      displayedColumns: string[] = ['id', 'name', 'action'];
//       dataSource: MatTableDataSource<Category>;

//       @ViewChild(MatPaginator) paginator!: MatPaginator;
//       @ViewChild(MatSort) sort!: MatSort;

//       categoryService=inject(CategoryService)

//       constructor() {
       
//         this.dataSource = new MatTableDataSource([] as any);
//       }

//       ngOnInit() {
//          this.getServerData();
//       }

//   private getServerData() {
//     this.categoryService.getCategories().subscribe((result) => {
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
//         this.categoryService.deleteCategoryById(id).subscribe((result:any)=>{
//           alert("Category Deleted");
//           this.getServerData();
//         })
//       }
// }



import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../services/categoryService';
import { Router } from '@angular/router';
import { Category } from '../../../types/category';

@Component({
  selector: 'app-categories',imports:[CommonModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.scss'],
})
export class Categories {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  searchText: string = '';

  categoryService = inject(CategoryService);
  router = inject(Router);

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.categoryService.getCategories().subscribe((result) => {
      this.categories = result;
      this.filteredCategories = result;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchText = filterValue;
    this.filteredCategories = this.categories.filter((cat) =>
      cat.name.toLowerCase().includes(filterValue)
    );
  }

  delete(id: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategoryById(id).subscribe(() => {
        alert('Category Deleted');
        this.getCategories();
      });
    }
  }
}
