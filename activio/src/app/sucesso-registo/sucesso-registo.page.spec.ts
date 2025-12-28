import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SucessoRegistoPage } from './sucesso-registo.page';

describe('SucessoRegistoPage', () => {
  let component: SucessoRegistoPage;
  let fixture: ComponentFixture<SucessoRegistoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SucessoRegistoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
