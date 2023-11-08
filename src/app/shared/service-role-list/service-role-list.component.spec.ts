import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRoleListComponent } from './service-role-list.component';

describe('ServiceRoleListComponent', () => {
  let component: ServiceRoleListComponent;
  let fixture: ComponentFixture<ServiceRoleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceRoleListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceRoleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
