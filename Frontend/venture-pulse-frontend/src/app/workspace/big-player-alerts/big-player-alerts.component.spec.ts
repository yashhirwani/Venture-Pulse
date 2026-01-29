import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigPlayerAlertsComponent } from './big-player-alerts.component';

describe('BigPlayerAlertsComponent', () => {
  let component: BigPlayerAlertsComponent;
  let fixture: ComponentFixture<BigPlayerAlertsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BigPlayerAlertsComponent]
    });
    fixture = TestBed.createComponent(BigPlayerAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
