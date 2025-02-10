import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { images } from '../../app/constants/image-constants';
import { environment } from '../../../environment';
// import * as Hammer from 'hammerjs';
@Component({
  selector: 'app-for-you',
  templateUrl: './for-you.component.html',
  styleUrl: './for-you.component.scss'
})
export class ForYouComponent implements OnInit {
  @Input() showProfilesSection = true;
  private apiUrl = environment.URL;
  // profile view
  isCreatingEvent: boolean = false; // Track if creating an event
  public isOpen = false;
  newEvent = {
    name: '',
    description: '',
    location: '',
    location_url:'',
    date: '',
    time: '',
    startTime: '',
    organizerName: '',
    gender: 'Any',
    age: '',
    image: '',
    fee: '',
    bu_count:'',
    bu_min_count:'',
    owner: ''
  }; // Holds the new event data
  forYouEvents: Array<{
    name: string;
    description: string;
    location: string;
    location_url: string;
    date: string;
    time: string;
    startTime: string;
    organizerName: string;
    gender: string;
    age: string;
    image: string;
    fee: string;
    bu_count: string,
    bu_min_count: string,
    owner: string;
  }> = [];
  bioItems = [
    {key: "bio", title: "Bio", icon: './../../assets/bio.png'},
  ];
  aboutItems = [
    { key: 'work', title: 'Work' , icon: './../../assets/work.png'},
    { key: 'education', title: 'Education' , icon: './../../assets/education.png'},
    { key: 'gender', title: 'Gender', icon: './../../assets/gender.png' },
    { key: 'location', title: 'Location', icon: './../../assets/location.png'},
    { key: 'hometown', title: 'Hometown', icon: './../../assets/location.png' }
  ];
  moreItems = [
    { key: 'height', title: 'Height', icon: './../../assets/height.png'},
    { key: 'exercise', title: 'Exercise', icon: './../../assets/exercise.png' },
    { key: 'educationLevel', title: 'Education level', icon: './../../assets/education.png' }
  ];
   // profile view end
 public images = images;
 UserId: string='';
 UserIds: string=''; 
 user: any;
 events: Array<any> = [];
 profiles: Array<any> = [];
 friendRequests: Array<any> = [];
 swipeableProfiles: Array<any> = [];
 touchStartX: number = 0; // Start position of touch
 currentTranslateX: number = 0; // Current translate position
 activeIndex: number | null = null; // Active card index being swiped
 showFriendRequests = false;
 showProfilesInterested = false;
 showAccProfiles = false;
 showProfile=false;
 ngOnInit() {
   // Mock Events
   const UserId = localStorage.getItem('My_ID'); 
   console.log('UserId:', UserId);
   const apiEndpoint = this.showProfilesSection ? 'getMyEvent' : 'getEventsByReqId';
   this.http.get<any>(`${this.apiUrl}${apiEndpoint}?ownerId=${UserId}`).subscribe((data) => {
    console.log('User details:', data);

    // Assuming data is an array of events, iterate and map it to this.events
    if (Array.isArray(data)) {
      data.forEach(eventData => {
        // Create event object and map data
        const event = {
          id: eventData.id,
          name: eventData.name,
          // date: new Date(eventData.startTime).toLocaleDateString(),  // Convert date to a readable format
          // time: new Date(eventData.startTime).toLocaleTimeString(), // Convert time to a readable format
          startTime: eventData.startTime,
          // location: eventData.location,
          // description: eventData.description,
          // gender: eventData.gender,
          // age: eventData.age,
          // image: eventData.image,
          // fee: eventData.fee.toString(), // Ensure fee is a string
          // owner: eventData.owner,
          accProfiles: eventData.acc_users,
          profiles: eventData.req_users,  // Assuming you have no profiles yet
          showProfiles: false,
          showAccProfiles: false
        };

          // Add the new event to this.events
          this.events.push(event);
          console.log("this.events"+JSON.stringify(this.events));
        });
      }
    });
  
   this.profiles = [
    {
      id: 101,
      name: 'Alice',
      image: '.././../assets/profile1.jpeg',
      commonInterests: 5,
    },
    {
      id: 102,
      name: 'Bob',
      image: '.././../assets/profile1.jpeg',
      commonInterests: 3,
    },
    {
      id: 103,
      name: 'Jon',
      image: '.././../assets/profile1.jpeg',
      commonInterests: 3,
    },
    {
      id: 104,
      name: 'Harry',
      image: '.././../assets/profile1.jpeg',
      commonInterests: 3,
    },
    {
      id: 105,
      name: 'Nikil',
      image: '.././../assets/profile1.jpeg',
      commonInterests: 3,
    }
    ];
   // Mock Profiles Interested
   this.swipeableProfiles = [
     { name: 'Kate', image: '.././../assets/profile1.jpeg', commonInterests: 6 },
     { name: 'Liam', image: '.././../assets/profile1.jpeg', commonInterests: 2 }
   ];
   // Mock Friend Requests
   this.friendRequests = [
     { name: 'Sophia', image: '.././../assets/profile1.jpeg' },
     { name: 'Michael', image: '.././../assets/profile1.jpeg' }
   ];

   //for profile

  // this.UserId = 'c92e2eaf-f066-4f18-80d9-2e204f1bccc6';
  // this.UserId = '1';
 }
 toggleInterestedProfiles(event: any) {
  // Check if any other event already has profiles visible
  const isAnotherEventVisible = this.events.some(
    (otherEvent) => otherEvent !== event && otherEvent.showProfiles
  );

  // If another event is visible, hide its profiles first
  if (isAnotherEventVisible) {
    this.events.forEach((otherEvent) => {
      if (otherEvent !== event) {
        otherEvent.showProfiles = false;
      }
    });
  }
  event.showAccProfiles = false;
  event.showProfiles = !event.showProfiles;
}
toggleAcceptedProfiles(event: any){
    // Check if any other event already has profiles visible
    const isAnotherEventVisible = this.events.some(
      (otherEvent) => otherEvent !== event && otherEvent.showAccProfiles
    );
  
    // If another event is visible, hide its profiles first
    if (isAnotherEventVisible) {
      this.events.forEach((otherEvent) => {
        if (otherEvent !== event) {
          otherEvent.showAccProfiles = false;
        }
      });
    }
    event.showProfiles = false;
    event.showAccProfiles = !event.showAccProfiles;
}
closeProfileView(){
  this.showProfile = false;
}
 toggleFriendRequests() {
   this.showFriendRequests = !this.showFriendRequests;
 }
 addFriend(profile: any) {
   alert(`Friend request sent to ${profile.name}`);
   this.showProfile = false;
   this.profiles = this.profiles.filter((p) => p !== profile);
 }
//  rejectProfile(profile: any) {
//    this.swipeableProfiles = this.swipeableProfiles.filter((p) => p !== profile);
//  }
//  acceptProfile(profile: any) {
//    alert(`You accepted ${profile.name}`);
//    this.swipeableProfiles = this.swipeableProfiles.filter((p) => p !== profile);
//  }
 acceptFriend(request: any) {
   alert(`Friend request accepted from ${request.name}`);
   this.friendRequests = this.friendRequests.filter((r) => r !== request);
 }
 rejectFriend(request: any) {
   this.friendRequests = this.friendRequests.filter((r) => r !== request);
 }

