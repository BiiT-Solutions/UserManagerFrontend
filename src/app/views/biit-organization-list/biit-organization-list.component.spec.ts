import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiitOrganizationListComponent } from './biit-organization-list.component';

describe('BiitUserListComponent', () => {
  let component: BiitOrganizationListComponent;
  let fixture: ComponentFixture<BiitOrganizationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiitOrganizationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiitOrganizationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
