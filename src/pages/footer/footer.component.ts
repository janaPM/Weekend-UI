import { Component, Input } from '@angular/core';
import { images } from '../../app/constants/image-constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})

export class FooterComponent {
  public images = images;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  activeRoute: string = ""; // Default route
  navigateTo(destination: string) {
    switch (destination) {
      case 'profile':
        this.router.navigate(['/profile']);
        console.log(`Navigating to: ${destination}`);
        this.activeRoute = 'profile';
        break;
      case 'for_youu':
        this.router.navigate(['/for-you']);
        console.log(`Navigating to: ${destination}`);
        this.activeRoute = 'for-you';
        break;
      case 'events':
          this.router.navigate(['/events']);
          console.log(`Navigating to: ${destination}`);
          this.activeRoute = 'events';
        break;
      case 'chats':
          this.router.navigate(['/chats']);
          console.log(`Navigating to: ${destination}`);
          this.activeRoute = 'chats';
        break;
      case 'calendar':
          this.router.navigate(['/calendar']);
          console.log(`Navigating to: ${destination}`);
          this.activeRoute = 'calendar';
        break;
    }
  }
}
