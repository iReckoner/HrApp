import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Leavehistory } from './leavehistory';

describe('Leavehistory', () => {
  let component: Leavehistory;
  let fixture: ComponentFixture<Leavehistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Leavehistory],
    }).compileComponents();

    fixture = TestBed.createComponent(Leavehistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
