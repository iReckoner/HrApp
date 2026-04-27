import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Leaveform } from './leaveform';

describe('Leaveform', () => {
  let component: Leaveform;
  let fixture: ComponentFixture<Leaveform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Leaveform],
    }).compileComponents();

    fixture = TestBed.createComponent(Leaveform);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
