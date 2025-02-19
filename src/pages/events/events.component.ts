import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgModel } from '@angular/forms';
import { images } from '../../app/constants/image-constants';
import { environment } from '../../../environment';
@Component({
 selector: 'app-events',
 templateUrl: './events.component.html',
 styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit, OnDestroy {
  userLocation: { latitude: number; longitude: number } | null = null;
  private apiUrl = environment.URL;
  isDefaultView: boolean = true;
  isCreatingEvent: boolean = false; // Track if creating an event
  public images = images;
  public isOpen = false;
  searchQuery: string = ''; // To bind the search input
  UserId: any;
  events: Array<{
    id: string;
    name: string;
    description: string;
    startTime: string;
    age: string;
    fee: any;
    location_url: string;
    image: string;
    location: string;
    hashtag?: string[]; // Ensure this is an array of strings
  }> = [];
  
  filteredEvents: Array<{
    id: string;
    name: string;
    description: string;
    startTime: string;
    age: string;
    fee: any;
    location_url: string;
    image: string;
    location: string;
    hashtag?: string[];
  }> = [];
  
  newEvent = {
    id: '',
    name: '',
    description: '',
    location: '',
    date: '',
    time: '',
    startTime: '',
    organizerName: '',
    gender: 'Any',
    age: '',
    fee: '',
    location_url: '',
    image: '',
    hashtag: [] // Change this to an array of strings
  };
  userData = {
    id: '' as any, // Replace with the actual user ID
    // name: '',
    // bio: '',
    // work: '',
    // education: '',
    // gender: '',
    // location: '',
    // hometown: '',
    // height: null,
    // exercise: '',
    // educationLevel: '',
    // interest: [], // Adjust based on your requirements
    latitude: null as number | null, // Allow latitude to be a number or null
    longitude: null as number | null, // Allow longitude to be a number or null
  };

  currentIndex: number = 0;
  isDragging = false;
  startX = 0;
  currentTranslate = 0;
  prevTranslate = 0;
  autoScrollInterval: any;
  isHovering = false;

  ngOnInit(): void {
    this.fetchEvents();
    this.getUserLocation();
    }
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
    // this.currentIndex = (this.currentIndex + 1) % this.events.upcomingEvents.length;
    this.updatePosition();
  }
  moveToPrevious(): void {
    // this.currentIndex = (this.currentIndex - 1 + this.events.upcomingEvents.length) % this.events.upcomingEvents.length;
    this.updatePosition();
  }
  updatePosition(): void {
    this.currentTranslate = -this.currentIndex * 100;
  }
  getTransform(): string {
    return `translateX(${this.currentTranslate}%)`;
  }
  constructor(private http: HttpClient, private router: Router) {}
  fetchEvents(): void {
    this.startAutoScroll();
    const UserId = localStorage.getItem('My_ID') || '';
    this.http.get<any>(`${this.apiUrl}getAllEvent?ownerId=${UserId}`).subscribe({
      next: (data) => {
        this.events = data;
        this.filteredEvents = data; // Initialize filtered events
        console.log(JSON.stringify(this.filteredEvents));
      },
      error: (error) => {
        console.error('Error fetching events data:', error);
      },
    });
    this.http.get<any>('/assets/forYouEvents.json').subscribe({
      next: (data) => {
        // this.forYouEvents = data || [];
      },
      error: (error) => {
        console.error('Error fetching For-You events data:', error);
      },
    });
  }
  getUserLocation() {
    const UserId = localStorage.getItem('My_ID'); 
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          console.log('User location:', this.userLocation);
          
          // Update userData with the retrieved location
          this.userData.id = UserId;
          this.userData.latitude = this.userLocation.latitude;
          this.userData.longitude = this.userLocation.longitude;

          // Send user data including location to the backend
          this.sendUserLocation();
        },
        (error) => {
          console.error('Error getting location:', error);
          // Handle errors here (e.g., show a message to the user)
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      // Handle the case where geolocation is not supported
    }
  }
  sendUserLocation() {
    if (this.userLocation) {
      console.log("this.userData++"+JSON.stringify(this.userData));
      this.http.post(`${this.apiUrl}updateUser`, this.userData)
        .subscribe(
          response => {
            console.log('Location sent successfully:', response);
          },
          error => {
            console.error('Error sending location:', error);
          }
        );
    }
  }
  formatDateTime(dateTimeString: string): string {
    const dateObj = new Date(dateTimeString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short', // Use 'short', 'long', or 'narrow'
      day: 'numeric',
      month: 'short', // Use 'short', 'long', or 'narrow'
      year: 'numeric'
    };
    const formattedDate = dateObj.toLocaleDateString('en-US', options);
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    const formattedTime = dateObj.toLocaleTimeString('en-US', timeOptions);
    return `${formattedDate}\n${formattedTime}`;
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
    this.filteredEvents = this.events.filter(
      (event) =>
        event.name.toLowerCase().includes(query) || // Match name
        event.description.toLowerCase().includes(query) ||// Optional: Match hashtags/description
        event.hashtag?.some((tag) => tag.toLowerCase().includes(query))
    );
    console.error('filteredNearbyEvents:', this.filteredEvents);
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
    this.events.push({ ...this.newEvent }); // Add to events list
    this.filteredEvents = [...this.events]; // Update filtered list
    this.isCreatingEvent = false;
    this.resetNewEvent();
    } else {
    alert('Please fill out all required fields!');
    }
    }
  cancelEvent(): void {
    this.isCreatingEvent = false;
    this.resetNewEvent();
  }
  resetNewEvent(): void {
    this.newEvent = {
      id:'',
      name: '',
      description:'',
      location: '',
      date: '',
      time: '',
      startTime:'',
      organizerName: '',
      gender: 'Any',
      age: '',
      fee: '',
      location_url:'',
      image: '',
      hashtag:[]
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