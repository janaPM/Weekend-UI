import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { images } from '../../app/constants/image-constants';
import { Router } from '@angular/router';
import { NgOtpInputConfig} from 'ng-otp-input';
import { environment } from '../../../environment';

// ✅ Interface for /send-otp response
interface SendOtpResponse {
  session: string;
  status?: string;
}

// ✅ Interface for /verify-otp response
interface VerifyOtpResponse {
  token: string;
  user: {
    id: string;
    phone: string;
  };
  newUser: boolean;
}

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
 
  public images = images;
  mobile: string = '';
  otp: string = '';
  errorMessage: string = '';
  showOtpInput: boolean = false;
  challengeSession: string | null = null;
  private _errorTimeout: any = null;
  private apiUrl = environment.URL;

  otpInputConfig: NgOtpInputConfig = {
    length: 6,
    inputClass: 'otp-input-small',
    allowNumbersOnly: true,
    isPasswordInput: false,
  };

  constructor(private http: HttpClient, private router: Router) {}

  onlyNumberKey(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  private showError(msg: string) {
    this.errorMessage = msg;
    if (this._errorTimeout) {
      clearTimeout(this._errorTimeout);
    }
    this._errorTimeout = setTimeout(() => {
      this.errorMessage = '';
      this._errorTimeout = null;
    }, 5000);
  }
  getOtp() {
    if (!this.mobile || this.mobile.length !== 10) {      
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    // Simulate OTP sent
    console.log('this.mobile'+this.mobile);
    this.http.post<SendOtpResponse>(`${this.apiUrl}/auth/send-otp`, {
    phone: this.mobile
  }).subscribe({
    next: (res) => {
      console.log('✅ OTP sent:', res.session);
      this.challengeSession = res.session;
      this.showOtpInput = true;
      this.errorMessage = '';
    },
    error: (err) => {
      console.error('❌ Failed to send OTP:', err);
      this.showError(err.error?.message || 'Failed to send OTP.');
    }
  });
  }
  onOtpChange(otp: string) {
    this.otp = otp;
  }

  changeNumber() {
    this.showOtpInput = false;
    this.otp = '';
  }
  verifyOtp() {
    if (this.otp.length !== 6) {
      alert('Please enter the 6-digit OTP.');
      return;
    }
    if (!this.otp || !this.challengeSession) {
      this.showError('session expired, please try again');
      return;
    }

    this.http.post<VerifyOtpResponse>(`${this.apiUrl}/auth/verify-otp`, {
      phone: this.mobile,
      otp: this.otp,
      session: this.challengeSession
    }).subscribe({
      next: (res) => {
        const userId = res.user?.id;
        localStorage.setItem('My_ID', userId);
        console.log('✅ OTP verified:', userId);
         if (res.newUser) {
      this.router.navigate(['/new']);
    } else {
      this.router.navigate(['/events']);
    }
  },
      error: (err) => {
        console.error('❌ OTP verification failed:', err);
        this.showError(err.error?.message || 'OTP verification failed.');
      }
    });
    alert('OTP verified! (Implement your logic here)');
  }

  isValidIndianMobile(mobile: string): boolean {
    if (mobile.length !== 10) return true;
    return /^[6-9]\d{9}$/.test(mobile);
  }

  atGoogleSignIn() {
    console.log('Google Sign In clicked');
    this.showError('Google Sign In is not implemented yet, please use Mobile login.');
  }

}
