import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Categories } from './components/manage/categories/categories';
import { CategoryForm } from './components/manage/category-form/category-form';
import { Brands } from './components/manage/brands/brands';
import { BrandForm } from './components/manage/brand-form/brand-form';
import { Products } from './components/manage/products/products';
import { ProductForm } from './components/manage/product-form/product-form';
import { ProductList } from './components/product-list/product-list';
import { ProductDetail } from './components/product-detail/product-detail';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { authGaurd } from './core/auth-gaurd';
import { AdminDashboard } from './components/manage/admin-dashboard/admin-dashboard';
import { adminGaurd } from './core/admin-gaurd';
import { CustomerProfile } from './components/customer-profile/customer-profile';
import { ShoppingCart } from './components/shopping-cart/shopping-cart';
import { Checkout } from './components/checkout/checkout';
import { CustomerOrders } from './components/customer-orders/customer-orders';
import { Orders } from './components/manage/orders/orders';
import { Users } from './components/manage/users/users';

export const routes: Routes = [
    {
        path:"", component:Home, canActivate:[authGaurd]
    },
    {
        path:"admin", component:AdminDashboard, canActivate:[adminGaurd]
    },
    {
        path:"admin/categories", component:Categories, canActivate:[adminGaurd]
    },
    {
        path:"admin/categories/add", component:CategoryForm, canActivate:[adminGaurd]
    },
    {
        path:"admin/categories/:id", component:CategoryForm, canActivate:[adminGaurd]
    },
   
    {
        path:"admin/brands", component:Brands, canActivate:[adminGaurd]
    },
    {
        path:"admin/brands/add", component:BrandForm, canActivate:[adminGaurd]
    },
    {
        path:"admin/brands/:id", component:BrandForm, canActivate:[adminGaurd]
    },

     {
        path:"admin/products", component:Products, canActivate:[adminGaurd]
    },
    {
        path:"admin/products/add", component:ProductForm, canActivate:[adminGaurd]
    },
    {
        path:"admin/products/:id", component:ProductForm, canActivate:[adminGaurd]
    },
    {
        path:"admin/orders", component:Orders, canActivate:[adminGaurd]
    },
    {
        path:"admin/users", component:Users, canActivate:[adminGaurd]
    },
    {
        path:"products", component:ProductList, canActivate:[authGaurd]
    },
    {
        path:"product/:id", component: ProductDetail, canActivate:[authGaurd]
    },
    {
        path:"profile", component: CustomerProfile, canActivate:[authGaurd]
    },
    {
        path:"cart", component:ShoppingCart,canActivate:[authGaurd]
    },
    {
        path:"checkout", component: Checkout,canActivate:[authGaurd]
    },
    {
        path:"orders", component: CustomerOrders,canActivate:[authGaurd]
    },
    {
        path:"register", component: Register
    },
    {
        path:"login", component: Login
    },
    

];
