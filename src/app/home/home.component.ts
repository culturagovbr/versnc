import { Component, OnInit } from '@angular/core';
import { SlcApiService } from '../slc-api.service';
import { AlertService } from '../_services/index';

@Component({
  selector: 'snc-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private municipios_aderidos: Number;
  private estados_aderidos: Number;
  private querie_municipios = {'estadual' : 'false'};
  private querie_estados = {'municipal' : 'false'};

  constructor(private slcApiService: SlcApiService, private alertService: AlertService) { }

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

  ngOnInit() {	
  	this.slcApiService.searchFilter(this.querie_municipios).subscribe(listaRetorno => {
      this.municipios_aderidos = listaRetorno['municipios_aderidos'];
      this.estados_aderidos = listaRetorno['estados_aderidos'];
      return this
    });
  }

}