 onTouchStart(event: TouchEvent, index: number) {
  this.touchStartX = event.touches[0].clientX;
  this.activeIndex = index;
  this.currentTranslateX = 0; // Reset translate position
  console.log("onTouchStart");
}
onTouchMove(event: TouchEvent) {
  if (this.activeIndex === null) return;
  const currentX = event.touches[0].clientX;
  this.currentTranslateX = currentX - this.touchStartX;
  console.log("onTouchMove");
}
// onTouchEnd(profile: any, event: any) {
//   if (this.currentTranslateX > 100) {
//     this.acceptProfile(profile);
//     event.profiles = event.profiles.filter((p: any) => p.id !== profile.id);
//   } else if (this.currentTranslateX < -100) {
//     this.rejectProfile(profile);
//     event.profiles = event.profiles.filter((p: any) => p.id !== profile.id);
//   }
//   this.resetCard();
//  }
onTouchEnd(profile: any, event: any) {
  const container = document.querySelector('.profile-list') as HTMLElement;
  if (container){
    container.classList.add('reordering');
  }
  if (this.currentTranslateX > 100) {
    // Swipe Right
    this.animateSwipe(profile, 'right', () => {
      // this.acceptProfile(profile);
      this.acceptProfile(profile.id,event.id);
      event.profiles = event.profiles.filter((p: any) => p.id !== profile.id);
    });
  } else if (this.currentTranslateX < -100) {
    // Swipe Left
    this.animateSwipe(profile, 'left', () => {
      // this.rejectProfile(profile);
      this.rejectProfile(profile.id,event.id);
      event.profiles = event.profiles.filter((p: any) => p.id !== profile.id);
    });
  } else {
    // Reset position if swipe threshold isn't met
    this.resetCard();
  }

  setTimeout(() => {
    if (container) {
      container.classList.remove('reordering');
    }
  },500);
  console.log("onTouchEnd");
 }

