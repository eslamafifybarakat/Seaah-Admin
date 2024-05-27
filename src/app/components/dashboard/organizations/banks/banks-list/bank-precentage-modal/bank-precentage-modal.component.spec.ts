import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankPrecentageModalComponent } from './bank-precentage-modal.component';

describe('BankPrecentageModalComponent', () => {
  let component: BankPrecentageModalComponent;
  let fixture: ComponentFixture<BankPrecentageModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BankPrecentageModalComponent]
    });
    fixture = TestBed.createComponent(BankPrecentageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
