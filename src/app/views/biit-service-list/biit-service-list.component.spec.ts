import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiitServiceListComponent } from './biit-service-list.component';

describe('BiitServiceListComponent', () => {
  let component: BiitServiceListComponent;
  let fixture: ComponentFixture<BiitServiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiitServiceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiitServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
