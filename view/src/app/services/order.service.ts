import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import Order from "../../model/order.model";

@Injectable({
	providedIn: 'root'
})
export class OrderService {

	public baseUrl = environment.apiURL + '/order'

	constructor(private http: HttpClient) {}

	public getOrder(uuid: string): Observable<HttpResponse<Order>> {
		return this.http.get<Order>(this.baseUrl + '/' + uuid, {observe: 'response'});
	}

	public getOrders(): Observable<Order[]> {
		return this.http.get<Order[]>(this.baseUrl);
	}

	public add(OrderDTO: object): Observable<HttpResponse<Order>> {
		return this.http.put<Order>(this.baseUrl, OrderDTO,
			{'headers': {'Content-Type': 'application/json'}, observe: 'response'})
	}

	public update(uuid: string, OrderDTO: object): Observable<HttpResponse<Order>> {
		return this.http.post<Order>(this.baseUrl + '/' + uuid, OrderDTO,
			{'headers': {'Ccontent-Type': 'application/json'}, observe: 'response'})
	}

	public delete(uuid : string) : Observable<HttpResponse<Order>> {
		return this.http.delete<Order>(this.baseUrl + '/' + uuid, {observe: 'response'});
	}
}