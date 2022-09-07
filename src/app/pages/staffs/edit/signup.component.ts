import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { environment } from '../../../../environments/environment';
import { first } from 'rxjs/operators';
import { UserProfileService } from '../../../core/services/user.service';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { MapsAPILoader } from '@agm/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class EditComponent implements OnInit, AfterViewInit {
  @ViewChild('search')  public searchElementRef: ElementRef;
  address='';
  signupForm: FormGroup;
  submitted = false;
  error = '';breadCrumbItems=[]
  successmsg = false;
  merchantsData={}
  id=""
  dataList=[]
  timeZone=[]
  constructor(private formBuilder: FormBuilder,private mapsAPILoader: MapsAPILoader,private ngZone: NgZone, private route: ActivatedRoute, private router: Router,
    private userService: UserProfileService, private authFackservice: AuthfakeauthenticationService) {
      this.id = this.route.snapshot.paramMap.get("id")?this.route.snapshot.paramMap.get("id"):'';
      this.initForm();
    }
    initForm(){
      this.signupForm = this.formBuilder.group({
        business_name: ['', Validators.required],
        Website: ['', [Validators.required,Validators.maxLength(60),Validators.minLength(1)]],
        business_type_id: ['', Validators.required],
        time_zone: ['', [Validators.required]],
        time_format: ['',Validators.required],
        week_start_day_id: ['',Validators.required],    
      })
     }
  ngOnInit() {
    this._fetchData();
    this.getDetails()

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
  getDetails(){
    this.authFackservice.get('admin/fresha_merchants/details?id='+this.id).subscribe(
      res => {
        if(res['status']==true){
          this.merchantsData=res['data'];
          console.log(this.merchantsData)
          this.signupForm.patchValue({
            business_name:this.merchantsData['business_name'],
            business_type_id:String(this.merchantsData['business_type_id']),
            Website:this.merchantsData['Website'],
            time_zone:String(this.merchantsData['time_zone']),
            time_format:this.merchantsData['time_format'],
            week_start_day_id:this.merchantsData['week_start_day_id']
          });
        }
      })
   
  }
  ngAfterViewInit() {
  }
  public _fetchData() {
    let url='app/fresha_businessTypes'
    this.authFackservice.get(url).subscribe(
      res => {
        if(res['status']==true){
          this.dataList =res['data'];
        }
      });
      this.authFackservice.get("app/timezones").subscribe(
        res => {
          if(res['status']==true){
            this.timeZone =res['data'];
          }
        });
    // console.log(this.dataList)
  }
  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  /**
   * On submit form
   */

  onSubmit() {
    this.submitted = true;
    if (this.signupForm.invalid) {
      return;
    } else {
    let formdata= new FormData();
        formdata.append('id',this.id)
        formdata.append('business_name',this.f.business_name.value);
        formdata.append('Website',this.f.Website.value);
        formdata.append('business_type_id',this.f.business_type_id.value);
        formdata.append('time_zone',this.f.time_zone.value);
        formdata.append('time_format',this.f.time_format.value)
        formdata.append('week_start_day_id',this.f.week_start_day_id.value)
      this.authFackservice.putMultipart('admin/fresha_merchants',formdata)
      .pipe(first()).subscribe(
        data => {
          if(data.status==true){
            Swal.fire('Success', 'updated successfully.', 'success');
          }
          else
          {
            Swal.fire('Failed', data.message, 'error');
          }
          // this.error = data.message;
        });
      }
  }
}
