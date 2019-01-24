import { async, inject, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BuscaComponent } from './busca.component';
import { MaterialModule } from '../material/material.module';
import { SlcApiService } from '../slc-api.service';
import { MessageService } from '../message.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';


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


  it('Verifica se a query de busca está procurando pelo nome do ente federado', () => {
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

  it('Verifica método que trata a pesquisa pela sigla do Estado - Busca Avançada', inject([SlcApiService], (service: SlcApiService) => {
    component['termoUF'] = 'ba';
    component['seletorTipoBusca'] = true;
    component.onRealizarBuscaComEnter(event);

    expect(component.queries['estado_sigla']).toEqual('BA');
  }));

  it('Verifica se o params é setado corretamente com array de componentes ativo', 
    inject([SlcApiService], (service: SlcApiService) => {

    component['componentes'] = [true, true, true, true, true];
    component['seletorTipoBusca'] = true;
    component.onRealizarBuscaComEnter(event);
  
    expect(component.params.getAll('situacao_lei_sistema')[0]).toBe('2');
    expect(component.params.getAll('situacao_lei_sistema')[1]).toBe('3');

    expect(component.params.getAll('situacao_plano_cultura')[0]).toBe('2');
    expect(component.params.getAll('situacao_plano_cultura')[1]).toBe('3');

    expect(component.params.getAll('situacao_orgao_gestor')[0]).toBe('2');
    expect(component.params.getAll('situacao_orgao_gestor')[1]).toBe('3');

    expect(component.params.getAll('situacao_fundo_cultura')[0]).toBe('2');
    expect(component.params.getAll('situacao_fundo_cultura')[1]).toBe('3');

    expect(component.params.getAll('situacao_conselho_cultural')[0]).toBe('2');
    expect(component.params.getAll('situacao_conselho_cultural')[1]).toBe('3');
    
  }));

  it('Verifica se o params é setado corretamente com array de componentes inativo', 
    inject([SlcApiService], (service: SlcApiService) => {

    component['componentes'] = [false, false, false, false, false];
    component['seletorTipoBusca'] = true;
    component.onRealizarBuscaComEnter(event);
  
    expect(component.params.get('situacao_lei_id')).toBeNull();
    expect(component.params.get('situacao_orgao_id')).toBeNull();
    expect(component.params.get('situacao_orgao_id')).toBeNull();
    expect(component.params.get('situacao_fundo_id')).toBeNull();
    expect(component.params.get('situacao_conselho_id')).toBeNull();
    
  }));

  it('Verifica se o título na tabela é modificado para ESTADO na busca avançada por Estados', inject([SlcApiService], (service: SlcApiService) => {
    component['termoUF'] = '';
    component['seletorTipoBusca'] = true;
    component['visualizarEstados'] = true;
    component.onRealizarBuscaComEnter(event);
    
    expect(component['slcApiService']['tituloEnteFederado'] == 'ESTADO')
  }));

  it('Verifica se o título na tabela é modificado para MUNICÍPIO na busca avançada por Municípios', inject([SlcApiService], (service: SlcApiService) => {
    component['termoUF'] = '';
    component['seletorTipoBusca'] = true;
    component['visualizarMunicipios'] = true;
    component.onRealizarBuscaComEnter(event);
    
    expect(component['slcApiService']['tituloEnteFederado'] == 'MUNICÍPIO')
  }));

  it('Verifica se o título na tabela é modificado para ENTE FEDERADO na busca avançada por Municípios e Estados', inject([SlcApiService], (service: SlcApiService) => {
    component['termoUF'] = '';
    component.onRealizarBuscaComEnter(event);
    
    expect(component['slcApiService']['tituloEnteFederado'] == 'ENTE FEDERADO')
  }));

});
