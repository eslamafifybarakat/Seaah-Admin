import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentWaysListComponent } from './installment-ways-list.component';

describe('InstallmentWaysListComponent', () => {
  let component: InstallmentWaysListComponent;
  let fixture: ComponentFixture<InstallmentWaysListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InstallmentWaysListComponent]
    });
    fixture = TestBed.createComponent(InstallmentWaysListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
