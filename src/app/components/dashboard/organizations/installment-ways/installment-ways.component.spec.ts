import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentWaysComponent } from './installment-ways.component';

describe('InstallmentWaysComponent', () => {
  let component: InstallmentWaysComponent;
  let fixture: ComponentFixture<InstallmentWaysComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InstallmentWaysComponent]
    });
    fixture = TestBed.createComponent(InstallmentWaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
