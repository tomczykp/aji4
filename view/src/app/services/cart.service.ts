import {Injectable} from '@angular/core';
import Product from "../../model/product.model";

@Injectable({
	providedIn: 'root'
})
export class CartService {

	private cartKey : string = "cart";

	constructor() {
		if (localStorage.getItem(this.cartKey) == null || localStorage.getItem(this.cartKey) == "")
			localStorage.setItem("cart", "[]");
	}

	get items() : Product[] {
		return JSON.parse(<string>localStorage.getItem(this.cartKey));
	}

	addToCart(product: Product) {
		let t = this.items;
		t.push(product);
		localStorage.setItem(this.cartKey, JSON.stringify(t));
	}

	getItems() : Product[] {
		return this.items;
	}

	clearCart() {
		localStorage.setItem(this.cartKey, "[]");
	}
}
