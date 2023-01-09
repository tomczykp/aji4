import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ProductComponent} from './components/product/product.component';
import {RegisterComponent} from "./components/register/register.component";
import {LoginComponent} from "./components/login/login.component";
import {HomeComponent} from "./components/home/home.component";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatButtonModule} from "@angular/material/button";
import {MatPaginatorModule} from "@angular/material/paginator";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {NavComponent} from "./components/nav/nav.component";
import {NgbAlertModule, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {CategoriesComponent} from './components/category/categories.component';
import {CategoryDetailsComponent} from './components/category/details/category.details.component';
import {AddProductComponent} from './components/product/add/add.product.component';
import {ModProductComponent} from './components/product/mod/mod.product.component';
import { CartComponent } from './components/cart/cart.component';
import { OrderComponent } from './components/order/order.component';
import {OrderDetailsComponent} from "./components/order/detail/order.detail.component";
import {TokenInterceptor} from "./interceptor/jwt.interceptor";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		NavComponent,
		ProductComponent,
		LoginComponent,
		RegisterComponent,
		CategoriesComponent,
		CategoryDetailsComponent,
		AddProductComponent,
		ModProductComponent,
		CartComponent,
		OrderComponent,
		OrderDetailsComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,

		// Material frontend
		MatTableModule,
		MatSortModule,
		BrowserAnimationsModule,
		MatButtonModule,
		MatPaginatorModule,
		NgbAlertModule,

		NgbModule,
		ReactiveFormsModule,
		HttpClientModule,
		FormsModule,
		MatIconModule,
		MatFormFieldModule,
		MatSelectModule,
	],
	providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }],
	bootstrap: [AppComponent]
})
export class AppModule {
}
