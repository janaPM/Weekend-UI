import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgModel } from '@angular/forms';
import { images } from '../../app/constants/image-constants';
import { environment } from '../../../environment';
import { delay } from 'rxjs';
@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.scss'],
    standalone: false
})
export class EventsComponent implements OnInit, OnDestroy {
  // searchQuery: string = '';
  showBottomSheet: boolean = false;
  filterByHashtags: boolean = false;
  filterByPrice: boolean = false;
  filterByRatings: boolean = false;
  selectedFilter: string | null = null; // To track the currently selected filter
  selectedHashtags: string[] = []; // To store selected hashtags
  selectedPrice: string[] = []; // Change to an array for multiple selections
  selectedRating: string[] = []; // Change to an array for multiple selections
  selectedDateRange: string | null = null;
  priceRanges: string[] = ['<200', '200-500', '500-2000', '>2000'];
  ratingRanges: string[] = ['4.5>', '4-4.5', '3.5-4', '<3.5'];
  userLocation: { latitude: number; longitude: number } | null = null;
  private apiUrl = environment.URL;
  isDefaultView: boolean = true;
  public delay: number = 0; 
  sortedEvents: any[] = []; // Store sorted events
  limit = 5;
  offset = 0;
  filters: any;
  loading = false;
  private hasMoreEvents: boolean = true;
  isLoading: boolean = true;
  loadingCards: number[] = new Array(5); // Change 5 to however many loading cards you want
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
  isFilterSelected(): boolean {
    return (
      (this.selectedPrice.length > 0) || // Check if any prices are selected
      (this.selectedDateRange !== null && this.selectedDateRange !== '') || // Check if a date range is selected
      (this.selectedRating.length > 0) || // Check if any ratings are selected
      (this.selectedHashtags.length > 0) // Check if any hashtags are selected
    );
  }
  hashtags: string[] = [
    'Music',
    'Traveling',
    'Cooking',
    'Sports',
    'Gaming',
    'Reading',
    'Fitness',
    'Movies',
    'Art',
    'Photography',
  ];

  // Method to open the bottom sheet
  openFilterOptions() {
    this.showBottomSheet = true;
    // setTimeout(() => {
    //   this.showBottomSheet = true; // Ensure the class is applied after the transition
    // }, 5000);
  }

  // Method to close the bottom sheet
  closeFilterOptions() {
    this.showBottomSheet = false;
    // Reset selections if needed
    // this.resetSelections();
  }
  isBottomSheetVisible() {
    return this.showBottomSheet;
  }
  // Method to select a filter
  async selectFilter(filter: string) {
    this.selectedFilter = filter;
    console.log('selectedFilter'+this.selectedFilter);
  }
  // Method to toggle hashtag selection
  toggleHashtag(hashtag: string) {
    const index = this.selectedHashtags.indexOf(hashtag);
    if (index === -1) {
      this.selectedHashtags.push(hashtag); // Add hashtag if not selected
    } else {
      this.selectedHashtags.splice(index, 1); // Remove hashtag if already selected
    }
  }

  // Method to filter events based on selected options
  filterEvents() {
    this.events = [];
    this.hasMoreEvents = true;
    // this.loading = false;
    // console.log('Search Query:', this.searchQuery);
    console.log('Selected Hashtags:', this.selectedHashtags);
    console.log('Selected Price Range:', this.selectedPrice);
    console.log('selectedDateRange:', this.selectedDateRange);
    console.log('Selected Rating Range:', this.selectedRating);
    // Prepare filter parameters
    this.limit = 5;
    this.offset = 0;
    this.fetchEvents();
    this.closeFilterOptions(); // Close the filter options after searching
  }

  // Method to reset selections
  resetSelections() {
    console.log('selectedHashtags: '+this.selectedHashtags+' selectedPrice: '+this.selectedPrice+' selectedDateRange:'+this.selectedDateRange+' selectedRating: '+this.selectedRating);
    this.selectedFilter = null;
    this.selectedHashtags = [];
    this.selectedPrice = [];
    this.selectedDateRange = null;
    this.selectedRating = [];
    this.events = [];
    this.hasMoreEvents = true;
    this.limit = 5;
    this.offset = 0;
    this.fetchEvents();
    this.closeFilterOptions(); // Close the filter options after searching
  }
  togglePrice(price: string): void {
    console.log("Added togglePrice");
    const index = this.selectedPrice.indexOf(price);
    if (index === -1) {
      this.selectedPrice.push(price);
      console.log(`Added price: ${price}`, this.selectedPrice);
    } else {
      this.selectedPrice.splice(index, 1);
      console.log(`Removed price: ${price}`, this.selectedPrice);
    }
  }
  
  toggleRating(rating: string): void {
    const index = this.selectedRating.indexOf(rating);
    if (index === -1) {
      this.selectedRating.push(rating);
      console.log(`Added rating: ${rating}`, this.selectedRating);
    } else {
      this.selectedRating.splice(index, 1);
      console.log(`Removed rating: ${rating}`, this.selectedRating);
    }
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
    console.log('this.loading'+this.loading);
    if (this.loading || !this.hasMoreEvents) {return;} // Prevent multiple calls
    this.loading = true;
    this.isLoading = true; 
    this.startAutoScroll();
    const UserId = localStorage.getItem('My_ID') || '';
    console.log("Offset:", this.offset);
    // Fetch events with pagination
    
    this.delay = this.offset === 0 ? 1000 : 0;
    
    this.filters = {
      hashtags: this.selectedHashtags,
      priceRange: this.selectedPrice,
      dateRange: this.selectedDateRange,
      ratingRange: this.selectedRating,
    };
    // Stringify filters for GET request
    const filtersString = encodeURIComponent(JSON.stringify(this.filters));
    console.log('filtersString:', filtersString);
    // const filtersString = '%7B%22hashtags%22%3A%5B%5D%2C%22priceRange%22%3A%5B%22%3C200%22%5D%2C%22dateRange%22%3Anull%2C%22ratingRange%22%3A%5B%5D%7D';
    setTimeout(() => {
      console.log('Fetching events with filters:', this.filters);
      this.http.get<any>(`${this.apiUrl}/getAllEvent?ownerId=${UserId}&limit=${this.limit}&offset=${this.offset}&filters=${filtersString}`).subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            this.events.push(...data);

            // this.events = [...this.events, ...data];

            this.offset += this.limit; // Update offset for next call
            this.hasMoreEvents = data.length === this.limit; // Check if there are more events to load
          } else {
              console.log('No more events to load.'); // Log if no more events
              this.hasMoreEvents = false; // Set flag to false when no more events
          }
          this.loading = false; 
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching events data:', error);
          this.isLoading = false;
          this.loading = false; // Reset loading state
        },
      });

    }, this.delay); // Delay of 1 second
}
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
      const windowHeight = window.innerHeight || document.documentElement.offsetHeight;
      const body = document.body;
      const html = document.documentElement;

      const documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
      const windowBottom = windowHeight + window.scrollY;

      // Check if the user has scrolled to the bottom of the page
      if (windowBottom >= documentHeight - 50 && !this.loading && this.hasMoreEvents) { // 50px from the bottom
        console.log('Loading more events'); // Debugging line
        this.fetchEvents(); // Load more events
          console.log('Loading more event done'); // Debugging line
      }
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
      this.http.post(`${this.apiUrl}/updateUser`, this.userData)
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
  trackByEventId(index: number, event: { id: string }): string {
    return event.id; // Return the unique identifier (id)
  }
 }