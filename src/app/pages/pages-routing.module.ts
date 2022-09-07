import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AmenitiesComponent } from './amenities/amenities.component';
import { BusinesstypeComponent } from './businesstype/businesstype.component';

import { DefaultComponent } from './dashboards/default/default.component';
import { EditComponent } from './staffs/edit/signup.component';
import { ViewEmployerDetailsComponent } from './staffs/view/view.component';
import { StaffsComponent } from './staffs/staffs.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DefaultComponent },
  { path: 'amenities', component: AmenitiesComponent },
  { path: 'businesstype', component: BusinesstypeComponent },
  { path:'merchants',component:StaffsComponent},
  { path:'merchants/edit/:id',component:EditComponent},
  { path:'merchants/:id',component:ViewEmployerDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
