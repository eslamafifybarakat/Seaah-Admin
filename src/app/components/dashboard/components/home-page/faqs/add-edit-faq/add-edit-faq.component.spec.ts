import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditFaqComponent } from './add-edit-faq.component';

describe('AddEditFaqComponent', () => {
  let component: AddEditFaqComponent;
  let fixture: ComponentFixture<AddEditFaqComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddEditFaqComponent]
    });
    fixture = TestBed.createComponent(AddEditFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
