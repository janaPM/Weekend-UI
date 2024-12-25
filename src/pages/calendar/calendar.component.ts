import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { ScheduleModule, RecurrenceEditorModule, DayService, WeekService, WorkWeekService, MonthService, MonthAgendaService } from '@syncfusion/ej2-angular-schedule';
import { View, EventSettingsModel } from '@syncfusion/ej2-angular-schedule';

interface Event {
  id: string;
  name: string;
  description: string;
  image: string;
  age: string;
  time: string;
  address: string;
  fee: string;
  hastag: string[];
  profiles: string[];
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})

export class CalendarComponent implements OnInit {
  public eventSettings: EventSettingsModel = {
    dataSource: [] // Initialize with an empty array
  };
  public selectedDate: Date = new Date(); // Set default date to today
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.http.get<any>('/assets/eventsdata.json').subscribe({
      next: (data) => {
        const filteredEvents = data.nearbyEvents.filter((event: any) =>
          event.profiles?.includes("WND00000001")
        );
        // Map the filtered events to the Syncfusion format
        this.eventSettings = {
          dataSource: filteredEvents.map((event: any) => ({
            Id: event.id,
            Subject: event.name,
            StartTime: new Date(event.startTime),
            EndTime: new Date(event.endTime),
            // IsBlock: true,
            Location: event.address,
            Description: event.description
          }))
        };
        console.log("eventSettings--->"+ JSON.stringify(this.eventSettings));
      },
      error: (err) => {
        console.error('Error loading events data:', err);
      }
    });
  }
 }
