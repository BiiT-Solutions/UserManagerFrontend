import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationRolesListComponent } from './application-roles-list.component';

describe('ApplicationRolesListComponent', () => {
  let component: ApplicationRolesListComponent;
  let fixture: ComponentFixture<ApplicationRolesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationRolesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationRolesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
