import { Component, OnInit } from '@angular/core';
import { SlcApiService } from '../slc-api.service';

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

  constructor(private slcApiService: SlcApiService) { }

  ngOnInit() {	
  	this.slcApiService.searchFilter(this.querie_municipios).subscribe(listaRetorno => {
      this.municipios_aderidos = listaRetorno['municipios_aderidos'];
      this.estados_aderidos = listaRetorno['estados_aderidos'];
      return this
    });
  }

}