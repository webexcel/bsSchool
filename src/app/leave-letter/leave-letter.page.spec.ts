import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaveLetterPage } from './leave-letter.page';

describe('LeaveLetterPage', () => {
  let component: LeaveLetterPage;
  let fixture: ComponentFixture<LeaveLetterPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LeaveLetterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
