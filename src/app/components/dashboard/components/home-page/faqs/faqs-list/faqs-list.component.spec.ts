import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqsListComponent } from './faqs-list.component';

describe('FaqsListComponent', () => {
  let component: FaqsListComponent;
  let fixture: ComponentFixture<FaqsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FaqsListComponent]
    });
    fixture = TestBed.createComponent(FaqsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
