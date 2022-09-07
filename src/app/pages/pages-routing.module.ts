import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AmenitiesComponent } from './amenities/amenities.component';
import { BusinesstypeComponent } from './businesstype/businesstype.component';

import { DefaultComponent } from './dashboards/default/default.component';
import { MerchantDetailsComponent } from './merchant-list/merchant-details.component';
import { MerchantListComponent } from './merchant-list/merchant-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DefaultComponent },
  { path: 'amenities', component: AmenitiesComponent },
  { path: 'businesstype', component: BusinesstypeComponent },
  { path: 'merchant-list', component: MerchantListComponent },
  { path: 'merchant-list/:id', component: MerchantDetailsComponent },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
