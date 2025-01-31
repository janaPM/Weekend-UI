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
  private apiUrl = environment.URL;
  // profile view
  isCreatingEvent: boolean = false; // Track if creating an event
  public isOpen = false;
  newEvent = {
    name: '',
    description: '',
    location: '',
    date: '',
    time: '',
    startTime: '',
    organizerName: '',
    gender: 'Any',
    age: '',
    image: '',
    fee: '',
    owner: ''
  }; // Holds the new event data
  forYouEvents: Array<{
    name: string;
    description: string;
    location: string;
    date: string;
    time: string;
    startTime: string;
    organizerName: string;
    gender: string;
    age: string;
    image: string;
    fee: string;
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
 showProfile=false;
 ngOnInit() {
   // Mock Events

   this.http.get<any>(`${this.apiUrl}getMyEvent?ownerId=1`).subscribe((data) => {
    console.log('User details:', data);

    // Assuming data is an array of events, iterate and map it to this.events
    if (Array.isArray(data)) {
      data.forEach(eventData => {
        // Create event object and map data
        const event = {
          id: eventData.id,
          name: eventData.name,
          date: new Date(eventData.startTime).toLocaleDateString(),  // Convert date to a readable format
          time: new Date(eventData.startTime).toLocaleTimeString(), // Convert time to a readable format
          startTime: eventData.startTime,
          location: eventData.location,
          description: eventData.description,
          gender: eventData.gender,
          age: eventData.age,
          image: eventData.image,
          fee: eventData.fee.toString(), // Ensure fee is a string
          owner: eventData.owner,
          profiles: eventData.req_users,  // Assuming you have no profiles yet
          showProfiles: false
        };

        // Add the new event to this.events
        this.events.push(event);
      });
    }
  });
  

  //  this.events = [
  //    {
  //      id: 1,
  //      name: 'Music Festival 2023',
  //      date: 'August 20, 2023',
  //      time: '5:00 PM',
  //      profiles: [
  //        { id: '1', name: 'Anna', image: '.././../assets/profile1.jpeg', commonInterests: 5 },
  //        { id: '2', name: 'John', image: '.././../assets/profile1.jpeg', commonInterests: 3 }
  //      ],
  //      showProfiles: false
  //    },
  //    {
  //      id: 2,
  //      name: 'Art Exhibition',
  //      date: 'September 10, 2023',
  //      time: '3:00 PM',
  //      profiles: [
  //        { id: '3', name: 'Emily', image: '.././../assets/profile1.jpeg', commonInterests: 4 }
  //      ],
  //      showProfiles: false
  //    },
  //    {
  //     id: 3,
  //     name: 'Art Exhibition',
  //     date: 'September 10, 2023',
  //     time: '3:00 PM',
  //     profiles: [
  //       { id: '4', name: 'Emily', image: '.././../assets/profile1.jpeg', commonInterests: 3 }
  //     ],
  //     showProfiles: false
  //   }
  //  ];
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

  this.UserId = 'c92e2eaf-f066-4f18-80d9-2e204f1bccc6';
  // this.http.get<any>(`http://localhost:3000/api/get-user-detail?userId=${this.UserId}`).subscribe((data) => {

  //   this.user = { ...data }; });
    // console.log(JSON.stringify(this.user));
 }
 toggleInterestedProfiles(event: any) {
   event.showProfiles = !event.showProfiles;
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
}
onTouchMove(event: TouchEvent) {
  if (this.activeIndex === null) return;
  const currentX = event.touches[0].clientX;
  this.currentTranslateX = currentX - this.touchStartX;
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
      this.acceptProfile(profile);
      event.profiles = event.profiles.filter((p: any) => p.id !== profile.id);
    });
  } else if (this.currentTranslateX < -100) {
    // Swipe Left
    this.animateSwipe(profile, 'left', () => {
      this.rejectProfile(profile);
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
acceptProfile(profile: any) {
  // alert(`You accepted ${profile.name}`);
  this.swipeableProfiles = this.swipeableProfiles.filter((p) => p.id !== profile.id);
}
rejectProfile(profile: any) {
  // alert(`You rejected ${profile.name}`);
  this.swipeableProfiles = this.swipeableProfiles.filter((p) => p.id !== profile.id);
}
resetCard() {
  this.activeIndex = null;
  this.currentTranslateX = 0;
}
removeProfile(profile: any) {
  this.profiles = this.profiles.filter((p) => p !== profile);
  alert(`${profile.name} has been removed.`);
 }
 openProfileView(){
  this.showProfile = true;
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
    date: '',
    time: '',
    startTime:'',
    organizerName: '',
    gender: 'Any',
    age: '',
    image: '',
    fee:'',
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