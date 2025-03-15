import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
    selector: 'app-bottom-sheet',
    templateUrl: './bottom-sheet.component.html',
    styleUrl: './bottom-sheet.component.scss',
    standalone: false
})
export class BottomSheetComponent {
  newEvent = {
    name: '',
    location: '',
    date: '',
    time: '',
    organizerName: '',
    gender: 'Any',
    age: '',
    image: ''
  };
  constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>) {}

  saveEvent(): void {
    // Implement your save logic here
    console.log('Event saved:', this.newEvent);
    this.bottomSheetRef.dismiss(); // Close the bottom sheet
  }

  cancelEvent(): void {
    this.bottomSheetRef.dismiss(); // Close the bottom sheet
  }
}
