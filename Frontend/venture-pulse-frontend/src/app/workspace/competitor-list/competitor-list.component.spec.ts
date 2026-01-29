import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitorListComponent } from './competitor-list.component';

describe('CompetitorListComponent', () => {
  let component: CompetitorListComponent;
  let fixture: ComponentFixture<CompetitorListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompetitorListComponent]
    });
    fixture = TestBed.createComponent(CompetitorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
