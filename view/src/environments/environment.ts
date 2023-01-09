import {Validators} from "@angular/forms";

export const environment = {
  production: false,
  apiURL: "http://localhost:3000",
	lenValidation: [Validators.required, Validators.minLength(4), Validators.maxLength(20)],
	reqValidation: [Validators.required],
	posNumValidation: [Validators.required, Validators.pattern("([1-9][0-9]*[.0-9]*)|(0.[0-9]*[1-9]+)")]
};
