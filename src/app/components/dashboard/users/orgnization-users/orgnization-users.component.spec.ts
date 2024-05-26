import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgnizationUsersComponent } from './orgnization-users.component';

describe('OrgnizationUsersComponent', () => {
  let component: OrgnizationUsersComponent;
  let fixture: ComponentFixture<OrgnizationUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrgnizationUsersComponent]
    });
    fixture = TestBed.createComponent(OrgnizationUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
