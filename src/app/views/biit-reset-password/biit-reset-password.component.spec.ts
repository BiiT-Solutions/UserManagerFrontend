import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiitResetPasswordComponent } from './biit-reset-password.component';

describe('BiitLoginComponent', () => {
  let component: BiitResetPasswordComponent;
  let fixture: ComponentFixture<BiitResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiitResetPasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiitResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
