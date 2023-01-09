import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {OrderService} from "../../services/order.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import Order from "../../../model/order.model";
import {retry} from "rxjs";

@Component({
	selector: 'app-order',
	templateUrl: './order.component.html',
	styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

	newOrder: boolean = false;
	authenticated: boolean = false;
	username: string = "";
	role: string = "";
	orders!: Order[];
	deleteSuccess : boolean = false;
	notFound : boolean = false;

	displayedColumns: string[] = ['id', 'user', 'status', 'updatedAt', "createdAt"];
	dataSource: MatTableDataSource<Order> = new MatTableDataSource();
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	constructor(private router: Router,
	            private orderService: OrderService,
	            private authService: AuthService,
	            private route: ActivatedRoute) {
	}

	applyFilter(event: Event) {
		const filterValue : string = (event.target as HTMLInputElement).value.trim();
		this.dataSource.filter = filterValue;
	}

	ngOnInit(): void {
		const params = this.route.snapshot.queryParamMap;
		this.newOrder = params.has('success');
		this.notFound = params.has('order-not-found');
		this.authService.authenticated.subscribe((change) => {
			this.authenticated = change;
			if (this.authenticated) {
				this.username = this.authService.getUsername();
				this.role = this.authService.getRole();
				if (this.role == 'admin') {
					this.displayedColumns.push("delete");
				}
			} else {
				this.router.navigate([''], {queryParams: {unauthorized: true}});
			}
		});
	}

	ngAfterViewInit(): void {
		this.getOrders();
	}

	getOrders() : void {
		this.orderService.getOrders().subscribe({
			next: val => {
				if (val.status == 200 && val.body != null) {
					this.orders = val.body.map((o: Order) => {
						return {
							id: o.id,
							status: o.status,
							createdAt: o.createdAt,
							updatedAt: o.updatedAt,
							user: o.user,
							subOrders: o.subOrders
						}
					});

					this.dataSource = new MatTableDataSource(this.orders);
					this.dataSource.filterPredicate = (order : Order, filter: string) => this.status(order.status).toLowerCase().includes(filter.toLowerCase());
					this.dataSource.paginator = this.paginator;
					this.dataSource.sort = this.sort;
				}
			},
			error: res => {
				if (res.status == 501)
					this.router.navigate([''], {queryParams: {unauthorized: true}});
			}
		});
	}

	dateFormat(dateS : string) : string {
		const date : Date = new Date(dateS);
		return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
	}

	delete(uuid : string) : void {
		this.orderService.delete(uuid).subscribe({
			next: res => {
				this.getOrders();
				this.deleteSuccess = res.status == 204;
			},
			error: err => {
				this.getOrders();
				this.deleteSuccess = err.status != 204;
			}

		});
	};

	status(s: number) : string {
		switch (s) {
			case 0: return "Received";
			case 1: return "InPreparation";
			case 2: return "OnRoute";
			case 3: return "Delivered";
			case 4: return "Canceled";
			default: return "Lost";
		}
	}

}
