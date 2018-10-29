import { async, ComponentFixture, TestBed, inject} from '@angular/core/testing';

import { MessageComponent } from './message.component';
import { MessageService } from '../message.service';

describe('MessageComponent', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageComponent ],
      providers: [MessageService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', inject([MessageService], (service: MessageService) => {
    expect(component).toBeTruthy();
  }));
});
