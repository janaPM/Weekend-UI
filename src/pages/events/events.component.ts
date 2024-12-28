import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgModel } from '@angular/forms';
import { images } from '../../app/constants/image-constants';
@Component({
 selector: 'app-events',
 templateUrl: './events.component.html',
 styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit, OnDestroy {
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
  currentIndex: number = 0;
  isDragging = false;
  startX = 0;
  currentTranslate = 0;
  prevTranslate = 0;
  autoScrollInterval: any;
  isHovering = false;
  ngOnDestroy(): void {
    this.stopAutoScroll();
  }
  startAutoScroll(): void {
    this.autoScrollInterval = setInterval(() => {
      if (!this.isHovering) {
        this.moveToNext();
      }
    }, 3000); // Scroll every 3 seconds
  }
  stopAutoScroll(): void {
    clearInterval(this.autoScrollInterval);
  }
  @HostListener('mouseenter', ['$event'])
  onMouseEnter(): void {
    this.isHovering = true;
  }
  @HostListener('mouseleave', ['$event'])
  onMouseLeave(): void {
    this.isHovering = false;
  }
  onTouchStart(event: TouchEvent): void {
    this.isDragging = true;
    this.startX = event.touches[0].clientX;
    this.prevTranslate = this.currentTranslate;
  }
  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging) return;
    const currentX = event.touches[0].clientX;
    this.currentTranslate = this.prevTranslate + currentX - this.startX;
  }
  onTouchEnd(): void {
    this.isDragging = false;
    const threshold = 50; // Minimum swipe distance to change slide
    const movedBy = this.currentTranslate - this.prevTranslate;
    if (movedBy < -threshold) {
      this.moveToNext();
    } else if (movedBy > threshold) {
      this.moveToPrevious();
    } else {
      this.currentTranslate = this.prevTranslate; // Snap back if not enough swipe
    }
    // this.startAutoScroll();
  }
  moveToNext(): void {
    this.currentIndex = (this.currentIndex + 1) % this.events.upcomingEvents.length;
    this.updatePosition();
  }
  moveToPrevious(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.events.upcomingEvents.length) % this.events.upcomingEvents.length;
    this.updatePosition();
  }
  updatePosition(): void {
    this.currentTranslate = -this.currentIndex * 100;
  }
  getTransform(): string {
    return `translateX(${this.currentTranslate}%)`;
  }
  constructor(private http: HttpClient, private router: Router) {}
  ngOnInit(): void {
    this.startAutoScroll();
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
    this.isHovering = false;
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
    this.isHovering = false;
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