import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSchoolComponent } from './add-edit-school.component';

describe('AddEditSchoolComponent', () => {
  let component: AddEditSchoolComponent;
  let fixture: ComponentFixture<AddEditSchoolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddEditSchoolComponent]
    });
    fixture = TestBed.createComponent(AddEditSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
