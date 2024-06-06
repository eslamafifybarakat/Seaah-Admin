import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBlogComponent } from './add-edit-blog.component';

describe('AddEditBlogComponent', () => {
  let component: AddEditBlogComponent;
  let fixture: ComponentFixture<AddEditBlogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditBlogComponent]
    });
    fixture = TestBed.createComponent(AddEditBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
