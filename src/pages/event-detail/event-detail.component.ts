import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Console } from 'node:console';
import { images } from '../../app/constants/image-constants';
import { environment } from '../../../environment';
@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class EventDetailComponent implements OnInit {
  // public user = [
  //   {id: "WND00000001"}
  // ];
  private apiUrl = environment.URL;
  public images = images;
  user: any;
  id: string = 'WND00000001';
  event: any;
  bioItems = [{ key: 'bio', title: 'Bio', icon: './../../assets/bio.png' }];
  aboutItems = [
    { key: 'work', title: 'Work', icon: './../../assets/work.png' },
    {
      key: 'education',
      title: 'Education',
      icon: './../../assets/education.png',
    },
    { key: 'gender', title: 'Gender', icon: './../../assets/gender.png' },
    { key: 'location', title: 'Location', icon: './../../assets/location.png' },
    { key: 'hometown', title: 'Hometown', icon: './../../assets/location.png' },
  ];
  moreItems = [
    { key: 'height', title: 'Height', icon: './../../assets/height.png' },
    { key: 'exercise', title: 'Exercise', icon: './../../assets/exercise.png' },
    {
      key: 'educationLevel',
      title: 'Education level',
      icon: './../../assets/education.png',
    },
  ];
  profileIds = [
    '1',
    'cacd8ee9-8082-4ad8-b5d5-a8534f8d0903',
    '1ghgjkhv-gvhjnk4567',
    '54e7eab8-e741-4af3-b690-053697933a8e',
  ]; // List of profile IDs
  // profileIds = ['1'];
  profiles: any[] = []; // To store fetched profile data
  swipeableProfiles: any[] = [];
  showSwipableProfiles = false;
  activeIndex: number | null = null;
  startX = 0;
  startY = 0;
  currentTranslateX = 0;
  currentTranslateY = 0;
  currentRotation = 0;
  isDragging = false;
  swipeThreshold = 150; // Adjust threshold for complete swipe distance
  showBuddyOptions() {
    this.showSwipableProfiles = true;
  }
  onTouchStart(event: TouchEvent, index: number) {
    this.activeIndex = index;
    this.startX = event.touches[0].clientX;
    this.startY = event.touches[0].clientY;
    this.isDragging = true;
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging) return;
    const currentX = event.touches[0].clientX;
    const currentY = event.touches[0].clientY;
    this.currentTranslateX = currentX - this.startX;
    this.currentTranslateY = currentY - this.startY;
    this.currentRotation = this.currentTranslateX / 10; // Tilt effect
    const profileCards = document.querySelectorAll('.profile-card');
    profileCards.forEach((card: Element, index: number) => {
      const htmlCard = card as HTMLElement;
      // For the first card (active card)
      if (index === this.activeIndex) {
        htmlCard.style.transform = `scale(1) translateY(0)`; // Full size and in place
        htmlCard.style.opacity = '1'; // Fully visible
      }
      // For the second card (next card)
      else if (index === this.activeIndex! + 1) {
        // The second card should scale and change opacity but not move
        const isRightSwipe = this.currentTranslateX > 0;
        const scale = isRightSwipe
          ? Math.min(1, 0.95 + this.currentTranslateX / 1000) // Adjust scale on right swipe
          : 0.95; // Keep the scale fixed on left swipe
        const opacity = isRightSwipe
          ? Math.min(1, 0.8 + this.currentTranslateX / 1000) // Adjust opacity on right swipe
          : 0.8; // Keep the opacity fixed on left swipe
        htmlCard.style.transform = `scale(${scale})`;
        //htmlCard.style.opacity = `${opacity}`;
        htmlCard.style.opacity = '1';
      }
      // For other cards (non-active cards)
      else {
        htmlCard.style.opacity = '0'; // Keep hidden
        htmlCard.style.transform = `scale(0.9) translateY(0px)`; // Keep small and low
      }
    });
  }
  onTouchEnd(profile: any) {
    this.isDragging = false;

    if (Math.abs(this.currentTranslateX) > this.swipeThreshold) {
      // Swipe left or right (complete swipe)
      if (this.currentTranslateX > 0) {
        // Swipe Right - Accept
        this.animateSwipe(profile, 'right', () => {
          this.acceptProfile(profile);
        });
      } else {
        // Swipe Left - Reject
        this.animateSwipe(profile, 'left', () => {
          this.rejectProfile(profile);
        });
      }
    } else {
      // Reset card
      this.resetCard();
    }
  }

  animateSwipe(
    profile: any,
    direction: 'left' | 'right',
    callback: () => void
  ) {
    const swipeDistance =
      direction === 'right' ? window.innerWidth : -window.innerWidth; // Move completely off-screen
    const element = document.querySelector(
      `.profile-card[data-id="${profile.id}"]`
    ) as HTMLElement;

    if (element) {
      element.style.transition = 'transform 0.5s ease-out'; // Smooth animation
      element.style.transform = `translateX(${swipeDistance}px)`; // Move off-screen

      setTimeout(() => {
        callback();
        this.swipeableProfiles = this.swipeableProfiles.filter(
          (p) => p.id !== profile.id
        );
        this.resetCard();
      }, 500); // Match the animation duration
    }
  }
  acceptProfile(profile: any) {
    alert(`You accepted ${profile.name}`);
    this.swipeableProfiles = this.swipeableProfiles.filter(
      (p) => p.id !== profile.id
    );
    this.resetCard();
  }
  rejectProfile(profile: any) {
    alert(`You rejected ${profile.name}`);
    this.swipeableProfiles = this.swipeableProfiles.filter(
      (p) => p.id !== profile.id
    );
    this.resetCard();
  }
  resetCard() {
    this.currentTranslateX = 0;
    this.currentTranslateY = 0;
    this.currentRotation = 0;
    this.activeIndex = null;
  }
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}
  ngOnInit(): void {
    const UserId = localStorage.getItem('My_ID');
    const eventId = this.route.snapshot.paramMap.get('id');
    console.log('Event-Id--->' + eventId);
    // this.http.get<any>(`${this.apiUrl}getAllEvents?id=${eventId}`).toPromise()
    this.http.get<any>(`${this.apiUrl}getAllEvent?`).subscribe(
      (data) => {
        this.event = data.find((e: any) => e.id === eventId);
        console.log('Event-Details--->' + JSON.stringify(this.event));
        if (this.event && this.event.startTime) {
          this.event.formattedStartTime = this.formatDateTime(
            this.event.startTime
          );
        }
      },
      (error) => {
        console.error('Error fetching event data:', error);
      }
    );
    // Fetch profiles data based on IDs
    this.fetchProfiles();
  }
  formatDateTime(dateTimeString: string): {
    formattedDate: string;
    formattedTime: string;
  } {
    const dateObj = new Date(dateTimeString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short', // Use 'short', 'long', or 'narrow'
      day: 'numeric',
      month: 'short', // Use 'short', 'long', or 'narrow'
      year: 'numeric',
    };
    const formattedDate = dateObj.toLocaleDateString('en-US', options);
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    const formattedTime = dateObj.toLocaleTimeString('en-US', timeOptions);
    return { formattedDate, formattedTime };
  }
  fetchProfiles() {
    const requests = this.profileIds.map((id) =>
      this.http
        .get<any>(`http://localhost:3000/api/userDetail?userId=${id}`)
        .toPromise()
    );
    Promise.all(requests)
      .then((results) => {
        this.swipeableProfiles = results.map((profile) => {
          const flattenedProfile = this.flattenProfile(profile); // Flatten nested data
          return flattenedProfile;
        });
        console.log('Mapped Profiles:', this.swipeableProfiles);
      })
      .catch((error) => {
        console.error('Error fetching profiles:', error);
      });
  }
  // Utility function to flatten nested objects
  flattenProfile(profile: any): any {
    let result = profile;
    while (result && result.source) {
      result = result.source; // Drill down to the actual data
    }
    return result;
  }
  isAccept(eventId: string) {
    const UserId = localStorage.getItem('My_ID'); // Get the user ID from local storage
  
    // Prepare the request body with the correct parameter names
    const requestBody = {
      profileId: UserId, // Use profileId instead of userId
      eventId: eventId // The ID of the event being accepted
    };
  
    // Send a POST request to your backend API to update the user's preference
    console.log('this.event: ' + JSON.stringify(requestBody));
    this.http
      .post('http://localhost:3000/requestToJoinEvent', requestBody)
      .subscribe(
        (response) => {
          console.log('User acceptance updated successfully:', response);
          // Handle successful response, e.g., show a success message
          this.router.navigate(['/events']);
        },
        (error) => {
          console.error('Error updating user acceptance:', error);
          // Handle errors, e.g., show an error message to the user
          this.router.navigate(['/events']);
        }
      );
  }
  
  isReject() {
    this.router.navigate(['/events']);
  }
}
