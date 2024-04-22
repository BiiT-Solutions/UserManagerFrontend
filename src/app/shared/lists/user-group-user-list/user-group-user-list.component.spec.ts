import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGroupUserListComponent } from './user-group-user-list.component';

describe('UserFormComponent', () => {
  let component: UserGroupUserListComponent;
  let fixture: ComponentFixture<UserGroupUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserGroupUserListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserGroupUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
