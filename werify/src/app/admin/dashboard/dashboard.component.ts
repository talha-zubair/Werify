import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private adminService: AdminService) { }

  private orgs = 0;
  private rec = 0;
  private cert = 0;
  private jobs = 0;
  ngOnInit() {
    this.adminService.GetStats().subscribe(
      data => {
        console.log(data);
        this.orgs = data["org"];
        this.rec = data["rec"];
        this.cert = data["cert"];
        this.jobs = data["job"];
      },
      err => { console.log(err) }
    )
  }
  open() {
    var url = "https://rinkeby.etherscan.io/address/0x5648cf51d75Eaaf7030C3Be3f25f10F2c011edCC";
    window.open(url, "_blank");
  }

}
