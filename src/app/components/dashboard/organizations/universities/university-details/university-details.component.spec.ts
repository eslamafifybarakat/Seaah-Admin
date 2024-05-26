import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversityDetailsComponent } from './university-details.component';

describe('UniversityDetailsComponent', () => {
  let component: UniversityDetailsComponent;
  let fixture: ComponentFixture<UniversityDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UniversityDetailsComponent]
    });
    fixture = TestBed.createComponent(UniversityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
