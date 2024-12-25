import { Component } from '@angular/core';
import { images } from '../../app/constants/image-constants';
@Component({
  selector: 'app-chat-conversation',
  templateUrl: './chat-conversation.component.html',
  styleUrl: './chat-conversation.component.scss'
})
export class ChatConversationComponent {
  public images = images;
  public newMessage: string ='';
  chat = {
    user: {
      name: 'Alex',
      avatar: 'https://via.placeholder.com/50x50?text=A'
    },
    messages: [
      { text: "Hey there! How's your day going?", isSender: false },
      { text: "Hi Alex! It's going well, thanks for asking. How about yours?", isSender: true },
      { text: 'Pretty good! Just finished work and looking forward to relaxing.', isSender: false }
    ]
  };
  sendMessage(){}
}
