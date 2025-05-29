import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationRoleServicesComponent } from './application-role-services.component';

describe('AplicationRoleServicesComponent', () => {
  let component: ApplicationRoleServicesComponent;
  let fixture: ComponentFixture<ApplicationRoleServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationRoleServicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationRoleServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
