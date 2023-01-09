import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import CategoryService from "../../services/category.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import Category, {CategoryRepr} from "../../../model/category.model";
import {FormControl, FormGroup} from "@angular/forms";
import {environment} from "../../../environments/environment";

@Component({
	selector: 'app-categories',
	templateUrl: './categories.component.html',
	styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {


	displayedColumns: string[] = ['categoryId', 'name', 'productCount'];
	dataSource: MatTableDataSource<CategoryRepr> = new MatTableDataSource();
	categories!: Category[];
	role: string = "";
	authenticated!: boolean;
	categoryNotFound: boolean = false;
	uniqName: boolean = false;
	deleteSuccess: boolean = false;


	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;
	addCategoryFrom = new FormGroup({
		name: new FormControl('', environment.lenValidation),
	});

	constructor(private router: Router,
	            private categoryService: CategoryService,
	            private authService: AuthService,
	            private route: ActivatedRoute) {
	}

	get name() {
		return this.addCategoryFrom.get("name");
	}

	ngOnInit(): void {
		const params = this.route.snapshot.queryParamMap;
		this.categoryNotFound = params.has('category-not-found');
		this.authService.authenticated.subscribe((change) => {
			this.authenticated = change;

			if (this.authenticated) {
				this.role = this.authService.getRole();
				if (this.role == "admin") {
					this.displayedColumns.push("modify");
					this.displayedColumns.push("delete");
				}
			} else {
				this.role = "";
			}
		});
	}

	ngAfterViewInit(): void {
		this.getCategories();
	}

	getCategories(): void {
		this.categoryService.getCategories().subscribe({
			next: value => {
				if (value.status == 200 && value.body != null) {
					this.categories = value.body;
					const t: CategoryRepr[] = this.categories.map((p: Category): CategoryRepr => {
						return {
							categoryId: p.id,
							name: p.name,
							productCount: p.products.length
						}
					});

					this.dataSource = new MatTableDataSource(t);
					this.dataSource.paginator = this.paginator;
					this.dataSource.sort = this.sort;
				} else if (value.status == 401)
					this.router.navigate(['/'], {queryParams: {unauthorized: true}});
				else
					this.router.navigate(['/']);
			},
			error: err => {
				if (err.status == 401)
					this.router.navigate(['/'], {queryParams: {unauthorized: true}});
			}
		});
	}

	deleteCategory(cID: string): void {
		this.categoryService.deleteCategory(cID).subscribe({
			next: res => {
				this.getCategories();
				this.deleteSuccess = res.status == 204;
			},
			error: err => {
				this.getCategories();
				this.deleteSuccess = err.status != 204;
			}
		});
	}

	onSubmit(): void {
		const catName: string = <string>this.addCategoryFrom.getRawValue().name;
		this.categoryService.addCategory({name: catName}).subscribe({
			next: res => {
				this.getCategories();
			},
			error: err => {
				this.uniqName = err.status == 409;
			}
		});
	}

	modify(uuid : string) {
		this.router.navigate(["/category", uuid], {queryParams: {modify: true}});
	}

	filter(name : string) : void {
		this.router.navigate(["/"], {queryParams: {category: name}});
	}
}
