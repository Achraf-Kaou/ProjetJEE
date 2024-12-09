import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideListNoDetailsComponent } from './ride-list-no-details.component';

describe('RideListNoDetailsComponent', () => {
  let component: RideListNoDetailsComponent;
  let fixture: ComponentFixture<RideListNoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RideListNoDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RideListNoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
