import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { BuscaComponent } from '../busca/busca.component';
import { MaterialModule } from '../material/material.module';
import { SlcApiService } from '../slc-api.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MessageService } from '../message.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, NoopAnimationsModule],
      declarations: [HomeComponent, BuscaComponent],
      providers:[SlcApiService, HttpClient, HttpHandler, MessageService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
