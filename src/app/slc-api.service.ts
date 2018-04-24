import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

import { Localizacao } from './snc-table/snc-table.component'

import { environment } from '../environments/environment';

@Injectable()
export class SlcApiService {

  constructor(private http: HttpClient) {  }

  get(offset?) {
    return this.http.get(
      'http://snchomolog.cultura.gov.br/api/v1/sistemadeculturalocal/',
      {
      params: {
          offset: offset,
        }
      })
      .map(
        data => {
          let count: Number = 0;
          let localizacoes: Localizacao[] = [];
          count = data['count'];
          localizacoes = data['_embedded']['items'].map((element, index) => {
            const localizacao: Localizacao = {'cidade': '', 'uf': ''};
            localizacao.cidade = String(element['ente_federado']['localizacao']['cidade']['nome_municipio']);
            localizacao.uf = String(element['ente_federado']['localizacao']['estado']['sigla']);
            return localizacao;
          });
        return {localizacoes, count};
      }
    );
  }
}

