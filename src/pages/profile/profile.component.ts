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
  UserId: any;
  originalUser: any = {};
  editing: boolean = false;
  editingMode: boolean = false;
  currentField: string = '';
  currentValue: string = '';
  currentTitle: string = ''; // For Work title
  currentCompany: string = ''; // For Work company
  currentGender: any = ''; // For Gender
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
genderOptions = [
  { label: 'Male', icon: './../../assets/male.png' },
  { label: 'Female', icon: './../../assets/female.png' },
  { label: 'Non-Binary', icon: './../../assets/nonbinary.png' },
  { label: 'Prefer Not to Say', icon: './../../assets/unknown.png' },
  { label: 'Other', icon: './../../assets/other.png' }
];
heightOptions: string[] = Array.from({ length: 81 }, (_, i) => `${120 + i}`);
years: string[] = Array.from({ length: 51 }, (_, i) => `${1970 + i}`);

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
    try {
    console.log("Profile");
    const UserId = localStorage.getItem('My_ID'); 
    console.log("UserId--->"+UserId);
    this.http.get<any>(`http://localhost:3000/userDetail?userId=${UserId}`).subscribe((data) => {
      this.user.id = UserId;
      this.user = { ...data };
      
      if (Array.isArray(this.user.profilePicture)) {
        this.user.profilePicture = `data:image/jpeg;base64,${this.byteArrayToBase64(this.user.profilePicture.data)}`;
      } else if (typeof this.user.profilePicture === 'string') {
        // If it's already a base64 string, just prepend the data URL
        this.user.profilePicture = `data:image/jpeg;base64,${this.user.profilePicture.data}`;
      } else {
        console.error('Unexpected format for profilePicture:', this.user.profilePicture.data);
      }
      console.log('Data from db--->'+JSON.stringify(this.user.profilePicture));
      this.originalUser = { ...data };
      // console.log('Data from db--->'+JSON.stringify(this.user));
      this.selectedInterests = this.user.interest ? [...this.user.interest] : [];
      this.initializeMissingFields();
      this.calculateProgress();
    });
  } catch(error){}
  }
  initializeMissingFields(): void {
    [...this.aboutItems, ...this.moreItems].forEach((item) => {
      if (!this.user[item.key]) {
        this.user[item.key] = '';
      }
    });
   this.user.work = this.user.work || '';
   this.user.gender = this.user.gender || '';
  }
  byteArrayToBase64(byteArray: number[]): string {
    const binaryString = byteArray.map(byte => String.fromCharCode(byte)).join('');
    return window.btoa(binaryString);
  }
  startEditing(field: string): void {
    this.inputActive = false;
    this.currentField = field;
    // if (field === 'profilePhoto') {
    //   this.openPhotoOptions();
    // }
    if (field === 'work') {
      const [title, company] = (this.user.work || '').split(' at ');
      this.currentTitle = title || '';
      this.currentCompany = company || '';
      this.question = "What's your Work Title and Company?";
    } 
     else if (field === 'gender') {
      this.currentGender = this.user.gender || '';
      this.question = "What's your Gender?";
    } 
    else {
      this.currentValue = this.user[field] || '';
      this.question = `What's your ${field}?`;
    }
    this.editing = true;
   }
   openPhotoOptions() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'camera'; // This will open the camera on mobile devices

    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.uploadPhoto(file);
      }
    };

    input.click();
  }
  // Method to upload the selected photo
  uploadPhoto(file: File) {
    const reader = new FileReader();
  
    // This event is triggered when the file is read successfully
    reader.onload = (e: any) => {
      const img = new Image();
      img.src = e.target.result;
  
      img.onload = () => {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        // Set the desired width and height for the resized image
        const MAX_WIDTH = 800; // Set your desired max width
        const MAX_HEIGHT = 800; // Set your desired max height
        let width = img.width;
        let height = img.height;
  
        // Calculate the new dimensions while maintaining the aspect ratio
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
  
        // Resize the canvas to the new dimensions
        canvas.width = width;
        canvas.height = height;
  
        // Draw the image on the canvas
        ctx?.drawImage(img, 0, 0, width, height);
  
        // Convert the canvas to a base64 string
        const resizedImage = canvas.toDataURL('image/jpeg', 0.7); // Adjust quality (0.7) as needed
        this.user.profilePicture = resizedImage; 
        // this.user.profilePicture = 'dfghj';
        console.log('Profile picture updated:', this.user.profilePicture);
      };
    };
  
    // Read the file as a base64 string
    reader.readAsDataURL(file);
  }

  startEditingg(){
    this.editingMode = true;
  }
  onInput(): void {
    this.inputActive = !!this.currentValue.trim() || !!this.currentGender;
  } 
  saveEdit(field: string): void {
    if (field === 'work' && this.currentTitle.trim() && this.currentCompany.trim()) {
      this.user.work = `${this.currentTitle} at ${this.currentCompany}`;
    } 
    else if (field === 'gender' && this.currentGender) {
      this.user.gender = this.currentGender;
    } 
    else if (this.currentValue.trim()) {
      this.user[field] = this.currentValue.trim();
    }
    this.editing = false;
    this.editingMode = true;
    this.calculateProgress();
    this.inputActive = false;
  }
   selectGender(option: { label: string }): void {
    this.currentGender = option.label;
    this.inputActive = true;
   }
  // added
  startEditingInterest(): void {
    this.isInterestModalOpen = true;
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
    this.http.post('http://localhost:3000/updateUser', this.user)
      .subscribe(
        (response) => {
          console.log('User data saved successfully:', response);
        },
        (error) => {
          console.error('Error saving user data:', error);
        }
      );
  }
  // calculateProgress(): void {
  //   const fields = Object.keys(this.user);
  //   const filledFields = fields.filter((key) => {
  //     const value = this.user[key];
  //     if (key === 'interest') {
  //       return Array.isArray(value) && value.length > 0;
  //     } else {
  //       return typeof value === 'string' && value.trim();
  //     }
  //   });
  //   this.progress = Math.round((filledFields.length / fields.length) * 100);
  // }
  calculateProgress(): void {
    const fields = Object.keys(this.user);
    const filledFields = fields.filter((key) => {
      const value = this.user[key];
      return typeof value === 'string' && value.trim() || (key === 'interest' && Array.isArray(value) && value.length > 0);
    });
    this.progress = Math.round((filledFields.length / fields.length) * 100);
  }
      


  goBack(){
    this.editing = false;
    this.isInterestModalOpen = false;
  }
 }

