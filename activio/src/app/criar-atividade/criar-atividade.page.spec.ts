import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CriarAtividadePage } from './criar-atividade.page';

describe('CriarAtividadePage', () => {
  let component: CriarAtividadePage;
  let fixture: ComponentFixture<CriarAtividadePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CriarAtividadePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
