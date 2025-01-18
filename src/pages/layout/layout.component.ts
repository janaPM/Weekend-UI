import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  isChatConversation = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isChatConversation = event.urlAfterRedirects === '/chat-conversation' || event.urlAfterRedirects.startsWith('/login') || event.urlAfterRedirects.startsWith('/new');
        console.log("event.urlAfterRedirects == '/chat-conversation'"+event.urlAfterRedirects);
      }
    });
  }
}
