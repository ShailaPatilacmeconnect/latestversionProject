import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';

export type SortDirection = 'asc' | 'desc' | '';
export const compare = (v1:number|string, v2:number|string) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
column: string|null;
direction: SortDirection;
}

@Component({
  selector: 'app-merchant-details',
  templateUrl: './merchant-details.component.html',
})
export class MerchantDetailsComponent implements OnInit {
    id;
    breadCrumbItems: Array<{}>;
    data=[]
    constructor(private route: ActivatedRoute,private authFackservice: AuthfakeauthenticationService,){
        this.id=this.route.snapshot.params['id']
    }
    ngOnInit() {
    this.breadCrumbItems = [
        { label: "My Dashboard", href: "/dashboard" },
        { label: "Merchant Details", active: true },
    ];
        
    this.id = (this.route.snapshot.paramMap.get("id"))
        ? this.route.snapshot.paramMap.get("id")
        : "";
        this._fetchData()
    }

    public _fetchData() {
        let url =
          "admin/fresha_amenities?id=" +this.id 
       
        this.authFackservice.get(url).subscribe((res) => {
          if (res["status"] == true) {
            this.data = res["data"];
          }
        });
      }
}