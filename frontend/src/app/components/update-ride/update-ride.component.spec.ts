import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRideComponent } from './update-ride.component';

describe('UpdateRideComponent', () => {
  let component: UpdateRideComponent;
  let fixture: ComponentFixture<UpdateRideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateRideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateRideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
