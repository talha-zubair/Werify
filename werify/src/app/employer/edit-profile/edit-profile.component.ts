import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { OrganizationService } from 'src/app/services/organization.service';
import { Organization } from 'src/app/models/organization';
import { Router } from '@angular/router';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  org: Organization;
  imageSrc;
  file: File;
  newDate: string;
  emailStatus: boolean;
  constructor(private orgService: OrganizationService, private router: Router) { }

  ngOnInit() {
    this.org = null;
    this.orgService.orgDetails().subscribe(
      data => {
        this.org = data[0];
        if (this.org.creation_date) {
          var d = new Date(this.org.creation_date)
          var year = "" + d.getFullYear();
          var month = "" + (d.getMonth() + 1);
          var day = "" + d.getDate();
          if (d.getMonth() + 1 < 10) {
            month = "0" + (d.getMonth() + 1);
          }
          if (d.getDate() < 10) {
            day = "0" + d.getDate();
          }
          this.newDate = year + "-" + month + "-" + day;
        }
        if (this.org.img_path) {
          this.imageSrc = "http://localhost:3000/assets/" + this.org.img_path;
        }
      },
      err => {
        console.log(err)
      }
    );
  }

  onSubmit() {
    if (!this.imageSrc) {
      Swal.fire('No File Selected', 'Please Select a File Also', 'error');
    } else {
      this.org.creation_date = new Date(this.newDate);
      console.log(this.org.creation_date);
      var data = new FormData();
      if (this.file) {
        data.append('file', this.file, this.file.name);
      }
      data.append('org', JSON.stringify(this.org));
      console.log(this.org);
      this.orgService.updateOrganization(data).subscribe(
        data => {
          if (data['message'] == "success") {
            Swal.fire('Updated', 'Profile Uploaded Successfully', 'success');
            this.router.navigate(['/employer/'.concat(localStorage.getItem("Ousername"))]);
          }
        },
        err => console.log(err)
      );
    }
  }

  onFileSelected($event) {
    this.file = $event.target.files[0];
    const reader = new FileReader();
    reader.onload = e => this.imageSrc = reader.result;
    reader.readAsDataURL(this.file);
  }


}
