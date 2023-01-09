import {Injectable} from '@angular/core';
import Product from "../../model/product.model";

@Injectable({
	providedIn: 'root'
})
export class CartService {

	constructor() {
		if (localStorage.getItem('cart') == null || localStorage.getItem("cart") == "")
			localStorage.setItem("cart", "[]");
	}

	get items() : Product[] {
		return JSON.parse(<string>localStorage.getItem('cart'));
	}

	addToCart(product: Product) {
		let t = this.items;
		t.push(product);
		localStorage.setItem("cart", JSON.stringify(t));
	}

	getItems() : Product[] {
		return this.items;
	}

	clearCart() {
		localStorage.setItem("cart", "");
	}
}
