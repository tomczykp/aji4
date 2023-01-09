import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProductComponent} from "./components/product/product.component";
import {HomeComponent} from "./components/home/home.component";
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {CategoriesComponent} from "./components/category/categories.component";
import {CategoryDetailsComponent} from "./components/category/details/category.details.component";
import {AddProductComponent} from "./components/product/add/add.product.component";
import {ModProductComponent} from "./components/product/mod/mod.product.component";
import {CartComponent} from "./components/cart/cart.component";
import {OrderComponent} from "./components/order/order.component";
import {OrderDetailsComponent} from "./components/order/detail/order.detail.component";

const routes: Routes = [
	{path: '', component: HomeComponent},
	{path: 'login', component: LoginComponent},
	{path: 'register', component: RegisterComponent},

	// category
	{path: 'category', component: CategoriesComponent},
	{path: 'category/:uuid', component: CategoryDetailsComponent},

	//Products
	{path: 'product', component: AddProductComponent},
	{path: 'product/:uuid', component: ProductComponent},
	{path: 'product/:uuid/modify', component: ModProductComponent},

	// Order
	{path: 'cart', component: CartComponent},
	{path: 'order', component: OrderComponent},
	{path: 'order/:uuid', component: OrderDetailsComponent},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
