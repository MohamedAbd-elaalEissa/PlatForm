import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicsBackgroundComponent } from './physics-background.component';

describe('PhysicsBackgroundComponent', () => {
  let component: PhysicsBackgroundComponent;
  let fixture: ComponentFixture<PhysicsBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhysicsBackgroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhysicsBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
