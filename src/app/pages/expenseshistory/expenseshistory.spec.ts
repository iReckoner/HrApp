import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Expenseshistory } from './expenseshistory';

describe('Expenseshistory', () => {
  let component: Expenseshistory;
  let fixture: ComponentFixture<Expenseshistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Expenseshistory],
    }).compileComponents();

    fixture = TestBed.createComponent(Expenseshistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
