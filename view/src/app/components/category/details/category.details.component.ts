import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpResponse} from "@angular/common/http";
import Category from "../../../../model/category.model";
import CategoryService from "../../../services/category.service";
import {AuthService} from "../../../services/auth.service";
import {FormControl, FormGroup} from "@angular/forms";
import {environment} from "../../../../environments/environment";

@Component({
	selector: 'app-category-detail',
	templateUrl: './category.details.component.html'
})
export class CategoryDetailsComponent implements OnInit {

	category!: Category;
	role!: string;
	authenticated!: boolean;
	uniqName: boolean = false;
	invalidName: boolean = false;
	categoryID!: string;
	modify : boolean = false;
	catForm = new FormGroup({
		name: new FormControl('', environment.lenValidation),
	});

	get name() {
		return this.catForm.get("name");
	}

	constructor(private router: Router,
	            private categoryService: CategoryService,
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
			this.categoryID = params['uuid'];
		});

		 this.route.queryParams.subscribe({
			next: value => {
				this.modify = value['modify'] ? value['modify'] : false;
			}
		});
		this.getCategory();

	}

	getCategory() : void {
		this.categoryService.getCategory(this.categoryID).subscribe({
			next: (res: HttpResponse<Category>) => {
				if (res.status == 200 && res.body != null) {
					this.category = res.body;
					this.catForm.get("name")?.setValue(this.category.name);
				} else {
					this.router.navigate(["/category"], {queryParams: {'category-not-found': true}});
				}
			}
		});
	}

	onSubmit() : void {
		const name = this.catForm.getRawValue().name;
		if (name == null || name == "")
			return;
		this.categoryService.updateCategory(this.categoryID, {name: name}).subscribe({
			next: res => {
				if (res.status == 200 && res.body != null) {
					this.category = res.body;
				}
				this.getCategory();
			},
			error: res => {
				if (res.status == 409)
					this.uniqName = true;
				else if (res.status == 400)
					this.invalidName = true;
			}
		});
	}
}
