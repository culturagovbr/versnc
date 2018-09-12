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

@Injectable()
export class SlcApiService {

  private sncUrlHmgLocal = 'http://hmg.snc.cultura.gov.br/api/v1/sistemadeculturalocal/';
  private sncUrlLocal = 'http://localhost:8000/api/v1/sistemadeculturalocal';
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

  getComponentes(acoes_plano_trabalho: {}) {
    let componentes = [];

    for (var key in acoes_plano_trabalho) {
      componentes.push({ key: key, value: '' });
      
      if (acoes_plano_trabalho[key].hasOwnProperty('situacao')) {
        componentes.push({ key: key, value: acoes_plano_trabalho[key] });
      }
    }

    return componentes;
  }

  searchFilter(queries): Observable<any> {
    return this.http.get(this.sncUrlHmgLocal, { params: queries })
      .map(res => {
        let entesFederados: Entidade[] = [];
        let count: number = res['count'];
        let count_estados: number = res['estados'];
        let estados_aderidos: number = res['estados_aderidos'];

        entesFederados = res['_embedded']['items'].map((element, index) => {
          const entidade: Entidade = {
            'id': '', 'ente_federado': '', 'situacao_adesao': '',
            'conselho': '', 'acoes_plano_trabalho': [], 'link_entidade': '',
            'nome_municipio': '', 'sigla_estado': '',
            'data_adesao': '', 'municipioUF': '', 'nome_estado': ''
          };

          this.definirPropriedadesEntidade(entidade, element);

          return entidade;
        });

        return { entesFederados, count, count_estados, estados_aderidos };
      });
  }

  carregarPagina(index: number, queries) {
    this.searchFilter(queries).subscribe(
      resposta => {
        this.trocaBusca([resposta['count'], resposta['entesFederados'], queries, index, resposta['count_estados'], resposta['estados_aderidos']]);
        this.router.navigate(['/tabela-uf-municipio']);
      });
  }

  definirPropriedadesEntidade(entidade, element) { //define as propriedades padrão do Ente Federado
    entidade.id = element['id'];
    entidade.link_entidade = String(element['_links']['self']['href']);
    entidade.ente_federado = element['ente_federado'];
    entidade.nome_estado = element['ente_federado']['localizacao']['estado']['nome_uf'];
    entidade.sigla_estado = element['ente_federado']['localizacao']['estado']['sigla'];
    entidade.data_adesao = element['data_adesao'];

    entidade.conselho = element['conselho'] ? element['conselho'] : '';
    entidade.situacao_adesao = element['situacao_adesao'] ? String(element['situacao_adesao']['situacao_adesao']) : '';

    if (element['_embedded']['acoes_plano_trabalho']) {
      let acoes_plano_trabalho = element['_embedded']['acoes_plano_trabalho'];
      console.log(acoes_plano_trabalho);
      entidade.acoes_plano_trabalho = this.getComponentes(acoes_plano_trabalho);
    }

    if (element['ente_federado']['localizacao']['cidade'] !== null) {
      entidade.nome_municipio = String(element['ente_federado']['localizacao']['cidade']['nome_municipio']);
      entidade.municipioUF = entidade.nome_municipio + " - " + entidade.sigla_estado;
    } else {
      entidade.nome_municipio = null;
      entidade.municipioUF = entidade.nome_estado;
    }

  }
}
