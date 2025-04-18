import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.URL); // Make sure this matches your Node.js server
  }

  sendMessage(message: {
    text: string;
    user_id: string | null;
    event_id: string | null;
    createdAt: Date;
  }): void {
    this.socket.emit('chatMessage', message);
  }

  onMessage(): Observable<string> {
    return new Observable(observer => {
      this.socket.off('receive_message'); 
      this.socket.on('receive_message', (data: string) => {
        observer.next(data);
      });
    });
  }
}