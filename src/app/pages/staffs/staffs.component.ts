import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { notificationService } from 'src/app/core/services/notofication.service';
import Swal from 'sweetalert2';
import { NgbdSortableHeader } from '../table-sortable';
export type SortDirection = 'asc' | 'desc' | '';
export const compare = (v1:number|string, v2:number|string) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
export interface SortEvent {
  column: string|null;
  direction: SortDirection;
}
@Component({
  selector: 'app-staffs',
  templateUrl: './staffs.component.html',
})

/**
 * Ecomerce merchants component
 */
export class StaffsComponent implements OnInit {

  // bread crumb items
  elementCount=0;
  currentpage=1;
  page={totalElements:0,pageNumber:1,size:10};
  breadCrumbItems: Array<{}>;
  typeValidationForm: FormGroup; // type validation form
  typesubmit: boolean=false;
  merchantsData:any=[];
  sortBy='';
  order='';
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>=Object.create(null);
  title='Add';
  keyword: string='';
  image: string;
  constructor( private router: Router,private modalService: NgbModal,public notificationService:notificationService,
    private authFackservice: AuthfakeauthenticationService,public formBuilder: FormBuilder) { }
  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Dashboard', link:'/dashboard' },{ label: 'Merchants', active: true }];
    this.currentpage = 1;
    this._fetchData();
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
  search(){
    this.currentpage=1;
    this.page.pageNumber=1;
    this._fetchData()
  }
  public _fetchData() {
    this.authFackservice.get('admin/fresha_merchants?page='+this.page.pageNumber+'&perPage=10&keyword='+this.keyword).subscribe(
      res => {
        if(res['status']==true){
          this.merchantsData =res['data'];
          this.elementCount=res['elementCount']
          this.page.totalElements=res['elementCount']
        }
      });
  }
  toggleFunction(event,id){
      let currentTarget=event.currentTarget.checked==true?0:1;
  
      this.authFackservice.put('admin/statusfresha_merchants?value='+currentTarget+'&id='+id ,{}).subscribe(
        res => {
          if(res['status']==true){
            if(currentTarget==0)
            Swal.fire('Approved!', 'Selected Merchant has been Enabled.', 'success');
            else
            Swal.fire('Rejected!', 'Selected Merchant has been Disabled.', 'success');
            this._fetchData();
          }
        }); 
  
  }
  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    if (direction === '') {  
      this.order='';this.sortBy=''; this._fetchData();
    } else {
      this.order=direction;this.sortBy=column
      this._fetchData();
    }
  } 
  pageChange(){
    this._fetchData();
  }
  pageCopy(){
    return {...this.page}
 }
  changePage(event){
    this.page.pageNumber=event;
    this._fetchData()
  }
 
}
