import { Component, OnInit } from '@angular/core';
import { Entidade } from '../models/entidade.model';
import { SlcApiService } from '../slc-api.service';
import { SncTableComponent } from '../snc-table/snc-table.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import {Router, ActivatedRoute, Params} from '@angular/router';

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
  private termoSimples: String = '';
  private page: number = 0;
  private data_adesao_min: String = '';
  private data_adesao_max: String = '';
  
  private estadoOuMinicipio: String = '';
  private uf: String = '';
  private inicioAdesao: Date = new Date();
  private fimAdesao: Date = new Date();


  constructor(private slcApiService: SlcApiService, public activatedRoute: ActivatedRoute) {
  }

  queries: { [query: string]: String }
    = {
      'limit': '', 'offset': '', 'nome_municipio': '', 'estado_sigla': '', 'data_adesao_min': '', 'data_adesao_max': ''
    };


  ngOnInit(): void {
    // this.activatedRoute.queryParams.subscribe((params: Params) => {
    //   this.estadoOuMinicipio = params['estadoOuMinicipio'];
    //   this.uf = params['uf'];
    //   this.inicioAdesao = params['inicioAdesao'];
    //   this.fimAdesao = params['fimAdesao'];
    //   // http://localhost:4200/?estadoOuMinicipio=Distrito&uf=DF&inicioAdesao=18,03,1995&fimAdesao=18,03,2010
    //   // console.log('MOSTRANDO OS LOGS');
    //   // console.log(this.estadoOuMinicipio);
    //   // console.log(this.uf);
    //   // console.log(this.inicioAdesao);
    //   // console.log(this.fimAdesao);
    // });
    this.slcApiService.buscaAtual.subscribe(listaRetorno => this.listaRetorno = listaRetorno);
  }


  /* AQUI COMEÇA O TESTE DE REFATORAÇÃO DA BUSCA */

  onRealizarBuscaComEnter(event) {
    if (event.keyCode === 13) {
      if (!this.seletorTipoBusca) { // BUSCA SIMPLES
        if (this.termoSimples.length < 3) {
          this.queries['nome_municipio'] = '';
          this.queries['offset'] = '';
          this.queries['estado_sigla'] = this.termoSimples.toUpperCase();
        } else if (this.termoSimples === '' || this.termoSimples.length > 2) {
          this.queries['estado_sigla'] = '';
          this.queries['offset'] = '';
          this.queries['nome_municipio'] = this.termoSimples;
        }

        this.onRealizarBusca();
      } else { // BUSCA AVANÇADA
        this.queries['estado_sigla'] = this.queries['estado_sigla'].toUpperCase()
        this.queries['data_adesao_min'] = this.getDatePicker(this.data_adesao_min);
        this.queries['data_adesao_max']=this.getDatePicker(this.data_adesao_max);
        console.info(this.queries);

        this.onRealizarBusca();
      }
    }
  }

  onRealizarBusca() {
    this.listaEntidades = undefined;
    this.slcApiService['paginaAtual'] = 0; // Garante que a busca sempre seja vista inicialmente na primeira página
    this.slcApiService.carregarPagina(this.page, this.queries);
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

}
