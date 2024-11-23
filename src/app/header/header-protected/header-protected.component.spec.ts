import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderProtectedComponent } from './header-protected.component';

describe('HeaderProtectedComponent', () => {
  let component: HeaderProtectedComponent;
  let fixture: ComponentFixture<HeaderProtectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderProtectedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderProtectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
