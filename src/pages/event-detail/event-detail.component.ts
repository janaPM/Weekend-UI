import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Console } from 'node:console';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.scss'
})


export class EventDetailComponent implements OnInit {
  // public user = [
  //   {id: "WND00000001"}
  // ];
  id: string = "WND00000001";
  event: any;
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}
  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    console.log("Event-Details--->"+eventId);
    // Fetch event data from the JSON file or API
    this.http.get<any>('/assets/eventsdata.json').subscribe((data) => {
      this.event = data.nearbyEvents.find((e: any) => e.id === eventId);
      console.log("Event-Details--->"+JSON.stringify(this.event));
    });
  }
  isAccept(){
    // Simulate updating the user's acceptance status locally
    this.event.profiles.push(this.id);

  // Send a PUT request to your backend API to update the user's preference
  console.log("this.event"+JSON.stringify(this.event));
  this.http.put('http://your-backend-api/events/' + this.event + '/accept', {
    userId: this.id,/* Your user ID or authentication token */
    accepted: true
  })
  .subscribe(
    response => {
      console.log('User acceptance updated successfully:', response);
      // Handle successful response, e.g., show a success message
      this.router.navigate(['/events']);
    },
    error => {
      console.error('Error updating user acceptance:', error);
      // Handle errors, e.g., show an error message to the user
      this.router.navigate(['/events']);
    }
  );
  }
  isReject(){
    this.router.navigate(['/events']);
  }
 }
