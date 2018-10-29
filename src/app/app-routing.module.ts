import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {SncTableComponent} from './snc-table/snc-table.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tabela-uf-municipio', component: SncTableComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
