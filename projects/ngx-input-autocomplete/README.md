# NgxInputAutocomplete

A angular directive for adding autocomplete functionality to text input elements using trigger characters inspired by [angular-text-input-autocomplete](https://github.com/mattlewis92/angular-text-input-autocomplete)

## Installation

Install through npm:
```
npm install ngx-input-autocomplete
```

Then include it in your component for standalone
```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgxInputAutocompleteComponent,
    NgxInputAutocompleteDirective,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
}
```

or in your module

```typescript
import {NgModule} from '@angular/core';
import {Component} from '@angular/core';
import {NgxInputAutocompleteComponent, NgxInputAutocompleteDirective} from "ngx-input-autocomplete";

@NgModule({
  imports: [ 
    NgxInputAutocompleteComponent,
    NgxInputAutocompleteDirective
  ]
})
export class MyModule {
  
}
```

Complete usage sample for standalone
```typescript
import {FormsModule} from "@angular/forms";
import {NgxInputAutocompleteComponent, NgxInputAutocompleteDirective} from "ngx-input-autocomplete";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgxInputAutocompleteComponent,
    NgxInputAutocompleteDirective,
    FormsModule
  ],
  template: `
  <ngx-input-autocomplete>
      <textarea NgxInputAutocomplete
                placeholder="Type {{triggerCharacter}} to search..."
                class="form-control"
                rows="5"
                [triggerCharacter]="triggerCharacter"
                [(ngModel)]="formControlValue"
                [keyboardShortcut]="shortcut"
                [findChoices]="findChoices"
                [getChoiceLabel]="getChoiceLabel">
      </textarea>
  </ngx-input-autocomplete>
  `,
})
export class AppComponent {

  formControlValue = '';
  triggerCharacter = '@'



  findChoices(searchText: string) {
    return ['Java', 'Go', 'Javascript']
      .filter(item => item.toLowerCase().includes(searchText.toLowerCase()))
  }

  getChoiceLabel(choice: string) {
    return `${this.triggerCharacter}${choice} `;
  }

  shortcut(event: KeyboardEvent): boolean {
    return (event.code === '32') && event.ctrlKey;
  }

}
```

## Development

### Prepare your environment

- Install [Node.js](http://nodejs.org/) and NPM
- Install local dev dependencies: `npm install` while current directory is this repo




## Code scaffolding

Run `ng generate component component-name --project ngx-input-autocomplete` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project ngx-input-autocomplete`.
> Note: Don't forget to add `--project ngx-input-autocomplete` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build ngx-input-autocomplete` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build ngx-input-autocomplete`, go to the dist folder `cd dist/ngx-input-autocomplete` and run `npm publish`.

## Running unit tests

Run `ng test ngx-input-autocomplete` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


## License

MIT
