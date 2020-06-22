import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FeedbacksComponent } from './feedbacks/feedbacks.component';
import { RequestsComponent } from './requests/requests.component';
import { CertificatesComponent } from './certificates/certificates.component';
import { RecipientsComponent } from './recipients/recipients.component';
import { OrganizationsComponent } from './organizations/organizations.component';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [AdminComponent, DashboardComponent, FeedbacksComponent, RequestsComponent, CertificatesComponent, RecipientsComponent, OrganizationsComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgxPaginationModule
  ]
})
export class AdminModule { }
