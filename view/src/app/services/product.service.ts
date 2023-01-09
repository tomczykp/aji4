import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import Product from "../../model/product.model";

@Injectable({
	providedIn: 'root'
})
export class ProductsService {

	public baseUrl = environment.apiURL + '/product'

	constructor(private http: HttpClient) {}

	public getProduct(uuid: string): Observable<HttpResponse<Product>> {
		return this.http.get<Product>(this.baseUrl + '/' + uuid, {observe: 'response'});
	}

	public getProducts(): Observable<Product[]> {
		return this.http.get<Product[]>(this.baseUrl);
	}

	public addProduct(ProductDTO: object): Observable<HttpResponse<Product>> {
		return this.http.put<Product>(this.baseUrl, ProductDTO,
			{'headers': {'Content-Type': 'application/json'}, observe: 'response'})
	}

	public updateProduct(uuid: string, ProductDTO: object): Observable<HttpResponse<Product>> {
		return this.http.post<Product>(this.baseUrl + '/' + uuid, ProductDTO,
			{'headers': {'Ccontent-Type': 'application/json'}, observe: 'response'})
	}

	public delete(uuid : string) : Observable<HttpResponse<Product>> {
		return this.http.delete<Product>(this.baseUrl + '/' + uuid, {observe: 'response'});
	}
}