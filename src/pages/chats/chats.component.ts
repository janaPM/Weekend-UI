import { Component } from '@angular/core';
import { images } from '../../app/constants/image-constants';
import { Router } from '@angular/router';

interface Chat {
  id: string;
  name: string;
  avatar: string;
  message: string;
}

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss'
})
export class ChatsComponent {
  public images = images;
  constructor(private router: Router) {}
  chats = [
    {
      id: 1,
      name: 'Emily Clark',
      message: 'Hey, how was your day?',
      time: '10:30 AM',
      avatar: 'https://via.placeholder.com/50x50?text=E'
    },
    {
      id: 2,
      name: 'Michael Johnson',
      message: "Can't wait to see you...",
      time: '11:00 AM',
      avatar: 'https://via.placeholder.com/50x50?text=M'
    },
    {
      id: 3,
      name: 'Sophia Brown',
      message: 'Looking forward to our date...',
      time: '12:00 PM',
      avatar: 'https://via.placeholder.com/50x50?text=S'
    },
    {
      id: 4,
      name: 'David Wilson',
      message: 'Do you want to grab coffee?',
      time: '1:00 PM',
      avatar: 'https://via.placeholder.com/50x50?text=D'
    }
  ];
  navigateTo(destination: string) {
    switch (destination) {
      case 'chat-conversation':
        this.router.navigate(['/chat-conversation']);
        console.log(`Navigating to: ${destination}`);
        break;
    }
  }
}
