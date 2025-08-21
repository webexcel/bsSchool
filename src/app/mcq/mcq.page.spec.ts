import { ComponentFixture, TestBed } from '@angular/core/testing';
import { McqPage } from './mcq.page';

describe('McqPage', () => {
  let component: McqPage;
  let fixture: ComponentFixture<McqPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(McqPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
