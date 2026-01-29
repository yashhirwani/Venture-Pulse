import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingComponent } from './processing.component';

describe('ProcessingComponent', () => {
  let component: ProcessingComponent;
  let fixture: ComponentFixture<ProcessingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessingComponent]
    });
    fixture = TestBed.createComponent(ProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
