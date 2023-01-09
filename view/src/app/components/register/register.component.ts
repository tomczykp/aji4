import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

	public registerForm : FormGroup = new FormGroup({
		username: new FormControl('', environment.reqValidation), //Validators.email]),
		password: new FormControl('', environment.lenValidation)
	})

	public failedRegister: boolean = false;
	public registerSuccessful : boolean = false;
	public isPlainPassword : boolean = false;

	constructor(
	  private router: Router,
	  private route: ActivatedRoute,
	  private authService: AuthService){}

  ngOnInit(): void {
	  const params = this.route.snapshot.queryParamMap;
	  this.registerSuccessful = params.has('register-success');
	  this.failedRegister = params.has('register-failed');
  }

	get username() {
		return this.registerForm.get('username');
	}

	get password() {
		return this.registerForm.get('password');
	}

	clearPassword() {
		this.registerForm.get('password')?.reset();
	}

	onSubmit() {
		if (this.registerForm.valid) {
			let username = this.registerForm.getRawValue().username;
			let password = this.registerForm.getRawValue().password;

			this.authService.register(username, password).subscribe({
				next: (result) => {
					if (result.status == 201) {
						this.router.navigate(['/login'], {queryParams: {'register-success': true}});
					} else {
						this.clearPassword();
					}
				},
				error: (_) => {this.failedRegister = true;}
			});
		}
	}
}
