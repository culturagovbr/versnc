import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from "@angular/router";
import {EnteService}from '../ente.service';
import {Observable} from "rxjs";
import {filter, map} from "rxjs/operators";
import { MatIconModule, MatIconRegistry } from '@angular/material';


@Component({
  selector: 'snc-detalhe',
  templateUrl: './detalhe.component.html',
  styleUrls: ['./detalhe.component.css'],
})
export class DetalheComponent implements OnInit {
  private teste = "oi";
  private id = 0;
  private entidade = {};
  private adesaoStatus = false;
  private institucionalizacaoStatus = false;
  private implementacaoStatus = false;
  private listLeis = ['criacao_lei_sistema', 'criacao_orgao_gestor','criacao_orgao_gestor_cnpj','criacao_fundo_cultura',  'criacao_fundo_cultura_cnpj','criacao_conselho_cultural_lei','criacao_conselho_cultural_ata','criacao_plano_cultura',
  'criacao_plano_metas'];

  constructor(private ente: EnteService, private router: Router) { }

  ngOnInit() {

    this.entidade = this.ente.getEnte();
    let ente = this.entidade;

    if(ente != undefined && ente != null && ente != {}){

      if(ente.cod_situacao_adesao == '6'){
        this.adesaoStatus = true; 
      } else {
        this.adesaoStatus = false;
      }

      for (let comp in ente.acoes_plano_trabalho) {
        let compKey = ente.acoes_plano_trabalho[comp].key;
        let compValue = ente.acoes_plano_trabalho[comp].value;
          if(this.listLeis.indexOf(compKey) && compValue) {
            if('criacao_lei_sistema, criacao_orgao_gestor, criacao_fundo_cultura, criacao_plano_cultura , criacao_conselho_cultural_lei'.indexOf(compKey) > -1){
              if(Object.values(compValue)[0] == 2){
                this.institucionalizacaoStatus = true;
              } else {
                this.institucionalizacaoStatus = false;
                break;
              }
          } 
      } 

      for (let comp in ente.acoes_plano_trabalho) {
        let compKey = ente.acoes_plano_trabalho[comp].key;
        let compValue = ente.acoes_plano_trabalho[comp].value;
          if(this.listLeis.indexOf(compKey) && compValue) {
            // Criação Orgao Gestor e Criação Fundo Cultura possuem as infromações de CNPJ e Dados Bancário por isso precisam ser testadas de novo
            if('criacao_orgao_gestor, criacao_fundo_cultura'.indexOf(compKey) > -1){
              if(Object.values(compValue)[4].length > 10 && Object.values(compValue)[5] == 1){
                this.implementacaoStatus = true;
              } else {
                this.implementacaoStatus = false;
                break;
              }
            } else {
              if('criacao_lei_sistema, criacao_orgao_gestor, criacao_fundo_cultura, criacao_plano_cultura , criacao_conselho_cultural_lei'.indexOf(compKey) == -1){
                if(Object.values(compValue)[0] == 2){
                  this.implementacaoStatus = true;
                } else {
                  this.implementacaoStatus = false;
                }
              }
            }
            
          } 
      }

    } else {
      this.adesaoStatus = false;
    }
    
    if( Object.keys(this.entidade).length === 0){
      this.router.navigate(['/']);
    }
  }

}
