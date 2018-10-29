import { TestBed, inject, async, fakeAsync } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { SlcApiService } from './slc-api.service';
import { MessageService } from './message.service';
import { Entidade } from './models/entidade.model';
import { Location } from '@angular/common';
import { RouterTestingModule} from '@angular/router/testing';


describe('SlcApiService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        SlcApiService,
        MessageService,
        Location,
      ]
    });
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  }));

  it('deve retornar o service', inject([SlcApiService], (service: SlcApiService) => {
    expect(service).toBeTruthy();
  }));

  it('service tem o metodo search()', inject([SlcApiService], (service: SlcApiService) => {
    expect(service.searchFilter('')).toBeTruthy();
  }));

  it('retorna um unico elemento da API', (() => {
    const response: Entidade = {
      acoes_plano_trabalho: null,
      conselho: '',
      data_adesao: undefined,
      ente_federado: {
          cnpj_prefeitura: '',
          localizacao: { bairro: '',
                         cep: '',
                         cidade: {codigo_ibge: 170710, nome_municipio: 'Divinópolis do Tocantins'},
                         complemento: '',
                         endereco: '',
                         estado: {codigo_ibge: 17, sigla: 'TO'}
                        },
          telefones: { telefone_um: '', telefone_dois: '', telefone_tres: '' },
          endereco_eletronico: null },
      id: 4456,
      link_entidade: 'http://hmg.snc.cultura.gov.br/api/v1/sistemadeculturalocal/4456.json',
      nome_municipio: 'Divinópolis do Tocantins',
      sigla_estado: 'TO',
      situacao_adesao: '',
    };

    httpClient.get<Entidade>('http://hmg.snc.cultura.gov.br/api/v1/sistemadeculturalocal/')
      .subscribe(data => expect(data).toEqual(response));
    }));

  it('verifica obtenção dos componentes com situação', inject([SlcApiService], (service: SlcApiService) => {
    let response = {
        "id": 6186,
        "criacao_lei_sistema_cultura": {
          "lei_sistema_cultura": null,
          "situacao": "Em preenchimento"
        },
        "criacao_orgao_gestor": {
          "relatorio_atividade_secretaria": null,
          "situacao": "Em preenchimento"
        },
        "criacao_conselho_cultural": {
          "ata_regimento_aprovado": null,
          "situacao": "Em preenchimento"
        },
        "criacao_fundo_cultura": {
          "cnpj_fundo_cultura": null,
          "lei_fundo_cultura": null,
          "situacao": "Em preenchimento"
        },
        "criacao_plano_cultura": {
          "relatorio_diretrizes_aprovadas": null,
          "minuta_preparada": null,
          "ata_reuniao_aprovacao_plano": null,
          "ata_votacao_projeto_lei": null,
          "lei_plano_cultura": null,
          "situacao": "Em preenchimento"
        },
    };

    let componentes = service.getComponentes(response);
    expect(componentes.length).toEqual(5);
    for(var i=0; i<componentes.length; i++) {
      expect(componentes[i].value.situacao).toEqual("Em preenchimento");
    }
  }));

  it('verifica obtenção dos componentes sem situação', inject([SlcApiService], (service: SlcApiService) => {
    let response = {
        "id": 6061,
        "criacao_lei_sistema_cultura": null,
        "criacao_orgao_gestor": null,
        "criacao_conselho_cultural": null,
        "criacao_fundo_cultura": null,
        "criacao_plano_cultura": null,
        "_embedded": {
            "sistema_cultura_local": {
                "_links": {
                    "self": {
                        "href": "http://localhost:8000/api/v1/sistemadeculturalocal/4327/?format=json"
                    }
                }
            }
        }
    };

    let componentes = service.getComponentes(response);
    expect(componentes.length).toEqual(5);
    for(var i=0; i<componentes.length; i++) {
      expect(componentes[i].value).toEqual("");
    }
  }));

  it('verifica obtenção dos componentes quando a api retorna nulo', inject([SlcApiService], (service: SlcApiService) => {
    let response = null;

    let componentes = service.getComponentes(response);
    expect(componentes.length).toEqual(0);
  }));

});