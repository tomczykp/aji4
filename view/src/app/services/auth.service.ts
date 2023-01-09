import {BehaviorSubject} from "rxjs";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {LoginResponse} from "../../model/login.response";

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	authenticated = new BehaviorSubject(false);

	constructor(
		private http: HttpClient,
		private router: Router) {
		if (localStorage.getItem("username") != null) {
			this.authenticated.next(true);
		}

		window.addEventListener('storage', (event) => {
			if (event.storageArea == localStorage) {
				let token = localStorage.getItem('jwt');
				if(token == undefined) {
					window.location.href = '/login';
				}
			}
		}, false);
	}

	login(username: string, password: string) {
		return this.http.post<LoginResponse>(`${environment.apiURL}/login`,
			{username, password},
			{headers: {'Content-Type': 'application/json'}, observe: 'response'});
	}

	saveUserData(result: any) {
		localStorage.setItem("username", result.body.username.toLowerCase());
		localStorage.setItem("jwt", result.body.jwt);
		localStorage.setItem("role", result.body.role.toLowerCase());
		localStorage.setItem("uuid", result.body.id.toLowerCase());
	}

	register(username: string, password: string) {
		return this.http.post(`${environment.apiURL}/register`, {username, password}, {observe: 'response'})
	}

	logout() {

		this.http.delete(environment.apiURL + "/logout")
			.subscribe({
				next: (_) => {
					this.clearUserData();
					this.authenticated.next(false);
					this.router.navigate(['/login'], {queryParams: {'logout-success': true}});
				}
			});
	}


	getRole() : string {
		return localStorage.getItem("role") ? localStorage.getItem("role") as string : "";
	}

	getUsername() : string {
		return localStorage.getItem("username") ? localStorage.getItem("username") as string : "";
	}

	getUUID() : string {
		return localStorage.getItem("uuid") ? localStorage.getItem("uuid") as string : "";
	}

	getJwtToken() {
		return localStorage.getItem("jwt");
	}

	clearUserData() {
		localStorage.removeItem("role");
		localStorage.removeItem("username");
		localStorage.removeItem("uuid");
		localStorage.removeItem("jwt");
	}

}