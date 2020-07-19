import { Component, OnInit } from '@angular/core';
import { RecipientService } from 'src/app/services/recipient.service';
import { Recipient } from 'src/app/models/recipient';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  rec: Recipient;
  imageSrc;
  file: File;
  newDate: string;
  emailStatus: boolean;

  fields = ["Engineering", "Business", "Computer", "Marketing", "Medical"];
  constructor(private recService: RecipientService, private router: Router) { }

  ngOnInit() {
    this.rec = null;
    this.recService.recipientDetails(localStorage.getItem("Rusername")).subscribe(
      data => {
        this.rec = data[0];
        if (this.rec.dob) {
          var d = new Date(this.rec.dob)
          var year = "" + d.getFullYear();
          var month = "" + (d.getMonth() + 1);
          var day = "" + d.getDate();
          if (d.getMonth() + 1 < 10) {
            month = "0" + (d.getMonth() + 1);
          }
          if (d.getDate() < 10) {
            day = "0" + d.getDate();
          }
          console.log(year + "-" + month + "-" + day);
          this.newDate = year + "-" + month + "-" + day;
        }
        if (this.rec.img_path) {
          this.imageSrc = "http://localhost:3000/assets/" + this.rec.img_path;
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
      this.rec.dob = new Date(this.newDate);
      console.log(this.rec.dob);
      var data = new FormData();
      if (this.file) {
        data.append('file', this.file, this.file.name);
      }
      data.append('rec', JSON.stringify(this.rec));
      console.log(this.rec);
      this.recService.updateRecipient(data).subscribe(
        data => {
          if (data['message'] == "success") {
            Swal.fire('Updated', 'Profile Uploaded Successfully', 'success');
            this.router.routeReuseStrategy.shouldReuseRoute = function () {
              return false;
            };
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
