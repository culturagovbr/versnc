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

  ngOnInit() {
    // fluxograma
    // Se Tem parâmetro na rota?
    //   pega os parâmetros e chama a requisição
    // caso não, pega os parâmetros pesquisados e coloca na rota
    this.getEntesFederados();

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      console.log('carregou?');
      console.log(this.listaRetorno);

      // if (this.listaRetorno.length !== 0) {
      if (Object.keys(params).length > 0) {  
        let url = '?';

        for (const param in params) {
          url = url.concat(param + '=' + params[param]);
          url = url.concat('&');
        }
        
        url = url.slice(0, -1);
        
        window.history.pushState(null, null, url);
      }
      
      // this.estadoOuMinicipio = params['estadoOuMinicipio'];
      // this.uf = params['uf'];
      // this.inicioAdesao = params['inicioAdesao'];
      // this.fimAdesao = params['fimAdesao'];
      // http://localhost:4200/?estadoOuMinicipio=Distrito&uf=DF&inicioAdesao=18,03,1995&fimAdesao=18,03,2010
      // console.log('MOSTRANDO OS LOGS');
      // console.log(this.estadoOuMinicipio);
      // console.log(this.uf);
      // console.log(this.inicioAdesao);
      // console.log(this.fimAdesao);
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
