import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Brand as BrandType } from '../../../types/brand';
import { Category as CategoryType } from '../../../types/category';
import { CategoryService } from '../../../services/categoryService';
import { BrandService } from '../../../services/brandService';
import { ProductService} from '../../../services/productService';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../types/product';
import {MatCheckboxModule} from '@angular/material/checkbox';


@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule,MatInputModule,MatButtonModule,MatSelectModule,MatCheckboxModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss'
})
export class ProductForm {

  imagePreviews: string[] = [];
  formBuilder = inject(FormBuilder);
  productForm = this.formBuilder.group({
        
    name : [null,[Validators.required,Validators.minLength(5)]],
    shortDescription: [null,[Validators.required,Validators.minLength(10)]],
    description : [null,[Validators.required,Validators.minLength(20)]],
    price: [null,[Validators.required]],
    discount: [],
    images: this.formBuilder.array([]),
    categoryId:[null,[Validators.required]],
    brandId:[null,[Validators.required]],
    isFeatured:[false],
    isNewProduct:[false],
    


  });

  productService = inject(ProductService);
  categoryService = inject(CategoryService);
  brandService = inject(BrandService);

  brands: BrandType[] = [];
  categories: CategoryType[] = [];
  id!:string;

  route=inject(ActivatedRoute);

  ngOnInit(){
   
    this.categoryService.getCategories().subscribe(result=>{
        this.categories = result;
    });
    this.brandService.getBrands().subscribe((result:any)=>{
        this.brands = result;
    });
    this.id=this.route.snapshot.params["id"];
    console.log(this.id);

    if (this.id) {
      this.productService.getProductById(this.id).subscribe(result=>{
        for (let index = 0; index < result.images.length; index++) {
          this.addImage();
        }
        this.productForm.patchValue(result as any);
      })
    } else {
       this.addImage();
    }

  }

  router=inject(Router);

  addProduct(){
    let value = this.productForm.value;
    console.log(value);
    this.productService.addProduct(value as any).subscribe((result:any)=>{
      alert("Product Added");
      this.router.navigateByUrl("/admin/products")
    });
  }

  updateProduct(){
    let value = this.productForm.value;
    console.log(value);
    this.productService.updateProduct(this.id,value as any).subscribe((result:any)=>{
      alert("Product Updated");
      this.router.navigateByUrl("/admin/products")
    });
  }

  addImage(){
    this.images.push(this.formBuilder.control(null));
  }

  removeImage(){
    this.images.removeAt(this.images.controls.length-1);
  }

    get images(){ 
      return this.productForm.get('images') as FormArray;
    }

 // Called when user selects a file for an image input
onFileSelected(event: any, index: number) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviews[index] = reader.result as string;
      this.images.at(index).setValue(this.imagePreviews[index]);
    };
    reader.readAsDataURL(file);
  }
}



  

}
