import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren,NgZone, AfterViewInit, ContentChild, TemplateRef, EventEmitter, Output, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { MapsAPILoader } from '@agm/core';
import { Router } from '@angular/router';
import { notificationService } from "src/app/core/services/notofication.service";
import { NgbdSortableHeader } from '../table-sortable';

@Component({
  selector: 'app-addbusinesstype',
  templateUrl: './addbusinesstype.component.html',

})

export class AddbusinesstypeComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @Input() public data;
  @Input() public title;

  typeValidationForm: FormGroup; // type validation form
  typesubmit: boolean = false;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader> =
    Object.create(null);
  keyword: string = "";
  constructor(
    private router: Router,
    private modalService: NgbModal,
    public notificationService: notificationService,
    private authFackservice: AuthfakeauthenticationService,
    public formBuilder: FormBuilder,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.initForm();
    this.typesubmit = false;
    

    if (this.data) {
      console.log(this.data.name);
      this.typeValidationForm.patchValue({
        id: this.data.id,
        businesstype_name: this.data.businesstype_name,
      });
    }
  }
  initForm() {
    this.typeValidationForm = this.formBuilder.group({
      id: 0,
      businesstype_name:['', [Validators.required]],
      
    });
  }
  get f() {
    return this.typeValidationForm.controls;
  }

  typeSubmit() {
    this.typesubmit = true;
    if (this.typeValidationForm.status == "INVALID") return;
    var formData: any = new FormData();
    formData.append("businesstype_name", this.typeValidationForm.value.businesstype_name);
    

    let data = this.typeValidationForm.value;

    if (data.id == 0 || data.id == null) {
      this.authFackservice
        .postMultipart("admin/fresha_businesstypes", formData)
        .subscribe((res) => {
          if (res["status"] == true) {
            this.passEntry.emit();
            Swal.fire("Success!", "New Business Type has been added.", "success");
          } else {
            Swal.fire("Error!", res["message"], "error");
          }
          this.modalService.dismissAll();
        });
    } else {
      formData.append("id", this.typeValidationForm.value.id);
      this.authFackservice
        .putMultipart("admin/fresha_businesstypes", formData)
        .subscribe((res) => {
          if (res["status"] == true) {
            this.passEntry.emit();
            Swal.fire("Success!", "Selected Business Type has been updated.", "success");
          } else {
            Swal.fire("Error!", res["message"], "error");
          }
          this.modalService.dismissAll();
        });
    }

}
}