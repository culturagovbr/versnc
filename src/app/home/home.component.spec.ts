import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { BuscaComponent } from '../busca/busca.component';
import { MaterialModule } from '../material/material.module';
import { SlcApiService } from '../slc-api.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MessageService } from '../message.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, MaterialModule, NoopAnimationsModule, RouterTestingModule],
      declarations: [HomeComponent, BuscaComponent],
      providers:[SlcApiService, HttpClient, MessageService]
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
