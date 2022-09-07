import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { notificationService } from 'src/app/core/services/notofication.service';
import { NgbdSortableHeader } from '../table-sortable';


export type SortDirection = 'asc' | 'desc' | '';
export const compare = (v1:number|string, v2:number|string) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
column: string|null;
direction: SortDirection;
}

@Component({
  selector: 'app-merchant-list',
  templateUrl: './merchant-list.component.html',
})
export class MerchantListComponent implements OnInit {
  page = { totalElements: 0, pageNumber: 1, size: 10 };
  sortBy = "";
  order = "";

  breadCrumbItems: Array<{}>;
  dataList: any = [];
  hrefLink: any;
  blob: Blob;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader> =
    Object.create(null);
  title = "Add";
  keyword: string = "";
  constructor(
    private modalService: NgbModal,
    public notificationService: notificationService,
    private authFackservice: AuthfakeauthenticationService,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "My Dashboard", href: "/dashboard" },
      { label: "Merchant List", active: true },
    ];
    this._fetchData();


  }
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = "";
      }
    });
    if (direction === "") {
      this.order = "";
      this.sortBy = "";
      this._fetchData();
    } else {
      this.order = direction;
      this.sortBy = column;
      this._fetchData();
    }
  }
  search() {
    this.page.pageNumber = 1;
    this._fetchData();
  }


  public _fetchData() {
    let url =
      "admin/fresha_amenities?page=" +
      this.page.pageNumber +
      "&perPage=" +
      this.page.size +
      "&keyword=" +
      this.keyword;
    if (this.sortBy != "" && this.order != "") {
      url += "&sortBy=" + this.sortBy + "&order=" + this.order;
    }
    this.authFackservice.get(url).subscribe((res) => {
      if (res["status"] == true) {
        this.dataList = res["data"];
        this.page.totalElements = res["elementCount"];
      }
    });
  }
  
  toggleFunction(event, id) {
    let currentTarget = event.currentTarget.checked == true ? 0 : 1;
    let text = "Are you sure to Disable";
    let confirmButtonText = "Yes. Disable it!";
    if (currentTarget == 0) {
      text = "Are you sure to enable";
      confirmButtonText = "Yes. Enable it!";
    }
    Swal.fire({
      title: "Are you sure?",
      text: text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: confirmButtonText,
    }).then((result) => {
      if (result.value) {
        this.authFackservice
          .put(
            "admin/statusfresha_amenities?value=" +
              currentTarget +
              "&id=" +
              id,
            {}
          )
          .subscribe((res) => {
            if (res["status"] == true) {
              if (currentTarget == 0)
                Swal.fire(
                  "Enabled!",
                  "Selected merchant has been enaled.",
                  "success"
                );
              else
                Swal.fire(
                  "Disabled!",
                  "Selected merchant has been disabled.",
                  "success"
                );
              this._fetchData();
            }
          });
      } else this._fetchData();
    });
  }
  sorting() {
    if (this.sortBy != "" && this.order != "") {
      this._fetchData();
    }
  }
  pageChange() {
    this._fetchData();
  }
  pageCopy() {
    return { ...this.page };
  }

  changePage(event) {
    this.page.pageNumber = event;
    this._fetchData();
  }

}
