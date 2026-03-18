import { Component } from '@angular/core';

@Component({
    selector: 'ngx-text-autocomplete',
    imports: [],
    template: '<ng-content></ng-content>',
    styles: `
    :host {
      position: relative;
      display: block;
    }
  `
})
export class NgxTextAutocompleteComponent {

}
