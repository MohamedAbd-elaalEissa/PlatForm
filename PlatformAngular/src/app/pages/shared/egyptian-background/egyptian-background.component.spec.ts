import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgyptianBackgroundComponent } from './egyptian-background.component';

describe('EgyptianBackgroundComponent', () => {
  let component: EgyptianBackgroundComponent;
  let fixture: ComponentFixture<EgyptianBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EgyptianBackgroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EgyptianBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
