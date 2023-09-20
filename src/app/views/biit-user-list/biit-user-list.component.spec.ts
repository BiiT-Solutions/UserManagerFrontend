import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiitUserListComponent } from './biit-user-list.component';

describe('BiitUserListComponent', () => {
  let component: BiitUserListComponent;
  let fixture: ComponentFixture<BiitUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiitUserListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiitUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
