import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalenderModPage } from './calender-mod.page';

describe('CalenderModPage', () => {
  let component: CalenderModPage;
  let fixture: ComponentFixture<CalenderModPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CalenderModPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
