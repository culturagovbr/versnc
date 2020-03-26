import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {SncTableComponent} from './snc-table/snc-table.component';
import {DetalheComponent} from "./detalhe/detalhe.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tabela-uf-municipio', component: SncTableComponent },
  { path: 'detalhe', component: DetalheComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
