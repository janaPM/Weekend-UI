import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from '../pages/profile/profile.component';
import { ForYouComponent } from '../pages/for-you/for-you.component';
import { LayoutComponent } from '../pages/layout/layout.component';
import { EventsComponent } from '../pages/events/events.component';
import { ChatsComponent } from '../pages/chats/chats.component';
import { ChatConversationComponent } from '../pages/chat-conversation/chat-conversation.component';
import { EventDetailComponent } from '../pages/event-detail/event-detail.component';
import { combineLatest } from 'rxjs';
import { CalendarComponent } from '../pages/calendar/calendar.component';
import { LoginComponent } from '../pages/login/login.component';
import { NewProfileInfoComponent } from '../pages/new-profile-info/new-profile-info.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent},
      { path: 'for-you', component: ForYouComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'events', component: EventsComponent},
      { path: 'chats', component: ChatsComponent},
      { path: 'chat-conversation', component: ChatConversationComponent},
      { path: 'event-detail/:id', component: EventDetailComponent},
      { path: 'calendar', component: CalendarComponent},
      { path: 'new', component: NewProfileInfoComponent},
      { path: 'app-new-profile-info', component: NewProfileInfoComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