 animateSwipe(profile: any, direction: 'left' | 'right', callback: () => void) {
  const swipeDistance = direction === 'right' ? window.innerWidth : -window.innerWidth; // Move completely off-screen
  const element = document.querySelector(`.profile-card[data-id="${profile.id}"]`) as HTMLElement;
  if (element) {
    element.style.transition = 'transform 0.5s ease-out'; // Smooth animation
    element.style.transform = `translateX(${swipeDistance}px)`; // Move off-screen
    // element.style.position = 'absolute';
    // Wait for the animation to complete before invoking the callback
    setTimeout(() => {
      callback();
      this.resetCard();
    }, 500); // Match the animation duration
  }
 }
// acceptProfile(profile: any) {
//   // alert(`You accepted ${profile.name}`);
//   this.swipeableProfiles = this.swipeableProfiles.filter((p) => p.id !== profile.id);
// }
acceptProfile(profile: any, event: any) {
  const payload = {
    profileId: profile,
    eventId: event
  };
  this.http.post(`${this.apiUrl}acceptProfileForMyEvent`, payload).subscribe(
    (response) => {
      console.log('Profile accepted successfully:', response);
      this.swipeableProfiles = this.swipeableProfiles.filter((p) => p.id !== profile.id);
    },
    (error) => {
      console.error('Error accepting profile:', error);
      alert('Failed to accept profile. Please try again.');
    }
  );
}
// rejectProfile(profile: any) {
//   // alert(`You rejected ${profile.name}`);
//   this.swipeableProfiles = this.swipeableProfiles.filter((p) => p.id !== profile.id);
// }
rejectProfile(profile: any,event: any) {
  const payload = {
    profileId: profile,
    eventId: event
  };
  this.http.post(`${this.apiUrl}rejectProfileForMyEvent`, payload).subscribe(
    (response) => {
      console.log('Profile rejected successfully:', response);
      this.swipeableProfiles = this.swipeableProfiles.filter((p) => p.id !== profile.id);
    },
    (error) => {
      console.error('Error rejecting profile:', error);
      alert('Failed to reject profile. Please try again.');
    }
  );
}
resetCard() {
  this.activeIndex = null;
  this.currentTranslateX = 0;
}
removeProfile(profile: any) {
  this.profiles = this.profiles.filter((p) => p !== profile);
  alert(`${profile.name} has been removed.`);
 }
 openProfileView(profile: any){
  this.UserIds = profile.id;
  console.log("UserIds"+this.UserIds);
  this.showProfile = true;
  console.log("UserId-http"+this.UserIds);
  // this.UserIds ='1';
  this.http.get<any>(`${this.apiUrl}userDetail?userId=${this.UserIds}`).subscribe((data) => {
    this.user = { ...data }; }
  ,(error) => {
    console.error('Error fetching requested user data:', error);
    alert('Failed to get requested user data. Please try again.');
  });
    console.log(JSON.stringify(this.user));
 }
 getCardBackground(translateX: number): string {
  if (translateX > 0) {
    // Swipe right (green)
    return `linear-gradient(to right, #d4edda, #c3e6cb)`;
  } else if (translateX < 0) {
    // Swipe left (red)
    return `linear-gradient(to left, #f8d7da, #f5c6cb)`;
  }
  // No swipe (transparent)
  return 'transparent';
 }
 constructor(private http: HttpClient) {}

