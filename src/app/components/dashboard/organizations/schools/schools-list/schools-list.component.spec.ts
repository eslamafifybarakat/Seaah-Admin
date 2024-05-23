import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolsListComponent } from './schools-list.component';

describe('SchoolsListComponent', () => {
  let component: SchoolsListComponent;
  let fixture: ComponentFixture<SchoolsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SchoolsListComponent]
    });
    fixture = TestBed.createComponent(SchoolsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
