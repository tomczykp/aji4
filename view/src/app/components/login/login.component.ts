import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {environment} from "../../../environments/environment";

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

	loginForm = new FormGroup({
		username: new FormControl('', environment.reqValidation), //Validators.email]),
		password: new FormControl('', environment.lenValidation)
	})

	wrongCredentials : boolean = false;
	registerSuccessful : boolean = false;
	logoutSuccessful : boolean = false;
	sessionExpired : boolean = false;
	isPlainPassword : boolean = false;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private authService: AuthService
	) {
	}

	get username() {
		return this.loginForm.get('username');
	}

	get password() {
		return this.loginForm.get('password');
	}

	ngOnInit(): void {
		const params = this.route.snapshot.queryParamMap;
		this.logoutSuccessful = params.has('logout-success');
		this.registerSuccessful = params.has('register-success');
		this.wrongCredentials = params.has("login-failed");
		this.sessionExpired = params.has('session-expired');
	}

	clearPassword() {
		this.loginForm.get('password')?.reset();
	}

	onSubmit() {
		if (this.loginForm.valid) {

			const username : string = <string>this.loginForm.getRawValue().username;
			const password : string = <string>this.loginForm.getRawValue().password;

			this.authService.login(username.toString(), password.toString()).subscribe({
				next: (result) => {
					if (result.status == 200) {
						this.authService.saveUserData(result)
						this.authService.authenticated.next(true);
						this.router.navigate(['/']);
					}
				},
				error: (error) => {
					this.authService.clearUserData();
					this.authService.authenticated.next(false);
					this.clearPassword();

					if (error.status === 401 || error.status == 404) {
						this.wrongCredentials = true;
					}

					this.registerSuccessful = false;
					this.logoutSuccessful = false;
					this.sessionExpired = false;
				}
			});
		}
	}


}
