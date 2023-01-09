import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {environment} from "../../../../environments/environment";
import Category from "../../../../model/category.model";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductsService} from "../../../services/product.service";
import {AuthService} from "../../../services/auth.service";
import CategoryService from "../../../services/category.service";
import Product from "../../../../model/product.model";

@Component({
  selector: 'app-mod',
  templateUrl: './mod.product.component.html'
})
export class ModProductComponent implements OnInit {

	public productForm : FormGroup = new FormGroup({
		name: new FormControl('', environment.reqValidation),
		category: new FormControl('', environment.reqValidation),
		price: new FormControl('', environment.posNumValidation),
		weight: new FormControl('', environment.posNumValidation)
	});
	get name() {
		return this.productForm.get("name");
	}
	get category() {
		return this.productForm.get("category");
	}
	get price() {
		return this.productForm.get("price");
	}
	get weight() {
		return this.productForm.get("weight");
	}

	role: string = "";
	authenticated: boolean = false;
	invalidForm : boolean = false;
	uniqName : boolean = false;
	catNotFound : boolean = false;
	categories!: Category[];
	uuid : string = "";
	product!: Product;

	constructor(private router: Router,
	            private productsService: ProductsService,
	            private authService: AuthService,
	            private route: ActivatedRoute,
	            private catService : CategoryService) {}

	ngOnInit(): void {
		this.authService.authenticated.subscribe({
			next: (change: boolean) => {
				this.authenticated = change;

				if (this.authenticated) {
					this.role = this.authService.getRole();
					if (this.role != 'admin')
						this.router.navigate(["/"]);
				}
			}
		});
		this.route.params.subscribe(params => {
			this.uuid = params['uuid'];
		});
		this.productsService.getProduct(this.uuid).subscribe({
			next: res => {
				if (res.status == 200 && res.body != null) {
					this.product = res.body;
					this.price?.setValue(this.product.price);
					this.name?.setValue(this.product.name);
					this.weight?.setValue(this.product.weight);
					this.category?.setValue(this.product.category.name);
				}
				else {
					this.router.navigate(["/"], {queryParams: {'product-not-found': true}});
				}
			}
		});

		this.getCategories();
	}

	getCategories() : void {
		this.catService.getCategories().subscribe({
			next: res => {
				if (res.status == 200 && res.body != null) {
					this.categories = res.body;
				}			}
		})
	}

	onSubmit() : void {
		const weight : string = <string>this.productForm.getRawValue().weight;
		const name : string = <string>this.productForm.getRawValue().name;
		const cat = this.categories.find((cat : Category) => cat.name == <string>this.productForm.getRawValue().category);
		const price : string = <string>this.productForm.getRawValue().price;

		if (cat == null) {
			this.catNotFound = true;
			return;
		}

		const categoryID : string = cat.id;

		this.productsService.updateProduct(this.uuid, {name: name, weight: weight, price: price, category: categoryID}).subscribe({
			next: res => {
				if (res.status == 200 && res.body != null)
					this.router.navigate(["/product", res.body.id]);
				else
					this.invalidForm = true;
			},
			error: res => {
				if (res.status == 404)
					this.catNotFound = true;
				else if (res.status == 409)
					this.uniqName = true;
				else
					this.invalidForm = true;
			}
		});
	}

}
