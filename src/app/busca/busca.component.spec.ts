import { async, inject, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BuscaComponent } from './busca.component';
import { MaterialModule } from '../material/material.module';
import { SlcApiService } from '../slc-api.service';
import { AppModule } from '../app.module';
import { MessageService } from '../message.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { renderTemplate, elementStart } from '@angular/core/src/render3/instructions';
import { element } from 'protractor';

describe('BuscaComponent', () => {
  let component: BuscaComponent;
  let fixture: ComponentFixture<BuscaComponent>;
  
  let event;
  event = document.createEvent("Events");
  event.initEvent('keypress', true, false);    
  event.keyCode = 13;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, HttpClientModule, HttpClientTestingModule, NoopAnimationsModule, RouterTestingModule],
      declarations: [BuscaComponent],
      providers: [SlcApiService, MessageService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Verifica se a query de UF  é setada corretamente ao digitar string de tamanho menor que 3', () => {
    component['termoSimples'] = 'df';
    component.onRealizarBuscaComEnter(event);

    expect(component['queries']['ente_federado']).toEqual('DF');
    expect(component['queries']['nome_municipio']).toEqual('');
  });

  it('Verifica se a query de Municipio é setada corretamente ao digitar string de tamanho maior que 2', () => {
    component['termoSimples'] = 'Brasília';
    component.onRealizarBuscaComEnter(event);

    expect(component['queries']['ente_federado']).toEqual('Brasília');
    expect(component['queries']['estado_sigla']).toEqual('');
  });

  it('Verifica se descrição do campo de busca contem - Consulte seu Estado ou Município - ', () => {
    const htmlComponent = fixture.debugElement.nativeElement;
    expect(htmlComponent.querySelector('h4').textContent).toContain('Consulte seu Estado ou Município');
  });

  it('Verifica método que trata a pesquisa do nome do Município por extenso - Busca Simples', inject([SlcApiService], (service: SlcApiService) => {
    let htmlComponent = fixture.debugElement.nativeElement;    
    let inputElement = htmlComponent.querySelector('input');

    inputElement.value = 'Barreiras';
    inputElement.dispatchEvent(new Event('input'));
  
    component.onRealizarBuscaComEnter(event);
    expect(component['termoSimples']).toBe('Barreiras');
    expect(component.queries['ente_federado']).toBe('Barreiras');

  }));

  it('Verifica método que trata a pesquisa da sigla do Estado - Busca Simples', inject([SlcApiService], (service: SlcApiService) => {
    let htmlComponent = fixture.debugElement.nativeElement;    
    let inputElement = htmlComponent.querySelector('input');

    inputElement.value = 'pe';
    inputElement.dispatchEvent(new Event('input'));
  
    component.onRealizarBuscaComEnter(event);
    expect(component['termoSimples']).toBe('pe');
    expect(component['queries']['ente_federado']).toBe('PE');
  }));
  
  it('Verifica método que trata a pesquisa pelo nome do Estado por extenso - Busca Avançada', inject([SlcApiService], (service: SlcApiService) => {
    component['termoUF'] = 'Distrito Federal';
    component['seletorTipoBusca'] = true;
    component.onRealizarBuscaComEnter(event);

    expect(component.queries['nome_uf']).toEqual('Distrito Federal');
  }));

  it('Verifica método que trata a pesquisa pela sigla do Estado - Busca Avançada', inject([SlcApiService], (service: SlcApiService) => {
    component['termoUF'] = 'ba';
    component['seletorTipoBusca'] = true;
    component.onRealizarBuscaComEnter(event);

    expect(component.queries['estado_sigla']).toEqual('BA');
  }));

  it('Verifica se a query é setada corretamente com array de componentes ativo', 
    inject([SlcApiService], (service: SlcApiService) => {

    component['componentes'] = [true, true, true, true, true];
    component['seletorTipoBusca'] = true;
    component.onRealizarBuscaComEnter(event);
  
    expect(component.queries['situacao_lei_id']).toBe('2');
    expect(component.queries['situacao_plano_id']).toBe('2');
    expect(component.queries['situacao_orgao_id']).toBe('2');
    expect(component.queries['situacao_fundo_id']).toBe('2');
    expect(component.queries['situacao_conselho_id']).toBe('2');
  }));

  it('Verifica se a query é setada corretamente com array de componentes inativo', 
    inject([SlcApiService], (service: SlcApiService) => {

    component['componentes'] = [false, false, false, false, false];
    component['seletorTipoBusca'] = true;
    component.onRealizarBuscaComEnter(event);
  
    expect(component.queries['situacao_lei_id']).toBe('');
    expect(component.queries['situacao_plano_id']).toBe('');
    expect(component.queries['situacao_orgao_id']).toBe('');
    expect(component.queries['situacao_fundo_id']).toBe('');
    expect(component.queries['situacao_conselho_id']).toBe('');
  }));

});
