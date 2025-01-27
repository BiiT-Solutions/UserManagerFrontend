import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationTeamListComponent } from './organization-team-list.component';

describe('UserFormComponent', () => {
  let component: OrganizationTeamListComponent;
  let fixture: ComponentFixture<OrganizationTeamListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationTeamListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationTeamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
