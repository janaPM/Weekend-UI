import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { images } from '../../app/constants/image-constants';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';
import { SocketService } from '../../app/services/socket.service';

@Component({
    selector: 'app-chat-conversation',
    templateUrl: './chat-conversation.component.html',
    styleUrl: './chat-conversation.component.scss',
    standalone: false
})
export class ChatConversationComponent {
  public images = images;
  public newMessage: string ='';
  public eventId: string | null = null;
  private apiUrl = environment.URL;
  public messages: any[] = []; // Initialize as an empty array
  private currentUserId: string | null = localStorage.getItem('My_ID'); // Get the current user ID
  limit = 18;  // Number of messages to load per request
  offset = 0;  // Used for pagination
  isLoading = false;
  allMessagesLoaded = false;
  chat = {
    user: {
      name: 'Alex',
      avatar: 'https://via.placeholder.com/50x50?text=A'
    },
    messages: [
      { text: "Hey there! How's your day going?", isSender: false, time: '', profilepicture: "",name:"", user_id:""},
      { text: "Hi Alex! It's going well, thanks for asking. How about yours?", isSender: true, time: '' , profilepicture: "",name:""}
      // { text: 'Pretty good! Just finished work and looking forward to relaxing.', isSender: false , time: '', profilepicture: "",name:""}
    ]
  };

  @ViewChild('chatContainer') chatContainer!: ElementRef;
  constructor(private route: ActivatedRoute, private http: HttpClient, private socketService: SocketService) {}
  ngOnInit() {
    // Retrieve the event_id from the route parameters
    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('eventId'); // Get the event_id
      console.log(`Received eventId: ${this.eventId}`);

      // Fetch messages after getting the eventId
      this.fetchMessages();

      this.socketService.onMessage().subscribe((incoming: any) => {
        if (incoming.event_id === this.eventId) { // 🔥 only push if it matches current chat
          const newMsg = {
            text: incoming.text,
            time: incoming.createdAt || '',
            isSender: incoming.user_id === this.currentUserId,
            profilepicture: incoming.profilepicture || '',
            name: incoming.name || '',
            user_id: incoming.user_id
          };
          this.chat.messages.push(newMsg);
          setTimeout(() => this.scrollToBottom(), 0); // 🔥 auto-scroll
        }
      });
    });
  }

  fetchMessages(loadMore: boolean = false) {
    if (this.isLoading || this.allMessagesLoaded) return;

    const chatContainerElement = this.chatContainer?.nativeElement;
    const previousScrollHeight = chatContainerElement?.scrollHeight || 0; // Save the current scroll height
    const previousScrollTop = chatContainerElement?.scrollTop || 0; // Save the current scroll position
    var firstLoading = this.offset === 0;
    this.isLoading = true;

    this.http.get<any>(`${this.apiUrl}getMessages?event_id=${this.eventId}&limit=${this.limit}&offset=${this.offset}`).subscribe((data) => {
      console.log(JSON.stringify(data));
            
      if (data.length === 0) {
        this.allMessagesLoaded = true; // No more messages
    } else {
        this.offset += this.limit; // Update offset for next batch
        this.messages = loadMore ? [...data, ...this.messages] : data;
    }

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
      this.isLoading = false;
      if (loadMore) {
        // Restore the scroll position after loading more messages
        setTimeout(() => {
          const newScrollHeight = chatContainerElement?.scrollHeight || 0;
          const scrollDifference = newScrollHeight - previousScrollHeight;
          if (chatContainerElement) {
            chatContainerElement.scrollTop = previousScrollTop + scrollDifference;
          }
        }, 0);
      }
      if(firstLoading) {
        setTimeout(() => {
          this.scrollToBottom();
        }, 0);
      }
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

       this.socketService.sendMessage({ ...messageToSend, createdAt: new Date() });

      // Optionally, you can add the message to the local chat messages for immediate display
      // Clear the input field
      this.newMessage = '';
    }, error => {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    });
  }

  onScroll(event: any) {
    const element = event.target; 
    if (element.scrollTop === 0 && !this.isLoading) {
        this.fetchMessages(true);  // Fetch older messages
    }
}
scrollToBottom(): void {
  if (this.chatContainer && this.chatContainer.nativeElement) {
    const container = this.chatContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }
}
}
