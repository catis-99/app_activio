import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaAtividadesPage } from './lista-atividades.page';

describe('ListaAtividadesPage', () => {
  let component: ListaAtividadesPage;
  let fixture: ComponentFixture<ListaAtividadesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaAtividadesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
