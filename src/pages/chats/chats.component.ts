import { Component, OnInit } from '@angular/core';
import { images } from '../../app/constants/image-constants';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';
interface Chat {
  id: string;
  name: string;
  avatar: string;
  message: string;
}

@Component({
    selector: 'app-chats',
    templateUrl: './chats.component.html',
    styleUrl: './chats.component.scss',
    standalone: false
})
export class ChatsComponent implements OnInit{
  public images = images;
  private apiUrl = environment.URL;
  chatList: any;
  constructor(private router: Router, private http: HttpClient) {}
  ngOnInit() {
    const UserId = localStorage.getItem('My_ID'); 
    this.http.get<any>(`${this.apiUrl}getMyChatList?id=${UserId}`).subscribe((data) => {
      console.log(JSON.stringify(data));
      this.chatList = data; 
      console.log("chatList->"+JSON.stringify(this.chatList));
    }
    ,(error) => {
      console.error('Error fetching requested user data:', error);
      alert('Failed to get requested user data. Please try again.');
    });
  }
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
  navigateTo(destination: string, eventId?: string) {
    switch (destination) {
      case 'chat-conversation':
        this.router.navigate(['/chat-conversation', { eventId }]);
        console.log(`Navigating to: ${destination} with eventId: ${eventId}`);
        break;
    }
  }
  formatTime(createdAt: string): string {
    const messageDate = new Date(createdAt);
    const now = new Date();
    const timeDiff = now.getTime() - messageDate.getTime();
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return days === 1 ? 'Yesterday' : `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 0) {
      return `${minutes} minutes ago`;
    } else {
      return 'Just now';
    }
  }
}
