import { Component, OnInit } from '@angular/core';
import { Chat } from 'src/app/models/chat';
import { RecipientService } from 'src/app/services/recipient.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {



  private chats: Chat[] = [];
  constructor(private recService: RecipientService) {
  }

  ngOnInit() {
    this.recService.getChats().subscribe(
      (data: Chat[]) => {
        this.chats = data["docs"];
      },
      err => { console.log(err) }
    )
  }
  pin_chat(chat: Chat) {
    this.recService.pinChat(chat._id).subscribe(
      data => {
        if (data["message"] == "success") {
          Swal.fire('Pinned', 'Chat Pinned Successfully', 'success');
          this.recService.getChats().subscribe(
            (data: Chat[]) => {
              this.chats = data["docs"];
            },
            err => { console.log(err) }
          )
        }
      },
      err => { console.log(err) }
    )
  }

  delete_chat(chat: Chat) {
    this.recService.deleteChat(chat._id).subscribe(
      data => {
        if (data["message"] == "success") {
          Swal.fire('Deleted', 'Chat Deleted Successfully', 'success');
          this.recService.getChats().subscribe(
            (data: Chat[]) => {
              this.chats = data["docs"];
            },
            err => { console.log(err) }
          )
        }
      },
      err => { console.log(err) }
    )
  }

  report_chat(chat: Chat) {
    this.recService.reportChat(chat._id).subscribe(
      data => {
        if (data["message"] == "success") {
          Swal.fire('Reported', 'Chat Reported Successfully', 'success');
        }
      },
      err => { console.log(err) }
    )
  }

}
