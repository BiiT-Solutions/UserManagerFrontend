import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiitUserGroupListComponent } from './biit-user-group-list.component';

describe('BiitUserListComponent', () => {
  let component: BiitUserGroupListComponent;
  let fixture: ComponentFixture<BiitUserGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiitUserGroupListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiitUserGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
