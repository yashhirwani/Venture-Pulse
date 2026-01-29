import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressStepperComponent } from './progress-stepper.component';

describe('ProgressStepperComponent', () => {
  let component: ProgressStepperComponent;
  let fixture: ComponentFixture<ProgressStepperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProgressStepperComponent]
    });
    fixture = TestBed.createComponent(ProgressStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
