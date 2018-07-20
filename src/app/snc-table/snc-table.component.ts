import { DatePipe } from '@angular/common';
import {Component, OnInit, ViewChild, AfterViewInit, OnDestroy} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatPaginator, MatTableDataSource, MatSort, MatSelectModule, MatChipsModule, PageEvent } from '@angular/material';
import { SlcApiService } from '../slc-api.service';
import { Entidade } from '../models/entidade.model';
import {NavigationEnd, Router, ActivatedRoute, Params} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import { MatTooltipModule } from '@angular/material/tooltip';
import {BuscaComponent} from '../busca/busca.component';
import {noUndefined} from '@angular/compiler/src/util';

@Component({
  selector: 'snc-table',
  templateUrl: './snc-table.component.html',
  styleUrls: ['./snc-table.component.css']
})

export class SncTableComponent implements OnInit, OnDestroy {

  private count: Number;
  private listaRetorno = [];
  private sncDataSource: any;
  private mySubscription: Subscription;
  private pages: number = 0;

  constructor(private slcApiService: SlcApiService, private router: Router, public activatedRoute: ActivatedRoute) {

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

  queries: { [query: string]: Object } = {
    'data_adesao_max': '',
    'data_adesao_min': '',
    'ente_federado': '',
    'estado_sigla': '',
    'estadual': '',
    'limit': '',
    'municipal': '',
    'nome_municipio': '',
    'nome_uf': '',
    'offset': '',
  };


  ngOnInit() :void{
    this.getEntesFederados();

    this.activatedRoute.queryParams.subscribe((urlQueryParams: Params) => {
      if (Object.keys(urlQueryParams).length > 0) {
        this.callApiWithQueryParams(urlQueryParams);
      } else {
        this.pushQueryParamsOfSeachResult();
      }
    });

  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public getEntesFederados(): void {
    this.slcApiService.buscaAtual.subscribe(listaRetorno => this.listaRetorno = listaRetorno);

    this.sncDataSource = new MatTableDataSource<Entidade>(this.listaRetorno[1] as Entidade[]);
    this.sncDataSource.sort = this.sort;
    this.count = this.listaRetorno[0];
    this.pages = this.listaRetorno[3];
  }

  /**
   * Chama a api passando os query params da URL.
   * @param urlQueryParams  query params presentes na URL ´urlQueryParams´.
   */
  public callApiWithQueryParams(urlQueryParams: Params): void {
    this.queries['data_adesao_max'] = urlQueryParams['data_adesao_max']
    this.queries['data_adesao_min'] = urlQueryParams['data_adesao_min']
    this.queries['ente_federado'] = urlQueryParams['ente_federado']
    this.queries['estado_sigla'] = urlQueryParams['estado_sigla']
    this.queries['estadual'] = urlQueryParams['estadual']
    this.queries['limit'] = urlQueryParams['limit']
    this.queries['municipal'] = urlQueryParams['municipal']
    this.queries['nome_municipio'] = urlQueryParams['nome_municipio']
    this.queries['nome_uf'] = urlQueryParams['nome_uf']
    this.queries['offset'] = urlQueryParams['offset']
    this.slcApiService['paginaAtual'] = urlQueryParams['offset']; // Garante que a busca sempre seja vista inicialmente na primeira página
    this.slcApiService.carregarPagina(0, this.queries);
  }

  /**
   * Coloca na URL como query params os parâmetros usados na pesquisa.
   */
  public pushQueryParamsOfSeachResult(): void {
    let url = window.location.pathname.concat('?');
    const paramsOfSearch = this.listaRetorno[2];

    for (const param in paramsOfSearch) {
      url = url.concat(param + '=' + paramsOfSearch[param]);
      url = url.concat('&');
    }

    url = url.slice(0, -1);

    window.history.pushState(null, null, url);
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
}
