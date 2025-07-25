import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule, provideClientHydration } from '@angular/platform-browser';
import { LoginComponent } from '../pages/login/login.component';
import { ProfileComponent } from '../pages/profile/profile.component';
import { ForYouComponent } from '../pages/for-you/for-you.component';
import { FooterComponent } from '../pages/footer/footer.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { LayoutComponent } from '../pages/layout/layout.component';
import { EventsComponent } from '../pages/events/events.component';
import { ChatsComponent } from '../pages/chats/chats.component';
import { EventDetailComponent } from '../pages/event-detail/event-detail.component';
import { ChatConversationComponent } from '../pages/chat-conversation/chat-conversation.component';
import { CalendarComponent } from '../pages/calendar/calendar.component';
import { ScheduleModule, RecurrenceEditorModule, DayService, WeekService, WorkWeekService, MonthService, MonthAgendaService, DragAndDropService, ResizeService } from '@syncfusion/ej2-angular-schedule';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from '../pages/bottom-sheet/bottom-sheet.component';
// import * as Hammer from 'hammerjs';
import { HammerGestureConfig } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewProfileInfoComponent } from '../pages/new-profile-info/new-profile-info.component';
import { NgOtpInputModule } from 'ng-otp-input';

@NgModule({ declarations: [
        AppComponent, LoginComponent, ProfileComponent, ForYouComponent, FooterComponent, LayoutComponent, EventsComponent, ChatsComponent, ChatConversationComponent, EventDetailComponent, CalendarComponent,BottomSheetComponent, NewProfileInfoComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule, NgOtpInputModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        ScheduleModule,
        RecurrenceEditorModule,
        HammerModule,
        MatBottomSheetModule,
        BrowserAnimationsModule], providers: [DayService, WeekService, WorkWeekService, MonthService, MonthAgendaService, DragAndDropService, ResizeService,
        provideClientHydration(), provideHttpClient(withFetch()),
        {
            provide: HammerGestureConfig,
            useFactory: () => {
                return new HammerGestureConfig();
            },
        }, provideHttpClient(withInterceptorsFromDi())] })
export class AppModule {
}
