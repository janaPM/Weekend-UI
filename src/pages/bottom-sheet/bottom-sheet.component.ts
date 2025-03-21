import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
    selector: 'app-bottom-sheet',
    templateUrl: './bottom-sheet.component.html',
    styleUrl: './bottom-sheet.component.scss',
    standalone: false
})
export class BottomSheetComponent {
  constructor(
    private bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { fee: number }
  ) {}

  payNow() {
    // Logic for payment processing goes here
    console.log('Payment initiated for fee:', this.data.fee);
    this.bottomSheetRef.dismiss(); // Close the bottom sheet after payment
  }

  close() {
    this.bottomSheetRef.dismiss();
  }
}

