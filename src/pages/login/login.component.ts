import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
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
}

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  phoneNumber: string = '';
  otp: string = '';
  errorMessage: string = '';
  step: number = 1;
  challengeSession: string | null = null;
  public rawPhone: string = ''; // User input (10-digit number)

  private apiUrl = environment.URL;

  constructor(private http: HttpClient, private router: Router) {}

  // ✅ Step 1: Send OTP
  public sendOTP(): void {
  const phoneRegex = /^[6-9]\d{9}$/; // Starts with 6-9 and 10 digits

  if (!this.rawPhone || !phoneRegex.test(this.rawPhone)) {
    this.errorMessage = 'Please enter a valid 10-digit Indian phone number.';
    return;
  }

  this.phoneNumber = '+91' + this.rawPhone;

  this.http.post<SendOtpResponse>(`${this.apiUrl}api/auth/send-otp`, {
    phone: this.phoneNumber
  }).subscribe({
    next: (res) => {
      console.log('✅ OTP sent:', res.session);
      this.challengeSession = res.session;
      this.step = 2; // Move to OTP step
      this.errorMessage = '';
    },
    error: (err) => {
      console.error('❌ Failed to send OTP:', err);
      this.errorMessage = err.error?.message || 'Failed to send OTP.';
    }
  });
}
  // ✅ Step 2: Verify OTP
  public verifyOTP(): void {
    if (!this.otp || !this.challengeSession) {
      this.errorMessage = 'Missing OTP or session.';
      return;
    }

    this.http.post<VerifyOtpResponse>(`${this.apiUrl}api/auth/verify-otp`, {
      phone: this.phoneNumber,
      otp: this.otp,
      session: this.challengeSession
    }).subscribe({
      next: (res) => {
        const userId = res.user?.id;
        localStorage.setItem('My_ID', userId);
        console.log('✅ OTP verified:', userId);
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error('❌ OTP verification failed:', err);
        this.errorMessage = err.error?.message || 'OTP verification failed.';
      }
    });
  }
}
