import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgModel } from '@angular/forms';
import { images } from '../../app/constants/image-constants';
@Component({
 selector: 'app-events',
 templateUrl: './events.component.html',
 styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  isDefaultView: boolean = true;
  isCreatingEvent: boolean = false; // Track if creating an event
  public images = images;
  public isOpen = false;
  searchQuery: string = ''; // To bind the search input
  newEvent = {
    name: '',
    location: '',
    date: '',
    time: '',
    organizerName: '',
    gender: 'Any',
    age: '',
    image: ''
  }; // Holds the new event data
  filteredNearbyEvents: Array<{
    id: string;
    name: string;
    description: string;
    age: string;
    fee: string;
    image: string;
  }> = []; // To store filtered events
  events: {
    upcomingEvents: Array<{ name: string; image: string }>;
    nearbyEvents: Array<{
      id: string;
      name: string;
      description: string;
      age: string;
      fee: string;
      image: string;
      hastag: string[];
    }>;
  } = {
    upcomingEvents: [],
    nearbyEvents: [],
  };
  forYouEvents: Array<{
    name: string;
    location: string;
    date: string;
    time: string;
    organizerName: string;
    gender: string;
    age: string;
    image: string;
  }> = [];
  constructor(private http: HttpClient, private router: Router) {}
  ngOnInit(): void {
    this.http.get<any>('/assets/eventsdata.json').subscribe({
      next: (data) => {
        this.events = data;
        this.filteredNearbyEvents = data.nearbyEvents; // Initialize filtered events
      },
      error: (error) => {
        console.error('Error fetching events data:', error);
      },
    });
    this.http.get<any>('/assets/forYouEvents.json').subscribe({
      next: (data) => {
        this.forYouEvents = data || [];
      },
      error: (error) => {
        console.error('Error fetching For-You events data:', error);
      },
    });
  }
  switchView(isDefault: boolean): void {
    this.isDefaultView = isDefault;
  }
  viewEvent(id: string): void {
    this.router.navigate(['/event-detail', id]);
  }
  filterEventsCategory(eventName: string){
    console.log('Clicked event name:', eventName);
    this.searchQuery = eventName.toLowerCase();
    this.filterEvents();
  }
  filterEvents(): void {
    const query = this.searchQuery.toLowerCase();
    console.error('query:', query);
    this.filteredNearbyEvents = this.events.nearbyEvents.filter(
      (event) =>
        event.name.toLowerCase().includes(query) || // Match name
        event.description.toLowerCase().includes(query) ||// Optional: Match hashtags/description
        event.hastag?.some((tag) => tag.toLowerCase().includes(query))
    );
    console.error('filteredNearbyEvents:', this.filteredNearbyEvents);
  }
  toggleCreateEvent(): void {
    this.isCreatingEvent = !this.isCreatingEvent;
    this.isOpen = !this.isOpen;
    if (!this.isCreatingEvent) {
      this.resetNewEvent();
    }
  }
  saveEvent(): void {
    if (this.isEventValid()) {
      this.forYouEvents.push({ ...this.newEvent }); // Add to event list
      this.isCreatingEvent = false;
      this.resetNewEvent();
    } else {
      alert('Please fill out all fields!');
    }
  }
  cancelEvent(): void {
    this.isCreatingEvent = false;
    this.resetNewEvent();
  }
  resetNewEvent(): void {
    this.newEvent = {
      name: '',
      location: '',
      date: '',
      time: '',
      organizerName: '',
      gender: 'Any',
      age: '',
      image: ''
    };
  }
  isEventValid(): boolean {
    return (
      this.newEvent.name !== '' &&
      this.newEvent.location !== ''&&
      this.newEvent.date !== '' &&
      this.newEvent.time !== '' &&
      this.newEvent.organizerName !== '' &&
      this.newEvent.image !== ''
    );
  }
 }