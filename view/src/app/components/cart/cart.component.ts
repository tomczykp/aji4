import {Component, OnInit} from '@angular/core';
import {CartService} from "../../services/cart.service";
import Product from "../../../model/product.model";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {OrderService} from "../../services/order.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {

	products!: Product[];
	username: string = "";
	role: string = "";
	authenticated : boolean = false;
	repr : {amount: number, product: Product}[] = [];

	constructor(private route: ActivatedRoute,
				private router: Router,
	            private authService: AuthService,
	            private cartService : CartService,
	            private orderService : OrderService) {
	}

	ngOnInit(): void {

		this.authService.authenticated.subscribe((change) => {
			this.authenticated = change;

			if (this.authenticated) {
				this.username = this.authService.getUsername();
				this.role = this.authService.getRole();
				if (this.role != 'user')
					this.router.navigate(["/"]);
			} else {
				this.router.navigate(["/"]);
			}
		});
		this.getProducts()
	}

	getProducts(): void {
		this.products = this.cartService.getItems();
		let t = [];
		for (let prod of this.products) {
			let entry = t.find((p) => p.product.id == prod.id);
			if (entry)
				entry.amount++
			else
				t.push({amount: 1, product: prod});
		}
		this.repr = t;

	};

	inc(entry :  {amount: number, product: Product}) : void {
		entry.amount++;
	}

	dec(entry :  {amount: number, product: Product}) : void {
		entry.amount--;
	}

	order() : void {
		let order = {
			user: this.authService.getUUID(),
			subOrders: this.repr.map((e) => {
				return {amount: e.amount, product: e.product.id}
			})
		};
		this.orderService.add(order).subscribe({
			next: res => {
				if (res.status == 200 && res.body != null) {
					this.cartService.clearCart();
					this.router.navigate(['/order', res.body.id], {queryParams: {success: true}});
				}
			}
		});
	}
}
