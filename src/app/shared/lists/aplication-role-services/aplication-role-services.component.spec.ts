import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AplicationRoleServicesComponent } from './aplication-role-services.component';

describe('AplicationRoleServicesComponent', () => {
  let component: AplicationRoleServicesComponent;
  let fixture: ComponentFixture<AplicationRoleServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AplicationRoleServicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AplicationRoleServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
