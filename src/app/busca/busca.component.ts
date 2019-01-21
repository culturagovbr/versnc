import { Component, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/';
import { HttpParams } from '@angular/common/http';
import { Entidade } from '../models/entidade.model';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { SncTableComponent } from '../snc-table/snc-table.component';




import { SlcApiService } from '../slc-api.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'snc-busca',
  templateUrl: './busca.component.html',
  styleUrls: ['./busca.component.css'],
  providers: [SncTableComponent,
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }]
})

export class BuscaComponent implements OnInit {

  private listaRetorno = {};
  private listaEntidades: [Entidade];
  private seletorTipoBusca: boolean = false;
  private termoSimples: string = '';
  private termoUF: string = '';
  private page: number = 0;
  private data_adesao_min: string = '';
  private data_adesao_max: string = '';
  private filtrarEstados = true;
  private filtrarMunicipios = true;
  private componentesIds = ['situacao_lei_sistema', 'situacao_plano_cultura', 'situacao_orgao_gestor', 'situacao_fundo_cultura',
    'situacao_conselho_cultural'];
  params: HttpParams;

  constructor(private slcApiService: SlcApiService, private table: SncTableComponent) {
  }

  queries: { [query: string]: string }
    = {
      'limit': '',
      'offset': '',
      'estado_sigla': '',
      'data_adesao_min': '',
      'data_adesao_max': '',
      'nome_uf': '',
      'estadual': '',
      'municipal': '',
      'ente_federado': ''

    };

  componentes = [false, false, false, false, false]; // leiSistema, PlanoCultura, OrgaoGestor, Fundocultura, ConselhoCultura

  ngOnInit(): void {
    this.slcApiService.buscaAtual.subscribe(listaRetorno => this.listaRetorno = listaRetorno);
  }

  onRealizarBuscaComEnter(event) {
    this.slcApiService['tituloEnteFederado'] = this.definirTituloEnteFederado()['value'];
    if (event.keyCode === 13 || event.type == "click") {
      this.definirTipoDeBusca(this.seletorTipoBusca);
      this.filtraComponentes();
      this.onRealizarBusca();
    }
  }

  definirTipoDeBusca(tipoBusca: boolean) { // define as propriedades da busca de acordo com seu tipo - SIMPLES ou AVANÇADA
    if (!this.seletorTipoBusca) { // BUSCA SIMPLES - Usa somente a query 'ente_federado'
      this.limparQueriesDaBusca();
      this.queries['ente_federado'] = this.termoSimples;

    } else { // BUSCA AVANÇADA

      this.queries['ente_federado'] = this.termoSimples;

      this.queries['data_adesao_min'] = this.getDatePicker(this.data_adesao_min);
      this.queries['data_adesao_max'] = this.getDatePicker(this.data_adesao_max);
      this.queries['estadual'] = this.filtrarEstados ? 'true' : '';
      this.queries['municipal'] = this.filtrarMunicipios ? 'true' : '';
    }

    const PUBLICADOS_NO_DOU = '6'
    this.queries['situacao_adesao'] = PUBLICADOS_NO_DOU
    
    this.params = new HttpParams({ fromObject: this.queries });
  }

  filtraComponentes() {
    const STATUS_CONCLUIDO = '2';
    const STATUS_APROVADO_COM_RESSALVAS = '3';
    for (var i = 0; i < this.componentes.length; i++) {
      if (this.componentes[i]) {
        this.params = this.params.append(this.componentesIds[i], STATUS_CONCLUIDO);
        this.params = this.params.append(this.componentesIds[i], STATUS_APROVADO_COM_RESSALVAS);
      }
    }
  }

  onRealizarBusca() {
    this.listaEntidades = undefined;
    this.slcApiService['paginaAtual'] = 0; // Garante que a busca sempre seja vista inicialmente na primeira página
    this.slcApiService.carregarPagina(this.page, this.params);
  }

  limparQueriesDaBusca() { //limpa as queries de busca antes de uma busca simples ser realizada
    this.termoUF = '';
    for (var query in this.queries) {
      this.queries[query.toString()] = '';
    }

    for (var comp in this.componentes) {
      this.componentes[comp] = false;
    }
  }

  getDatePicker(datepicker: String) { // recebe um objeto Datepicker e retorna somente a data
    if (!datepicker) {
      return "";
    }
    else if (datepicker['_i']['date']) {
      var dd = datepicker['_i']['date'];
      var mm = datepicker['_i']['month']; // objeto tem as posições 0-11 por default 
      var yy = datepicker['_i']['year'];

      return (dd + '/' + (mm + 1) + '/' + yy);
    }
    else {
      return datepicker['_i']
    }
  }

  definirTituloEnteFederado(): Observable<string> { // Define o título da 1a coluna da tabela de acordo com o tipo da Busca
    if (this.filtrarEstados == true && this.filtrarMunicipios == true) {
      return Observable.of('ENTE FEDERADO');
    }
    else if (this.filtrarEstados == true && this.filtrarMunicipios == false) {
      return Observable.of('ESTADO');
    }
    else {
      return Observable.of('MUNICÍPIO');
    }

  }
}
