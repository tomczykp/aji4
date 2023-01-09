import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import Category from "../../model/category.model";

@Injectable({
	providedIn: 'root'
})
export default class CategoryService {
	public baseUrl = environment.apiURL + '/category'

	constructor(private http: HttpClient) {}

	public getCategory(uuid: string): Observable<HttpResponse<Category>> {
		return this.http.get<Category>(this.baseUrl + '/' + uuid, {observe: 'response'});
	}

	public getCategories(): Observable<HttpResponse<Category[]>> {
		return this.http.get<Category[]>(this.baseUrl, {observe: 'response'});
	}

	public addCategory(CategoryDTO: object): Observable<HttpResponse<Category>> {
		return this.http.put<Category>(this.baseUrl, CategoryDTO,
			{'headers': {'Content-Type': 'application/json'}, observe: 'response'})
	}

	public updateCategory(uuid: string, CategoryDTO: object): Observable<HttpResponse<Category>> {
		return this.http.post<Category>(this.baseUrl + '/' + uuid, CategoryDTO,
			{'headers': {'Ccontent-Type': 'application/json'}, observe: 'response'});
	}

	public deleteCategory(uuid : string) : Observable<HttpResponse<Category>> {
		return this.http.delete<Category>(this.baseUrl + '/' + uuid, {observe: 'response'});
	}
}