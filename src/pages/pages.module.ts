import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { FooterComponent } from './footer/footer.component';
import { ForYouComponent } from './for-you/for-you.component';
import { LayoutComponent } from './layout/layout.component';
import { EventsComponent } from './events/events.component';
import { ChatsComponent } from './chats/chats.component';
import { ChatConversationComponent } from './chat-conversation/chat-conversation.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { CalendarComponent } from './calendar/calendar.component';



@NgModule({
  declarations: [
    LoginComponent,
    ProfileComponent,
    FooterComponent,
    LayoutComponent,
    EventsComponent,
    ChatsComponent,
    ChatConversationComponent,
    EventDetailComponent,
    CalendarComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PagesModule { }