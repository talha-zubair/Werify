import { Component, OnInit } from '@angular/core';
import { Organization } from 'src/app/models/organization';
import { OrganizationService } from 'src/app/services/organization.service';
import { Job } from 'src/app/models/job';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private jobs_count = 0;
  private employers = 0;

  private imageSrc;
  private jobs: Job[];
  private org: Organization;
  constructor(private orgService: OrganizationService) { }

  ngOnInit() {
    this.orgService.orgDetails().subscribe(
      data => {
        this.org = data[0]
        this.imageSrc = "http://localhost:3000/assets/" + this.org.img_path
      },
      err => { console.log(err) }
    );
    this.orgService.GetJobForOrganization().subscribe(
      (data: Job[]) => {
        this.jobs = data["docs"];
      },
      err => { console.log(err) }
    )

    this.orgService.orgCounts().subscribe(
      data => {
        this.jobs_count = data["docs1"];
        this.employers = data["docs2"];
      },
      err => {
        console.log(err);
      }
    )
  }


}
