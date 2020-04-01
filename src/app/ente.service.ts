import {Component, Injectable, } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {tap} from "rxjs/operators";

@Injectable()
 export class EnteService {
  // private idSource = new BehaviorSubject<number>(0);
  // id = this.idSource.asObservable();
  private entidade = {};

  constructor() { }

  changeEnte(ente) {
    // this.idSource.next(id);
    this.entidade = ente;
  }

  public getEnte() :{}{
    return this.entidade;
  }

}
