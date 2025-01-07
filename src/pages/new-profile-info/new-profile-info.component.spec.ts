import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProfileInfoComponent } from './new-profile-info.component';

describe('NewProfileInfoComponent', () => {
  let component: NewProfileInfoComponent;
  let fixture: ComponentFixture<NewProfileInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewProfileInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewProfileInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
