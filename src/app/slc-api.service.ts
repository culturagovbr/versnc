import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Response } from '@angular/http';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { MessageService } from './message.service';

import { Entidade } from './models/entidade.model';
import { PlanoTrabalho } from './models/planotrabalho.model';

import { element } from 'protractor';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { environment } from './../environments/environment';

@Injectable()
export class SlcApiService {

  private API_URL = environment.API_URL;
  private listaRetorno = {};
  private buscar = new BehaviorSubject<any>([]);
  buscaAtual = this.buscar.asObservable();
  private paginaAtual: number = 0;
  private tituloEnteFederado;

  trocaBusca(any) {
    this.buscar.next(any);
  }

  constructor(private http: HttpClient,
    private messageService: MessageService,
    private location: Location,
    private router: Router) {
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('slc-api.service: ' + message);
  }

  searchFilter(queries): Observable<any> {
    return this.http.get(this.API_URL, { params: queries })
      .map(res => {
        let entesFederados: Entidade[] = [];
        let count: number = res['count'];
        let count_estados: number = res['estados'];
        let estados_aderidos: number = res['estados_aderidos'];
        let municipios_aderidos: number = res['municipios_aderidos'];

        entesFederados = res['_embedded']['items'].map((element, index) => {
          const entidade: Entidade = {
            id: '',
            situacao_adesao: '',
            acoes_plano_trabalho: [],
            cod_situacao_adesao: '',
            nome: '',
            sigla_estado: '',
            data_adesao: '',
            is_municipio: '',
            cod_ibge: '',
          };

          this.definirPropriedadesEntidade(entidade, element);

          return entidade;
        });

        return { entesFederados, count, count_estados, estados_aderidos, municipios_aderidos };
      });
  }

  carregarPagina(index: number, queries) {
    this.searchFilter(queries).subscribe(
      resposta => {
        this.trocaBusca([resposta['count'], resposta['entesFederados'], queries, index,
        resposta['count_estados'], resposta['estados_aderidos'], resposta['municipios_aderidos']]);
        this.router.navigate(['/tabela-uf-municipio']);
      });
  }

  getComponentes(acoes_plano_trabalho: {}) {
    let componentes = [];
    for (var key in acoes_plano_trabalho) {
      componentes.push({ key: key, value: acoes_plano_trabalho[key] });
    }
    return componentes;
  }

  definirPropriedadesEntidade(entidade, element) { //define as propriedades padrão do Ente Federado
    entidade.id = element.id;
    entidade.cod_ibge = element._embedded.ente_federado.cod_ibge;
    entidade.nome = element._embedded.ente_federado.nome;
    entidade.sigla_estado = element._embedded.ente_federado.sigla;
    entidade.data_adesao = element.data_adesao;
    entidade.is_municipio = element._embedded.ente_federado.is_municipio;
    entidade.link_publicacao_acordo = element.link_publicacao_acordo;

    entidade.situacao_adesao = element._embedded.situacao_adesao;

    entidade.cnpj = element._embedded.sede ? element._embedded.sede.localizacao.cnpj : '-';
    entidade.localizacao = element._embedded.sede ? element._embedded.sede.localizacao : '-';
    entidade.email = element._embedded.sede ? element._embedded.sede.endereco_eletronico : '-';
    entidade.telefone = element._embedded.sede ? element._embedded.sede.telefones.telefone_um : '-';

    entidade.pib = element._embedded.ente_federado.pib;
    entidade.idh = element._embedded.ente_federado.idh;
    entidade.populacao = element._embedded.ente_federado.populacao;

    entidade.prefeito = element._embedded.governo ? element._embedded.governo.nome_prefeito : '-';
    entidade.gestor_cultura = element._embedded.cultura ? element._embedded.cultura.nome_gestor_cultura : '-';


    entidade.situacao_adesao = element.situacao_adesao ? element.situacao_adesao : '';
    entidade.cod_situacao_adesao = element.cod_situacao_adesao ? element.cod_situacao_adesao : '';

    let institucionalizacao, implementacao, adesao;
    institucionalizacao = implementacao = adesao = false;


    adesao = (entidade.cod_situacao_adesao == 6); //Publicado no DOU

    if (element.acoes_plano_trabalho) {
      let componentes = element.acoes_plano_trabalho._embedded;
      entidade.acoes_plano_trabalho = this.getComponentes(componentes);
      //Institucionalização
      let lei_sistema = componentes['criacao_lei_sistema'] && componentes['criacao_lei_sistema']['cod_situacao'] ? componentes['criacao_lei_sistema']['cod_situacao'] : -1;
      let orgao_gestor = componentes['criacao_orgao_gestor'] && componentes['criacao_orgao_gestor']['cod_situacao'] ? componentes['criacao_orgao_gestor']['cod_situacao'] : -1;
      let plano_cultura = componentes['criacao_plano_cultura'] && componentes['criacao_plano_cultura']['cod_situacao'] ? componentes['criacao_plano_cultura']['cod_situacao'] : -1;
      let fundo_cultura = componentes['criacao_fundo_cultura'] && componentes['criacao_fundo_cultura']['cod_situacao'] ? componentes['criacao_fundo_cultura']['cod_situacao'] : -1;
      let conselho_cultural_lei = componentes['criacao_conselho_cultural_lei'] && componentes['criacao_conselho_cultural_lei']['cod_situacao'] ? componentes['criacao_conselho_cultural_lei']['cod_situacao'] : -1;
      const concluidoOuAprovadoRessalvas = [2, 3]
      institucionalizacao = (lei_sistema in concluidoOuAprovadoRessalvas &&
        orgao_gestor in concluidoOuAprovadoRessalvas &&
        plano_cultura in concluidoOuAprovadoRessalvas &&
        fundo_cultura in concluidoOuAprovadoRessalvas &&
        conselho_cultural_lei in concluidoOuAprovadoRessalvas
      );

      //implementação
      let conselho_cultural_ata = componentes['criacao_conselho_cultural_ata'] && componentes['criacao_conselho_cultural_ata']['cod_situacao'] ? componentes['criacao_conselho_cultural_ata']['cod_situacao'] : -1;
      let fundo_cultura_cnpj = componentes['criacao_fundo_cultura_cnpj'] && componentes['criacao_fundo_cultura_cnpj']['cod_situacao'] ? componentes['criacao_fundo_cultura_cnpj']['cod_situacao'] : -1;
      let plano_metas = componentes['criacao_plano_metas'] && componentes['criacao_plano_metas']['cod_situacao'] ? componentes['criacao_plano_metas']['cod_situacao'] : -1;

      implementacao = (conselho_cultural_ata in concluidoOuAprovadoRessalvas &&
        fundo_cultura_cnpj in concluidoOuAprovadoRessalvas &&
        plano_metas in concluidoOuAprovadoRessalvas
      );

    }

    entidade.adesao_concluida = adesao;
    entidade.institucionalizacao_concluida = institucionalizacao;
    entidade.implementacao_concluida = implementacao;

  }
}
