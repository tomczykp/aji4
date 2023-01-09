import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpResponse} from "@angular/common/http";
import {AuthService} from "../../../services/auth.service";
import {FormControl, FormGroup} from "@angular/forms";
import {environment} from "../../../../environments/environment";
import {OrderService} from "../../../services/order.service";
import Order from "../../../../model/order.model";
import SubOrder from "../../../../model/suborder.model";

@Component({
	selector: 'app-order-detail',
	templateUrl: './order.detail.component.html'
})
export class OrderDetailsComponent implements OnInit {

	role!: string;
	authenticated!: boolean;
	order!: Order;
	orderID!: string;
	modify : boolean = false;
	updateFailed : boolean = false;
	orderForm = new FormGroup({
		name: new FormControl('', environment.lenValidation),
	});

	get name() {
		return this.orderForm.get("name");
	}

	constructor(private router: Router,
	            private orderService: OrderService,
	            private authService: AuthService,
	            private route: ActivatedRoute) {}

	ngOnInit(): void {

		this.authService.authenticated.subscribe({
			next: (change: boolean) => {
				this.authenticated = change;

				if (this.authenticated) {
					this.role = this.authService.getRole()!;
				} else {
					this.role = "";
				}
			}
		});

		this.route.params.subscribe(params => {
			this.orderID = params['uuid'];
		});

		this.route.queryParams.subscribe({
			next: value => {
				//this.modify = value['modify'] ? value['modify'] : false;
				this.modify = false;
			}
		});
		this.getOrder();

	}

	getOrder() : void {
		this.orderService.getOrder(this.orderID).subscribe({
			next: (res: HttpResponse<Order>) => {
				if (res.status == 200 && res.body != null) {
					this.order = res.body;
				} else {
					this.router.navigate(["/order"], {queryParams: {'order-not-found': true}});
				}
			}
		});
	}

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

	dateFormat(dateS : any) : string {
		const date : Date = new Date(dateS);
		return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
	}

	private updatePartial() {
		this.orderService.update(this.orderID, {
			status: this.order.status,
			user: this.order.user.id,
			subOrders: this.order.subOrders.map((e) => {
				return {amount: e.amount, product: e.product.id}
			})
		}).subscribe({
			next: res => {
				if (res.status != 200)
					this.updateFailed = true;
			}
		});
	}

	get suma() {
		return this.order.subOrders.reduce(
			(acc : number, val : SubOrder) => acc + val.amount * val.product.price, 0);
	}

	incStatus() {
		this.order.status++;
		this.updatePartial();
	}

	decStatus() {
		this.order.status--;
		this.updatePartial();
	}

	onSubmit() : void {

	}
}
