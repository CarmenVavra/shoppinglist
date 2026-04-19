import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlusButton } from './plus-button';

describe('PlusButtonComponent', () => {
  let component: PlusButton;
  let fixture: ComponentFixture<PlusButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlusButton]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PlusButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
