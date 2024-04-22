import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleApplicationsListComponent } from './role-applications-list.component';

describe('RoleApplicationsListComponent', () => {
  let component: RoleApplicationsListComponent;
  let fixture: ComponentFixture<RoleApplicationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleApplicationsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleApplicationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
