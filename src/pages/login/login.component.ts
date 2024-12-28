import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { images } from '../../app/constants/image-constants';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
 
  // public email: string;
  // public password: string;
  public rememberMe: boolean = false;
  public images = images;
  public isPasswordVisible: boolean = false;
  public isLogin: boolean = true;
  public emailExists: boolean = false;
  public passwordInvalid: boolean = false;
  public userNotExists: boolean = false;
  public userExists: boolean = false;
  public invalidEmail: boolean = false;
  public easyPassword : boolean = false;
  public form: FormGroup | undefined;
  signupUsers: any[] =[];
  signupObj: any = {
    userName:'',
    password:''
  };
  signinObj: any = {
    email:'',
    password:''
  };

  constructor(private fb: FormBuilder,private http: HttpClient, private router: Router) { }

  toggleForm() {
    this.isLogin = !this.isLogin;
    this.emailExists = false;
    this.passwordInvalid = false;
    this.userNotExists = false;
    this.invalidEmail = false;
    this.userExists = false;
    this.easyPassword = false;
  }
  togglePassword() {
    if (this.isLogin){
      this.isPasswordVisible = !this.isPasswordVisible;
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      passwordInput.type = this.isPasswordVisible ? 'password' : 'text';
    }
    else 
    {
      this.isPasswordVisible = !this.isPasswordVisible;
      const passwordInput = document.getElementById('create-password') as HTMLInputElement;
      passwordInput.type = this.isPasswordVisible ? 'password': 'text';
    }
  }
  
  
onSubmit() {
  console.log(this.isLogin);
  if (this.isLogin) {
      this.onSignIn();
  } else {
      this.onSignUp();
  }
}


onSignIn() {
  console.log(this.isLogin);
  // Validate email format
  if (!this.isValidEmail(this.signinObj.email)) {
    console.log('Invalid email format:', this.signinObj.email);
    this.invalidEmail = true;
    return;
  }
  this.invalidEmail = false;
  console.log('Login submitted:', this.signinObj.email, this.signinObj.password);
  // Call the server to validate login credentials
  this.login_cred_server(this.signinObj.email, this.signinObj.password);
 }
 login_cred_server(email_address: string, password: string): void {
  console.log(JSON.stringify(email_address));
  this.http.post('http://localhost:3000/api/login-account-validation', { email_address, password })
    .subscribe(
      (response: any) => {
        const responses = response.message;
        console.log("Response from server:", JSON.stringify(responses));
        if (response.message === 'User not found') {
          this.userNotExists = true;
          console.log("User not found.");
        } else if (response.message === 'Incorrect password') {
          this.userNotExists = false;
          this.passwordInvalid = true;
          console.log("Incorrect password.");
        } else if (response.message === 'Login successful') {
          // Assuming `response` contains `userId`
          const userId = response.userId;
          console.log('Login successful. User ID:', userId);
          // Save `userId` to localStorage
          localStorage.setItem('My_ID', userId);
          // Navigate to the profile page
          this.router.navigate(['/profile']);
        }
      },
      (error) => {
        console.error('Error during login:', error);
      }
    );
 }

onSignUp() {
  if (!this.isValidEmail(this.signupObj.email)) {
      console.log('Invalid email format:', this.signupObj.email);
      this.invalidEmail = true;
      return;
  }
  this.invalidEmail = false;
  const isUserExists = this.signupUsers.find(m => m.email === this.signupObj.email);
  {
    if(isUserExists != undefined){
      this.userExists = true;
      return;
    }
  }
  this.userExists = false;
  if (!this.isValidPassword(this.signupObj.password)) {   
      console.log('Invalid password:', this.signupObj.password);
      this.easyPassword = true;
      this.userExists = false;
      return;
  }

  console.log('Sign up submitted:', this.signupObj.email, this.signupObj.password);

  
  this.signupUsers.push(this.signupObj);
  // localStorage.setItem('signUpUsers',JSON.stringify(this.signupUsers));
  
  this.push_cred_server(this.signupObj.email, this.signupObj.password);
  // Handle sign-up logic here
  this.toggleForm(); // Switch to sign-in mode after successful sign-up

  this.signupObj = {
    email:'',
    password:''
  };
}


push_cred_server(email_address: string, password: string): void {
  console.log(JSON.stringify(email_address));

  this.http.post('http://localhost:3000/api/create-account', { email_address, password })
    .subscribe(
      (response: any) => {
        const userId = response.userId; // Store the userId
        console.log('User data saved successfully:', userId);
        // localStorage.setItem('My_ID',userId);
        alert('Profile saved successfully!');
      },
      (error) => {
        console.error('Error saving user data:', error);
      }
    );
}




isEmailExists(email: string): boolean {
  const existingEmails = ['test@example.com', 'user@domain.com'];
  return existingEmails.includes(email);
}

  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailPattern.test(email);
  }
  isValidPassword(password: string): boolean {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,}$/;
    return passwordRegex.test(password);
  }

  ngOnInit(): void {
    
  }

}