 toggleCreateEvent(): void {
  this.isCreatingEvent = !this.isCreatingEvent;
  this.isOpen = !this.isOpen;
  if (!this.isCreatingEvent) {
    this.resetNewEvent();
  }
}
formatDateTime(dateTimeString: string): { formattedDate: string, formattedTime: string } {
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
  return { formattedDate, formattedTime };
}
saveEvent(): void {
  if (this.isEventValid()) {
    this.newEvent.owner = localStorage.getItem('My_ID') || ''; // Ensure it's a string
    this.newEvent.startTime = this.combineDateAndTime(); // Set the startTime
    this.forYouEvents.push({ ...this.newEvent }); // Add to event list
    // this.newEvent = {"name":"Weekend Recruting","description":"No need of college degree","location":"Bangalure","date":"2025-01-20","time":"10:00","startTime":"2025-01-20T04:30:00.000Z","organizerName":"","gender":"Any","age":"18+","image":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRucQIktdhubA67woLderNRVAR4lP1bC-BYBg&s","fee":"0","owner":"1"};
    // this.newEvent = {
    //   name: "Weekend Recruiting",
    //   description: "No need of college degree",
    //   location: "Bangalure",
    //   date: "2025-01-20",
    //   time: "10:00:00",
    //   startTime: "2025-01-20 04:30:00", // Ensure this is the correct start time
    //   organizerName: "",
    //   gender: "Any",
    //   age: "18+",
    //   image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRucQIktdhubA67woLderNRVAR4lP1bC-BYBg&s",
    //   fee: "0",
    //   owner: localStorage.getItem('My_ID') || '' // Ensure it's a string
    // };
    console.log(JSON.stringify(this.newEvent));
    this.newEvent = {"name":"Kanva Lake Camping","description":"Kanva Lake Camping provides a serene getaway surrounded by nature's beauty.","location":"Kanva Reservoir, Karnataka","location_url":"https://www.google.com/maps/place/Kanva+Reservoir","date":"2025-02-15","time":"00:00","startTime":"2025-02-15 00:00:00","organizerName":"Rishikanna","gender":"Any","age":"18+","image":"https://media1.thrillophilia.com/filestore/x5yu4hn3svla5ug4oh31uq4b2tqi_IMG_20201218_221443_733.jpg?w=auto&h=600","fee":"1349","bu_count":"10","bu_min_count":"3","owner":"1"}
    this.http.post(`${this.apiUrl}createEvent`, this.newEvent).subscribe(
      (response) => {
        console.log('Event saved successfully:', response);
        this.resetNewEvent(); // Reset the new event after successful save
      },
      (error) => {
        console.error('Error saving event:', error);
        alert('Failed to save event. Please try again.');
      }
    );
    this.isCreatingEvent = false;
    this.resetNewEvent();
  } else {
    alert('Please fill out all fields!');
  }
}
private combineDateAndTime(): string {
  const date = new Date(`${this.newEvent.date}T${this.newEvent.time}`); // Create a Date object

  // Extract the components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Format the date and time as 'YYYY-MM-DD HH:mm:ss'
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
cancelEvent(): void {
  this.isCreatingEvent = false;
  this.resetNewEvent();
}
resetNewEvent(): void {
  this.newEvent = {
    name: '',
    description: '',
    location: '',
    location_url:'',
    date: '',
    time: '',
    startTime:'',
    organizerName: '',
    gender: 'Any',
    age: '',
    image: '',
    fee:'',
    bu_count:'',
    bu_min_count:'',
    owner:''
  };
}
isEventValid(): boolean {
  return (
    this.newEvent.name !== '' // &&
    // this.newEvent.description !== '' &&
    // this.newEvent.location !== ''&&
    // this.newEvent.date !== '' &&
    // this.newEvent.time !== '' &&
    // this.newEvent.organizerName !== '' &&
    // this.newEvent.image !== '' &&
    // this.newEvent.fee !== ''
  );
}
}