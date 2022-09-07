import { Component, ElementRef, NgZone, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { notificationService } from 'src/app/core/services/notofication.service';
import { NgbdSortableHeader } from '../../table-sortable';
import { MapsAPILoader } from '@agm/core';

export type SortDirection = 'asc' | 'desc' | '';
export const compare = (v1:number|string, v2:number|string) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: string|null;
  direction: SortDirection;
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
})

/**
 * Ecomerce merchants component
 */
export class ViewEmployerDetailsComponent implements OnInit {
  
  nonworks=[];
  works=[];
  breadCrumbItems: Array<{}>;
  merchantsData:any={};
  id=''
  
  constructor(private route: ActivatedRoute,private mapsAPILoader: MapsAPILoader,private ngZone: NgZone, private router: Router,private modalService: NgbModal,public notificationService:notificationService,
    private authFackservice: AuthfakeauthenticationService,public formBuilder: FormBuilder) { }

  ngOnInit() {
     this.breadCrumbItems = [{label:'Dashboard',href:'/dashboard'},{label:'Merchants',href:'/merchants'},{label:'Details',active:true}];
  
    this.id = this.route.snapshot.paramMap.get("id")?this.route.snapshot.paramMap.get("id"):'';
   this.getDetails()
   
  }
  getDetails(){
    this.authFackservice.get('admin/fresha_merchants/details?id='+this.id).subscribe(
      res => {
        if(res['status']==true){
          this.merchantsData=res['data'];
        }
      })
   
  }
  approve(event){
    let currentTarget=event;
    //  let currentTarget=event.currentTarget.checked==true?0:1;
    let text='Are you sure to Reject';let confirmButtonText='Yes. Reject it!'
    if(currentTarget==0){
      text='Are you sure to Approve'; confirmButtonText='Yes. Approve it!'
    }
    Swal.fire({
      title: 'Are you sure?',
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: confirmButtonText
    }).then(result => {
      if (result.value) {
      this.authFackservice.put('admin/statusfresha_merchants?value='+currentTarget+'&id='+this.id ,{}).subscribe(
        res => {
          if(res['status']==true){
            if(currentTarget==0)
            Swal.fire('Approved!', 'Selected Merchant has been approved.', 'success');
            else
            Swal.fire('Rejected!', 'Selected Merchant has been rejected.', 'success');
            this.getDetails();
          }
        }); 
      }else this.getDetails();
    }) 
  
  }
}
