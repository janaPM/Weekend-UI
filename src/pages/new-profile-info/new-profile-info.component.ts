import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { images } from '../../app/constants/image-constants';
import { Router } from '@angular/router';
import { environment } from '../../../environment';
@Component({
  selector: 'app-new-profile-info',
  templateUrl: './new-profile-info.component.html',
  styleUrl: './new-profile-info.component.scss',
  standalone: false
})
export class NewProfileInfoComponent implements OnInit {
  public images = images;
  private apiUrl = environment.URL;
  inputActive: boolean = false;
  questions: any[] = [
    { key: 'name', title: 'What is your name?', type: 'text' },
    { key: 'work', title: "What's your Work Title and Company?", type: 'work' },
    { key: 'gender', title: "What's your Gender?", type: 'gender' },
    { key: 'bio', title: 'Tell us about yourself (Bio)', type: 'text' },
    { key: 'location', title: 'Where do you live?', type: 'text' },
    { key: 'hometown', title: 'What is your hometown?', type: 'text' },
    { key: 'height', title: 'What is your height?', type: 'text' },
    { key: 'interests', title: 'What are your interests?', type: 'interests' },
    { key: 'education', title: 'What is your education?', type: 'text'},
    { key: 'exercise', title: 'How often do you exercise?', type: 'text'}
  ];
  
  currentQuestionIndex: number = 0;
  user: any = {};
  currentValue: string = '';
  currentGender: string = '';
  currentTitle: string = '';
  currentCompany: string = '';
  selectedInterests: string[] = [];
  isInterestModalOpen: boolean = false;

  genderOptions = [
    { label: 'Male', icon: './../../assets/male.png' },
    { label: 'Female', icon: './../../assets/female.png' },
    { label: 'Non-Binary', icon: './../../assets/nonbinary.png' },
    { label: 'Prefer Not to Say', icon: './../../assets/unknown.png' },
    { label: 'Other', icon: './../../assets/other.png' }
  ];

  interestOptions: string[] = [
    'Music',
    'Traveling',
    'Cooking',
    'Sports',
    'Photography',
    'Gaming',
    'Reading',
    'Fitness',
    'Movies',
    'Art',
  ];

  ngOnInit(): void {
    // Initialize user object
    this.user = {};
  }
  constructor(private router: Router, private http: HttpClient) { }
  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      // Handle completion of questions
      alert('All questions answered!');
      console.log(this.user); // Log the collected user data
      this.router.navigate(['/profile']);
      this.user.id = localStorage.getItem('My_ID');
      this.http.post(`${this.apiUrl}/updateUser`, this.user)
      .subscribe(
        (response) => {
          console.log('User data saved successfully:', response);
        },
        (error) => {
          console.error('Error saving user data:', error);
        }
      );
      console.log('saved-->'+JSON.stringify(this.user));
    }
  }

  skipQuestion(): void {
    this.nextQuestion();
    this.currentValue = ''; // Clear the input for the next question
    this.inputActive = false;
  }

  saveAnswer(): void {
    const currentQuestion = this.questions[this.currentQuestionIndex];
    if (currentQuestion.type === 'work') {
      this.user.work = `${this.currentTitle} at ${this.currentCompany}`;
    } else if (currentQuestion.type === 'gender') {
      this.user.gender = this.currentGender;
    } else if (currentQuestion.type === 'interests') {
      this.user.interest = [...this.selectedInterests];
    } else {
      this.user[currentQuestion.key] = this.currentValue.trim();
    }
    this.currentValue = ''; // Clear the input for the next question
    this.nextQuestion();
    this.inputActive = false;
  }

  onInput(): void {
    console.log(!!this.currentTitle.trim());
    this.inputActive = !!this.currentValue.trim() || !!this.selectedInterests || !!this.currentTitle || this.currentCompany;
  } 

  toggleInterest(interest: string): void {
    this.inputActive = true;
    const index = this.selectedInterests.indexOf(interest);
    if (index > -1) {
      this.selectedInterests.splice(index, 1); // Remove if already selected
    } else {
      this.selectedInterests.push(interest); // Add if not selected
    }
  }

  selectGender(option: { label: string }): void {
    this.currentGender = option.label;
    this.inputActive = true;
  }
}