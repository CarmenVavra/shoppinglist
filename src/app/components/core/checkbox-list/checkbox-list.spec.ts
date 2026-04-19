import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxList } from './checkbox-list';

describe('CheckboxListComponent', () => {
  let component: CheckboxList;
  let fixture: ComponentFixture<CheckboxList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxList]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CheckboxList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
