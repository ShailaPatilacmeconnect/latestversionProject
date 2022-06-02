import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { first } from 'rxjs/operators';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  submitted = false;
  error = '';
  successmsg = false;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      shop: ['', Validators.required],
      location: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(10),Validators.pattern('^(?=(.*[a-zA-Z]){1,})(?=(.*[!@#$%^&*()_+|~=\`<{}:;’>?,./\"]){1,})(?=(.*[0-9]){1,}).{1,}$')]],
      confirmpwd: ['',Validators.required],    }, {
        validator: this.MustMatch('password', 'confirmpwd'),
      });
  }
  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
  }
  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  /**
   * On submit form
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    } else {
      let formdata=new FormData();
      formdata.append('email',this.f.email.value);
      formdata.append('name',this.f.name.value);
      formdata.append('shop',this.f.shop.value);
      formdata.append('location',this.f.location.value);
      formdata.append('password',this.f.password.value);
      formdata.append('confirmpwd',this.f.confirmpwd.value)
        this.authFackservice.signup(formdata)
          .pipe(first())
          .subscribe(
            data => {
              if(data.status==true){
                Swal.fire('Success', 'Registration was successfull.', 'success');
                this.router.navigate(['/account/login']);
              }
              else
              this.error = data.message;
            },
            error => {
              
            });
    }
  }

}
