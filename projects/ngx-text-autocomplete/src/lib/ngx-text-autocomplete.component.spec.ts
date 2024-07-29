import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxInputAutocompleteComponent } from './ngx-text-autocomplete.component';

describe('NgxInputAutocompleteComponent', () => {
  let component: NgxInputAutocompleteComponent;
  let fixture: ComponentFixture<NgxInputAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxInputAutocompleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxInputAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
