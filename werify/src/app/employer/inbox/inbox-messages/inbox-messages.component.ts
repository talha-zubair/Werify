import { Component, OnInit } from '@angular/core';

import * as io from 'socket.io-client';
import { Chat } from 'src/app/models/chat';
import { OrganizationService } from 'src/app/services/organization.service';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'src/app/models/message';

@Component({
  selector: 'app-inbox-messages',
  templateUrl: './inbox-messages.component.html',
  styleUrls: ['./inbox-messages.component.css']
})

export class InboxMessagesComponent implements OnInit {
  private socket: any;
  private message = "";
  private chat: Chat;

  constructor(private orgService: OrganizationService, private route: ActivatedRoute) {
    this.socket = io.connect("http://localhost:3000");
  }

  ngOnInit() {
    this.route.params.subscribe(routeParams => {
      var chat_id = routeParams.inbox_id;
      this.orgService.getChat(chat_id).subscribe(
        data => {
          this.chat = data["docs"];
          console.log(this.chat);
          if (this.chat.messages == null) {
            this.chat.messages = [];
          }
        },
        err => {
          console.log(err);
        }
      )
    });

    this.socket.on('mes_from_rec', (data: any) => {
      let sender = data.msg["sender"];
      let reciever = data.msg["reciever"];
      if (sender == this.chat.recipient && reciever == this.chat.organization) {
        var incoming_message = data.msg["message"]["message_text"];
        this.addMessage(incoming_message, "recipient", data.msg["message"]["date"]);
      }
    });
  }
  SendMessage() {
    if (this.message == "") {
      alert("Cannot Send Empty Message");
    } else {

      var date = new Date();
      var date_number = date.getDate();
      var month_number = date.getMonth();
      var year_number = date.getFullYear();
      var minutes = date.getMinutes();
      var hours = date.getHours();
      var date_time = "Date : " + date_number + "-" + month_number + "-" + year_number + " Time : " + hours + ":" + minutes;



      const mes = new Message(null, "organization", this.message, null, "text-message", date_time);
      this.addMessage(mes.message_text, "organization", date_time);
      this.message = "";
      this.socket.emit('mes_from_org', {
        message: mes,
        sender: this.chat.organization,
        reciever: this.chat.recipient,
        chat_id: this.chat._id,
        otoken: localStorage.getItem("Otoken")
      });
    }
  }

  addMessage(text: string, user: string, date_time: string) {
    this.chat.messages.push(new Message(null, user, text, null, "text-message", date_time));
  }

}