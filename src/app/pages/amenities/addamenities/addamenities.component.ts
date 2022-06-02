import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren,NgZone, AfterViewInit, ContentChild, TemplateRef, EventEmitter, Output, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { MapsAPILoader } from '@agm/core';
import { Router } from '@angular/router';
import { NgbdSortableHeader, SortEvent } from '../../table-sortable';
import { notificationService } from "src/app/core/services/notofication.service";

@Component({
  selector: 'app-addamenities',
  templateUrl: './addamenities.component.html',
  styleUrls: ['./addamenities.component.scss']
})

export class AddamenitiesComponent implements OnInit {
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
        amenity_name: this.data.amenity_name,
      });
    }
  }
  initForm() {
    this.typeValidationForm = this.formBuilder.group({
      id: 0,
      amenity_name: [
        "",
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(2),
        ],
      ],
    });
  }
  get f() {
    return this.typeValidationForm.controls;
  }

  typeSubmit() {
    this.typesubmit = true;
    if (this.typeValidationForm.status == "INVALID") return;
    var formData: any = new FormData();
    formData.append("amenity_name", this.typeValidationForm.value.amenity_name);
    let data = this.typeValidationForm.value;

    if (data.id == 0 || data.id == null) {
      this.authFackservice
        .postMultipart("admin/fresha_amenities", formData)
        .subscribe((res) => {
          if (res["status"] == true) {
            this.passEntry.emit();
            Swal.fire("Success!", "New Amenities has been added.", "success");
          } else {
            Swal.fire("Error!", res["message"], "error");
          }
          this.modalService.dismissAll();
        });
    } else {
      formData.append("id", this.typeValidationForm.value.id);
      this.authFackservice
        .putMultipart("admin/fresha_amenities", formData)
        .subscribe((res) => {
          if (res["status"] == true) {
            this.passEntry.emit();
            Swal.fire("Success!", "Selected Amenities has been updated.", "success");
          } else {
            Swal.fire("Error!", res["message"], "error");
          }
          this.modalService.dismissAll();
        });
    }

}
}