import { DatePipe, NgIf } from '@angular/common';
import {Component, OnInit, ViewChild, AfterViewInit, OnDestroy} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatPaginator, MatTableDataSource, MatSort, MatSelectModule, MatChipsModule, PageEvent } from '@angular/material';

import { SlcApiService } from '../slc-api.service';
import { CdkDetailRowDirective } from './cdk-detail-row.directive';
import { Entidade } from '../models/entidade.model';
import {NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import { MatTooltipModule } from '@angular/material/tooltip';
import {BuscaComponent} from '../busca/busca.component';
import {noUndefined} from '@angular/compiler/src/util';

import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { animate, state, style, transition, trigger } from '@angular/animations';
import 'rxjs/add/observable/of';

@Component({
  selector: 'snc-table',
  templateUrl: './snc-table.component.html',
  styleUrls: ['./snc-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class SncTableComponent implements OnInit, OnDestroy {

  private count: Number;
  private listaRetorno = {};
  private sncDataSource: any;
  private mySubscription: Subscription;
  private pages: number = 0;
  private isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  private expandElements = false;
  private displayedColumns = ['nome_municipio', 'data_adesao', 'plano_trabalho'];

  constructor(private slcApiService: SlcApiService, private router: Router) {

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(CdkDetailRowDirective) detailRow: CdkDetailRowDirective;

  public getEntesFederados(): void {
    this.slcApiService.buscaAtual.subscribe(listaRetorno => this.listaRetorno = listaRetorno);

    let entidades = this.listaRetorno[1] as Entidade[];
    this.sncDataSource = new MatTableDataSource(entidades);
    this.sncDataSource.sort = this.sort;
    this.count = this.listaRetorno[0];
    this.pages = this.listaRetorno[3];
  }

  ngOnDestroy() {
    if (this.mySubscription)
      this.mySubscription.unsubscribe();
  }

  onTrocaPagina(event?: PageEvent){
    this.slcApiService['paginaAtual'] = this.paginator['_pageIndex']; // Página atual é armazenada na service
    let index = this.slcApiService['paginaAtual'];

    this.pages = index * 10; // Number offset que vai para a chamada da API
    this.listaRetorno[3] = this.pages; 
    this.listaRetorno[2]['offset'] = this.pages.toString(); // String 'offset' que vai para a chamada da API e realiza a paginação
    
    this.slcApiService.carregarPagina(index, this.listaRetorno[2]);
  }
  
  ngAfterViewInit() {
    this.paginator['_pageIndex'] = this.slcApiService['paginaAtual']; // Atualiza o valor da página atual corretamente    
  }
  
  ngOnInit() {
    this.getEntesFederados();
  }

  getNomeComponente(componente) {
      var nomes = componente.split('_');  

      for (var i=1; i<nomes.length; i++) {
        nomes[i] = nomes[i].charAt(0).toUpperCase() + nomes[i].slice(1);
      }

      return nomes.slice(1).join(' ');
  }

  clearExpandedElements($event) {
    this.expandElements = false;
  }

  a($event) {
    console.log($event);
  }
}