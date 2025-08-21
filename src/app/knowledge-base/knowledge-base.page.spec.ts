import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KnowledgeBasePage } from './knowledge-base.page';

describe('KnowledgeBasePage', () => {
  let component: KnowledgeBasePage;
  let fixture: ComponentFixture<KnowledgeBasePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(KnowledgeBasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
