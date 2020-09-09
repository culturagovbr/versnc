import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material/material.module';

import { SlcApiService } from './slc-api.service';
import { EnteService } from './ente.service';

import { AppComponent } from './app.component';
import { SncTableComponent } from './snc-table/snc-table.component';
import { CdkDetailRowDirective } from './snc-table/cdk-detail-row.directive';
import { HomeComponent } from './home/home.component';
import { BuscaComponent } from './busca/busca.component';
import { MenuComponent } from './menu/menu.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MessageComponent } from './message/message.component';
import { MessageService } from './message.service';
import { FormsModule } from '@angular/forms';
import { DetalheComponent } from './detalhe/detalhe.component';

// import alert service and component
import { AlertComponent } from './_directives/index';
import { AlertService } from './_services/index';

import {NgxMaskModule, IConfig} from 'ngx-mask-2'

export const options: Partial<IConfig>  = null;

@NgModule({
  declarations: [
    AppComponent,
    BuscaComponent,
    CdkDetailRowDirective,
    HomeComponent,
    MenuComponent,
    MessageComponent,
    SncTableComponent,
    DetalheComponent,
    AlertComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    MaterialModule,
    NgxMaskModule.forRoot(options),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [SlcApiService, EnteService, MessageService, SncTableComponent, AlertService],
  bootstrap: [AppComponent]
})
export class AppModule { }
