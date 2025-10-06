import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFormPopupComponent } from './user-form-popup.component';

describe('UserFormComponent', () => {
  let component: UserFormPopupComponent;
  let fixture: ComponentFixture<UserFormPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserFormPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFormPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
