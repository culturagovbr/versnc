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
        id: 2757,
        data_adesao:null,
        situacao_adesao:"Publicado no DOU",
        cod_situacao_adesao: "6",
      }
    }

    httpClient.get<Entidade>('"http://hmg.snc.cultura.gov.br/api/v2/sistemadeculturalocal/2757/?format=json')
      .subscribe(data => expect(data).toEqual(response));
    }));

  it('verifica obtenção dos componentes com situação', inject([SlcApiService], (service: SlcApiService) => {
    let response = {
        "criacao_lei_sistema_cultura": {
          arquivo: "http://hmg.snc.cultura.gov.br/media/3846/docs/criacaosistema/pi-smc-antonio-almeida.pdf",
          cod_situacao: "2",
          data_envio: "2018-08-17",
          situacao: "Concluída"
        },
        "criacao_orgao_gestor": {
          arquivo: "http://hmg.snc.cultura.gov.br/media/3846/docs/orgaogestor/lei_-_197__2013_-_dispoe_sobre_a_reestruturacao_administrativa_mun_mj3hutC.pdf",
          cod_situacao: "2",
          data_envio: "2018-08-17",
          situacao: "Concluída"
        },
        "criacao_conselho_cultural": {
          arquivo: "http://hmg.snc.cultura.gov.br/media/3846/docs/conselhocultural/decreto_de_nomeacao_dos_conselheiros_de_cultura_XFJ3aCH.pdf",
          cod_situacao: "2",
          data_envio: "2018-08-17",
          situacao: "Concluída",
        },
        "criacao_fundo_cultura": {
          arquivo: "http://hmg.snc.cultura.gov.br/media/3846/docs/fundocultura/decreto_k1b3YvI.pdf",
          cnpj: "22.945.625/0001-69",
          cod_situacao: "2",
          data_envio: "2018-08-17",
          situacao: "Concluída"
        },
        "criacao_plano_cultura": {
          arquivo: "http://hmg.snc.cultura.gov.br/media/3846/docs/planocultura/antonio_almeida_lei_231-16_aAoH4MK.pdf",
          cod_situacao: "2",
          data_envio: "2018-08-17",
          situacao: "Concluída"
        },
    };

    let componentes = service.getComponentes(response);
    expect(componentes.length).toEqual(5);
    for(var i=0; i<componentes.length; i++) {
      expect(componentes[i].value.situacao).toEqual("Concluída");
    }
  }));

  it('verifica obtenção dos componentes sem situação', inject([SlcApiService], (service: SlcApiService) => {
    let response = {
      "criacao_lei_sistema_cultura": null,
      "criacao_orgao_gestor": null,
      "criacao_conselho_cultural": null,
      "criacao_fundo_cultura": null,
      "criacao_plano_cultura": null
    };

    let componentes = service.getComponentes(response);
    expect(componentes.length).toEqual(5);
    componentes.forEach((componente, key) => {
        expect(componente.value).toEqual(null);
    })
  }));
});