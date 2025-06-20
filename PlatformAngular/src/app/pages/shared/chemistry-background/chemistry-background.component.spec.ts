import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemistryBackgroundComponent } from './chemistry-background.component';

describe('ChemistryBackgroundComponent', () => {
  let component: ChemistryBackgroundComponent;
  let fixture: ComponentFixture<ChemistryBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChemistryBackgroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChemistryBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
