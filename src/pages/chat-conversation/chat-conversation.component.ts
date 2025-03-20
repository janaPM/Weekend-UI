import { Component, OnInit } from '@angular/core';
import { images } from '../../app/constants/image-constants';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';
@Component({
  selector: 'app-chat-conversation',
  templateUrl: './chat-conversation.component.html',
  styleUrl: './chat-conversation.component.scss'
})
export class ChatConversationComponent {
  public images = images;
  public newMessage: string ='';
  public eventId: string | null = null;
  private apiUrl = environment.URL;
  public messages: any[] = []; // Initialize as an empty array
  private currentUserId: string | null = localStorage.getItem('My_ID'); // Get the current user ID

  chat = {
    user: {
      name: 'Alex',
      avatar: 'https://via.placeholder.com/50x50?text=A'
    },
    messages: [
      { text: "Hey there! How's your day going?", isSender: false, time: '', profilepicture: "",name:"", user_id:""},
      { text: "Hi Alex! It's going well, thanks for asking. How about yours?", isSender: true, time: '' , profilepicture: "",name:""},
      { text: 'Pretty good! Just finished work and looking forward to relaxing.', isSender: false , time: '', profilepicture: "",name:""}
    ]
  };
  constructor(private route: ActivatedRoute, private http: HttpClient) {}
  ngOnInit() {
    // Retrieve the event_id from the route parameters
    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('eventId'); // Get the event_id
      console.log(`Received eventId: ${this.eventId}`);

      // Fetch messages after getting the eventId
      this.fetchMessages();
    });
  }

  fetchMessages() {
    this.http.get<any>(`${this.apiUrl}getMessages?event_id=${this.eventId}`).subscribe((data) => {
      console.log(JSON.stringify(data));
      this.messages = data; 
      console.log("chatList->" + JSON.stringify(this.messages));

      // Process messages to determine if the current user is the sender
      this.chat.messages = this.messages.map(message => ({
        text: message.message,
        time: message.createdAt,
        isSender: message.user_id === this.currentUserId,
        user_id: message.user_id,
        profilepicture: message.profilepicture,
        name: message.name // Compare user_id with currentUserId
      }));
      console.log("this.chat.messages --"+JSON.stringify(this.chat.messages));
    },
    (error) => {
      console.error('Error fetching requested user data:', error);
      alert('Failed to get requested user data. Please try again.');
    });
  }
  sendMessage() {
    // Check if the input is empty
    if (this.newMessage.trim() === '') {
      return; // Do not send empty messages
    }
  
    // Create a message object to send to the server
    const messageToSend = {
      text: this.newMessage,
      user_id: this.currentUserId,
      event_id: this.eventId,
    };
    console.log("messageToSend-->"+JSON.stringify(messageToSend));
    // Send the message to the server (assuming you have an endpoint for this)
    this.http.post<any>(`${this.apiUrl}sendMessage`, messageToSend).subscribe(response => {
      console.log('Message sent successfully:', response);
      
      // Optionally, you can add the message to the local chat messages for immediate display
      this.chat.messages.push({
        text: this.newMessage,
        time: '',
        isSender: true, 
        profilepicture: "",
        name: ""// Mark this message as sent by the current user
      });
  
      // Clear the input field
      this.newMessage = '';
    }, error => {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    });
  }
}
