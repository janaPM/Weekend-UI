import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { images } from '../../app/constants/image-constants';
import { Router } from '@angular/router';
@Component({
    selector: 'app-bottom-sheet',
    templateUrl: './bottom-sheet.component.html',
    styleUrl: './bottom-sheet.component.scss',
    standalone: false
})
export class BottomSheetComponent {
  public images = images;
  constructor(
    private bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>,
    private router: Router,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { fee: number, name: string }
  ) {}

  payNow() {
    // Logic for payment processing goes here
    console.log('Payment initiated for fee:', this.data.fee);
    this.bottomSheetRef.dismiss(); // Close the bottom sheet after payment
    this.router.navigate(['/events']);
  }

  close() {
    this.bottomSheetRef.dismiss();
  }
}

