import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import Product, {ProductRepr} from "../../../model/product.model";
import {ProductsService} from "../../services/product.service";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute} from "@angular/router";
import {CartService} from "../../services/cart.service";

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	displayedColumns: string[] = ['productId', 'name', 'categoryName', 'price', 'weight'];
	dataSource!: MatTableDataSource<ProductRepr>;
	products!: Product[];
	text: string = "not logged in.";
	role: string = "";
	authenticated!: boolean;
	productNotFound : boolean = false;
	deleteSuccess : boolean = false;
	unauthorized : boolean = false;
	deleteConstraint : boolean = false;
	category : string = "";

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;


	constructor(private route: ActivatedRoute,
	            private productsService: ProductsService,
	            private authService: AuthService,
	            private cartService : CartService) {
	}

	ngOnInit(): void {
		const params = this.route.snapshot.queryParamMap;
		this.productNotFound = params.has('product-not-found');
		this.unauthorized = params.has('unauthorized');
		this.category = "";
		if (params.has("category"))
			this.category = <string>params.get("category");


		this.authService.authenticated.subscribe((change) => {
			this.authenticated = change;

			if (this.authenticated) {
				this.text = this.authService.getUsername();
				this.role = this.authService.getRole();
				if (this.role == "admin") {
					this.displayedColumns.push("modify");
					this.displayedColumns.push("delete");
				}
				else if (this.role == 'user') {
					this.displayedColumns.push('addToCart');
				}
			}
		});
		this.dataSource = new MatTableDataSource();
	}

	ngAfterViewInit(): void {
		this.getProducts();
	}

	getProducts(): void {
		this.productsService.getProducts().subscribe(value => {
			this.products = value;
			let t: ProductRepr[] = this.products.map((p): ProductRepr => {
				return {
					productId: p.id,
					name: p.name,
					weight: p.weight,
					price: p.price,
					categoryName: p.category.name
				}
			});
			if (this.category != "")
				t = t.filter((p : ProductRepr) => p.categoryName == this.category);

			this.dataSource = new MatTableDataSource(t);
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
		});
	};

	deleteProduct(pID : string) : void {
		this.productsService.delete(pID).subscribe({
			next: res => {
				this.getProducts();
				this.deleteSuccess = res.status == 204;
			},
			error: err => {
				this.getProducts();
				this.deleteSuccess = err.status == 204;
				this.deleteConstraint = err.status == 501;
			}
		});
	}

	buy(uuid : string) : void {
		const prod = this.products.find((p) => p.id == uuid);
		if (prod)
			this.cartService.addToCart(prod);
	}

}
