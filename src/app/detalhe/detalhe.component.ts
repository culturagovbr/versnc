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
  constructor(private ente: EnteService, private router: Router) { }

  ngOnInit() {

    this.entidade = this.ente.getEnte();
    if( Object.keys(this.entidade).length ===0){
      this.router.navigate(['/']);
    }


  }

}
