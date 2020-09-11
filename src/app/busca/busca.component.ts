import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/';
import { HttpParams } from '@angular/common/http';
import { Entidade } from '../models/entidade.model';
import { FiltroComponentes, Filtro } from '../models/filtrocomponentes.model';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { SncTableComponent } from '../snc-table/snc-table.component';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment';

import { SlcApiService } from '../slc-api.service';
import { Observable } from 'rxjs/Observable';

import { AlertService } from '../_services/index';

import {NgxMaskModule} from 'ngx-mask-2'
import { min } from 'rxjs/operator/min';

@Component({
  selector: 'snc-busca',
  templateUrl: './busca.component.html',
  styleUrls: ['./busca.component.css'],
  providers: [SncTableComponent, DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: 'dd/MM/yyyy' }]
})

export class BuscaComponent implements OnInit {
  //@ViewChildren('searchBox1') inputMin: ElementRef;
  //@ViewChildren('searchBox2') inputMax: ElementRef;

  private API_URL = environment.API_URL;
  private listaRetorno = {};
  private listaEntidades: [Entidade];
  private seletorTipoBusca: boolean = false;
  private termoSimples: string = '';
  private termoUF: string = '';
  private page: number = 0;
  private data_min = '';
  private error_min = true;
  private data_max = '';
  private error_max = true;
  private filtrarEstados = true;
  private filtrarMunicipios = true;
  private filtrarOrgaoGestorDadosBancarios = false;
  private filtrarFundoCulturaDadosBancarios = false;
  private filtro_data: FiltroComponentes = new FiltroComponentes(
    new Filtro(false),
    new Filtro(false),
    new Filtro(false),
    new Filtro(false),
    new Filtro(false),
    new Filtro(false),
    new Filtro(false),
    new Filtro(false),
    new Filtro(false),
    new Filtro(false)
  );
  params: HttpParams;

  constructor(
    private slcApiService: SlcApiService,
    private table: SncTableComponent,
    private router: Router,
    private alertService: AlertService,
    private datePipe: DatePipe) { }

  success(message: string) {
    this.alertService.success(message);
  }

  error(message: string) {
    this.alertService.error(message);
  }

  info(message: string) {
    this.alertService.info(message);
  }

  warn(message: string) {
    this.alertService.warn(message);
  }

  clear() {
    this.alertService.clear();
  }

  queries: { [query: string]: string }
    = {
      'limit': '',
      'offset': '',
      'estado_sigla': '',
      'nome_uf': '',
      'estadual': '',
      'municipal': '',
      'ente_federado': '',
    };


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

  exportar(tipoExportacao) {
    this.definirTipoDeBusca(this.seletorTipoBusca);
    this.filtraComponentes();
    window.open(`${this.API_URL}?` + this.params.toString() + `&format=${tipoExportacao}`, '_blank');
  }

  definirTipoDeBusca(tipoBusca: boolean) { // define as propriedades da busca de acordo com seu tipo - SIMPLES ou AVANÇADA
    if (!this.seletorTipoBusca) { // BUSCA SIMPLES - Usa somente a query 'ente_federado'
      this.limparQueriesDaBusca();
      this.queries['ente_federado'] = this.termoSimples.length < 3 ? this.termoSimples.toUpperCase() : this.termoSimples;

    } else { // BUSCA AVANÇADA
      this.pesquisarEstado(this.termoUF);
      this.queries['ente_federado'] = this.termoSimples;

      this.queries['estadual'] = this.filtrarEstados ? 'true' : '';
      this.queries['municipal'] = this.filtrarMunicipios ? 'true' : '';
    }

    const PUBLICADOS_NO_DOU = '6'
    this.queries['situacao_adesao'] = PUBLICADOS_NO_DOU
    this.queries['orgao_gestor_dados_bancarios'] = this.filtrarOrgaoGestorDadosBancarios ? 'true' : '';
    this.queries['fundo_cultura_dados_bancarios'] = this.filtrarFundoCulturaDadosBancarios ? 'true' : '';

    this.params = new HttpParams({ fromObject: this.queries });
  }

  getDataMin() {
    if (this.data_min != "") {
      var dd = this.data_min.substr(0,2);
      var mm = this.data_min.substr(2,2);
      var yy = this.data_min.substr(4,4);

      var dateToCheckMin =  null;
      dateToCheckMin = new Date(mm + '/' + dd + '/' + yy); 
      if (Object.prototype.toString.call(dateToCheckMin) === "[object Date]") { 
        if (isNaN(dateToCheckMin.getTime())) {  
          this.data_min = '';
          alert("Data Mínima Inválida !");
          dateToCheckMin = null;
          return this.data_min;
        } 
        else { 
          return (dd + '/' + mm + '/' + yy);
        } 
      } else {
        this.data_min = '';
        dateToCheckMin = null;
        return this.data_min;
      }  
    } else {
      return '01/01/1900';
    }
  }  
    
  getDataMax() {
    if (this.data_max != "") {
      var dd = this.data_max.substr(0,2);
      var mm = this.data_max.substr(2,2);
      var yy = this.data_max.substr(4,4);
      
      var dateToCheckMax =  null;
      dateToCheckMax = new Date(mm + '/' + dd + '/' + yy); 

      if (Object.prototype.toString.call(dateToCheckMax) === "[object Date]") { 
        if (isNaN(dateToCheckMax.getTime())) {  
          this.data_max = '';
          alert("Data Máxima Inválida !");
          dateToCheckMax = null;
          return this.data_max;
        } 
        else { 
          return (dd + '/' + mm + '/' + yy);
        } 
      } else {
        this.data_max = '';
        dateToCheckMax = null;
        return this.data_max;
      }  
    } else {
      return this.datePipe.transform(new Date(), 'dd/MM/yyyy');;
    }
  }

  filtraComponentes() {
    Object.keys(this.filtro_data).forEach((dataFiltro, index) => {
      var dtMin = this.getDataMin();
      var dtMax = this.getDataMax();
      
      if (this.filtro_data[dataFiltro].filtrar) {
        this.params = this.params.append(
          this.parseDatePropertyName(dataFiltro, 'min'), dtMin.toString() );

        this.params = this.params.append(
          this.parseDatePropertyName(dataFiltro, 'max'), dtMax.toString() );
      }
    });
  }

  parseDatePropertyName(propertyName: string, suffixType: string): string {
    return `data_${propertyName}_${suffixType}`;
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

    this.filtro_data = new FiltroComponentes(
      new Filtro(false),
      new Filtro(false),
      new Filtro(false),
      new Filtro(false),
      new Filtro(false),
      new Filtro(false),
      new Filtro(false),
      new Filtro(false),
      new Filtro(false),
      new Filtro(false));
  }

  pesquisarEstado(nome_uf) { // Recebe um termo relacionado ao estado- Pesquisa na sigla ou nome do estado
    this.queries['estado_sigla'] = nome_uf.length == 2 ? nome_uf.toUpperCase() : '';
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
    if ((this.filtrarEstados == true && this.filtrarMunicipios == true) ||
      (this.filtrarEstados == false && this.filtrarMunicipios == false)) {
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
