import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGroupRoleListComponent } from './user-group-role-list.component';

describe('UserRoleListComponent', () => {
  let component: UserGroupRoleListComponent;
  let fixture: ComponentFixture<UserGroupRoleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserGroupRoleListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserGroupRoleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
