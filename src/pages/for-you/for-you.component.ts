import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { images } from '../../app/constants/image-constants';
// import * as Hammer from 'hammerjs';
@Component({
  selector: 'app-for-you',
  templateUrl: './for-you.component.html',
  styleUrl: './for-you.component.scss'
})
export class ForYouComponent implements OnInit {

  // profile view
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
   this.events = [
     {
       id: 1,
       name: 'Music Festival 2023',
       date: 'August 20, 2023',
       time: '5:00 PM',
       profiles: [
         { id: '1', name: 'Anna', image: '.././../assets/profile1.jpeg', commonInterests: 5 },
         { id: '2', name: 'John', image: '.././../assets/profile1.jpeg', commonInterests: 3 }
       ],
       showProfiles: false
     },
     {
       id: 2,
       name: 'Art Exhibition',
       date: 'September 10, 2023',
       time: '3:00 PM',
       profiles: [
         { id: '3', name: 'Emily', image: '.././../assets/profile1.jpeg', commonInterests: 4 }
       ],
       showProfiles: false
     },
     {
      id: 3,
      name: 'Art Exhibition',
      date: 'September 10, 2023',
      time: '3:00 PM',
      profiles: [
        { id: '4', name: 'Emily', image: '.././../assets/profile1.jpeg', commonInterests: 3 }
      ],
      showProfiles: false
    }
   ];
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
  this.http.get<any>(`http://localhost:3000/api/get-user-detail?userId=${this.UserId}`).subscribe((data) => {

    this.user = { ...data }; });
    console.log(JSON.stringify(this.user));
 }
 toggleInterestedProfiles(event: any) {
   event.showProfiles = !event.showProfiles;
 }
 toggleFriendRequests() {
   this.showFriendRequests = !this.showFriendRequests;
 }
 addFriend(profile: any) {
   alert(`Friend request sent to ${profile.name}`);
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
}