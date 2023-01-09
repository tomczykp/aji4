import { Component, OnInit } from '@angular/core';
import {ProductsService} from "../../services/product.service";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpResponse} from "@angular/common/http";
import Product from "../../../model/product.model";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {

	product!: Product;
	role: string = "";
	authenticated!: boolean;
	productID!: string;

  constructor(private router: Router,
              private productsService: ProductsService,
              private authService: AuthService,
              private cartService : CartService,
              private route: ActivatedRoute) {}

	ngOnInit(): void {

		this.authService.authenticated.subscribe({
			next: (change: boolean) => {
				this.authenticated = change;

				if (this.authenticated) {
					this.role = this.authService.getRole();
				}
			}
		});

		this.route.params.subscribe(params => {
			this.productID = params['uuid'];
		});
		this.getProduct();

	}

	getProduct() : void {
		this.productsService.getProduct(this.productID).subscribe({
			next: (res: HttpResponse<Product>) => {

				if (res.status == 200 && res.body != null) {
					this.product = res.body;
				}
			},
			error: (res : HttpResponse<Product>) => {
				if (res.status == 404)
					this.router.navigate([""], {queryParams: {'product-not-found': true}});
			}
		});
	}

	filter(name : string) : void {
	  this.router.navigate(["/"], {queryParams: {category: name}});
	}

	buy() : void {
	  this.cartService.addToCart(this.product);
	}
}
