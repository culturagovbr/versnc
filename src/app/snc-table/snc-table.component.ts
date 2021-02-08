import { DatePipe, NgIf} from '@angular/common';
import {Component, OnInit, ViewChild, AfterViewInit, OnDestroy} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatPaginator, MatTableDataSource, MatSort, MatSelectModule, MatChipsModule, PageEvent } from '@angular/material';

import { SlcApiService } from '../slc-api.service';
import { CdkDetailRowDirective } from './cdk-detail-row.directive';
import { Entidade } from '../models/entidade.model';
import { HttpParams } from '@angular/common/http';
import {NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import { MatTooltipModule } from '@angular/material/tooltip';
import {BuscaComponent} from '../busca/busca.component';
import {noUndefined} from '@angular/compiler/src/util';

import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { animate, state, style, transition, trigger } from '@angular/animations';
import 'rxjs/add/observable/of';
import { forEach } from '@angular/router/src/utils/collection';
import {EnteService} from '../ente.service';

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

  private count: Number = 0;
  private count_estados: Number = 0;
  private estados_aderidos: Number = 0;
  private municipios_aderidos: Number = 0;
  private listaRetorno = {};
  private sncDataSource: any;
  private mySubscription: Subscription;
  private pages: Number = 0;
  private isExpansionDetailRow = (i: Number, row: Object) => row.hasOwnProperty('detailRow');
  displayedColumns = ['nome', 'data_adesao', 'plano_trabalho'];
  private isDisabled = false;
  private tituloEnteFederado: 'ENTE FEDERADO';
  private listaComponentes = ['Sistema de Cultura','Órgão Gestor','Conselho de Política Cultural', 'Fundo de Cultura','Plano de Cultura'];

  constructor(private slcApiService: SlcApiService, private router: Router, private state: EnteService) {

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

  updateEnte(ente) {
    this.state.changeEnte(ente);
    this.router.navigate(['/detalhe']);
  }

  public getEntesFederados(): void {
    this.slcApiService.buscaAtual.subscribe(listaRetorno => this.listaRetorno = listaRetorno);
    const entidades = this.listaRetorno[1] as Entidade[];
    this.sncDataSource = new MatTableDataSource(entidades);
    this.sncDataSource.sort = this.sort;
    this.pages = this.listaRetorno[3];
    this.count = this.listaRetorno[0];
    this.count_estados = this.listaRetorno[4];
    this.estados_aderidos = this.listaRetorno[5];
    this.municipios_aderidos = this.listaRetorno[6];
  }


  public ptRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) { return `0 de ${length}`; }

    length = Math.max(length, 0);

    const startIndex = page * pageSize;
    const endIndex = startIndex < length ?
        Math.min(startIndex + pageSize, length) :
        startIndex + pageSize;

    return `${startIndex + 1} - ${endIndex} de ${length}`;
  }


  ngOnDestroy() {
    if (this.mySubscription){
      this.mySubscription.unsubscribe();
    }
  }

  onTrocaPagina(event?: PageEvent){
    this.slcApiService['paginaAtual'] = this.paginator['_pageIndex']; // Página atual é armazenada na service
    let index = this.slcApiService['paginaAtual'];

    this.pages = index * 10; // Number offset que vai para a chamada da API
    this.listaRetorno[3] = this.pages;
    this.listaRetorno[2] = this.listaRetorno[2].set('offset', this.pages.toString());
    this.slcApiService.carregarPagina(index, this.listaRetorno[2]);
  }

  ngAfterViewInit() {
    this.paginator['_pageIndex'] = this.slcApiService['paginaAtual']; // Atualiza o valor da página atual corretamente
    this.tituloEnteFederado = this.slcApiService['tituloEnteFederado'];
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = "Itens por página:"
    this.paginator._intl.getRangeLabel = this.ptRangeLabel;
    this.tituloEnteFederado = this.slcApiService['tituloEnteFederado'];
    this.getEntesFederados();
  }

  setAnimationAsDisabled(status: boolean) {
    this.isDisabled = status;
  }

}
