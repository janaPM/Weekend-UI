import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { images } from '../../app/constants/image-constants';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  public images = images;
  user: any = {};
  UserId: string = '';
  originalUser: any = {};
  editing: boolean = false;
  editingMode: boolean = false;
  currentField: string = '';
  currentValue: string = '';
  inputActive: boolean = false;
  progress: number = 0;
  question: string = '';
  selectedInterests: string[] = []; // added
 isInterestModalOpen: boolean = false; // added
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

  bioItems = [
    {key: "bio", title: "Bio", icon: './../../assets/bio.png'},
  ];
  aboutItems = [
    { key: 'work', title: 'Work' , icon: './../../assets/work.png'},
    { key: 'education', title: 'Education' , icon: './../../assets/education.png'},
    { key: 'gender', title: 'Gender', icon: './../../assets/gender.png' },
    { key: 'location', title: 'Location', icon: './../../assets/location.png'},
    { key: 'hometown', title: 'Hometown', icon: './../../assets/location.png' }
  ];
  moreItems = [
    { key: 'height', title: 'Height', icon: './../../assets/height.png'},
    { key: 'exercise', title: 'Exercise', icon: './../../assets/exercise.png' },
    { key: 'educationLevel', title: 'Education level', icon: './../../assets/education.png' }
  ];
  constructor(private http: HttpClient) {}
  ngOnInit(): void  {
    console.log("Profile");
    console.log(localStorage.getItem('My_ID'));
    const UserId = localStorage.getItem('My_ID');
    console.log("UserId--->"+UserId);
    this.http.get<any>(`http://localhost:3000/api/get-user-detail?userId=${UserId}`).subscribe((data) => {
      this.user.id = UserId;
      this.user = { ...data };
      this.originalUser = { ...data };
      this.selectedInterests = this.user.interest ? [...this.user.interest] : [];
      this.initializeMissingFields();
      this.calculateProgress();
    });
  }
  initializeMissingFields(): void {
    [...this.aboutItems, ...this.moreItems].forEach((item) => {
      if (!this.user[item.key]) {
        this.user[item.key] = '';
      }
    });
  }
  startEditing(field: string): void {
    this.currentField = field;
    this.currentValue = this.user[field] || '';
    this.question = `What's your ${field}?`;
    this.editing = true;
    this.inputActive = false;
  }
  startEditingg(){
    this.editingMode = true;
  }
  onInput(): void {
    this.inputActive = !!this.currentValue.trim();
  }
  saveEdit(field: string): void {
    if (this.currentValue.trim()) {
      this.user[field] = this.currentValue.trim();
      this.editing = false;
      this.editingMode = true;
      this.calculateProgress();
    }
  }
  // added
  startEditingInterest(): void {
    this.isInterestModalOpen = true;
  }
  toggleInterest(interest: string): void {
    const index = this.selectedInterests.indexOf(interest);
    if (index > -1) {
      this.selectedInterests.splice(index, 1); // Remove if already selected
    } else {
      this.selectedInterests.push(interest); // Add if not selected
    }
  }
  saveInterestSelection(): void {
    this.user.interest = [...this.selectedInterests];
    this.editingMode = true;
    this.isInterestModalOpen = false;
    this.calculateProgress();
  }
 // added
  saveAll(): void {
    this.editingMode = false;
    this.originalUser = { ...this.user }; // Simulate saving all data
    this.user.id = localStorage.getItem('My_ID');
    this.calculateProgress();
    alert('Profile saved successfully!');
    console.log(JSON.stringify(this.user));
    // this.http.put('http://your-backend-api/update-user', this.user)
    this.http.post('http://localhost:3000/api/update-user', this.user)
      .subscribe(
        (response) => {
          console.log('User data saved successfully:', response);
        },
        (error) => {
          console.error('Error saving user data:', error);
        }
      );
  }
  calculateProgress(): void {
    const fields = Object.keys(this.user);
    const filledFields = fields.filter((key) => {
      const value = this.user[key];
      if (key === 'interest') {
        return Array.isArray(value) && value.length > 0;
      } else {
        return typeof value === 'string' && value.trim(); // Check if value is a string before trimming
      }
    });
    console.log(JSON.stringify("filledFields-->"+filledFields));
    console.log(JSON.stringify("fields-->"+fields));
    this.progress = Math.round((filledFields.length / fields.length) * 100);
   }
      


  goBack(){
    this.editing = false;
    this.isInterestModalOpen = false;
  }
 }

