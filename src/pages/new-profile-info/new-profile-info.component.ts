import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { images } from '../../app/constants/image-constants';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';

declare var Razorpay: any;

@Component({
  selector: 'app-new-profile-info',
  templateUrl: './new-profile-info.component.html',
  styleUrl: './new-profile-info.component.scss'
})
export class NewProfileInfoComponent {
  title = 'razorpay';
  public images = images;
  payNow() {
    const RozarpayOptions = {
      description: 'Sample Razorpay demo',
      currency: 'INR',
      amount: 1,
      name: 'jana',
      key: 'rzp_test_ykpIQCXJbWgyQi',
      image: '/Users/karthicks7/Desktop/chatintegrated_weekend/chessy/src/assets/home.svg',
      prefill: {
        name: 'jana',
        email: 'manojana93@gmail.com',
        phone: '9943520222'
      },
      theme: {
        color: '#6466e3'
      },
      modal: {
        ondismiss:  () => {
          console.log('dismissed')
        }
      }
    }

    const successCallback = (paymentid: any) => {
      console.log(paymentid);
    }

    const failureCallback = (e: any) => {
      console.log(e);
    }
    console.log('app-new-profile-info');
    Razorpay.open(RozarpayOptions,successCallback, failureCallback)
  }
}
