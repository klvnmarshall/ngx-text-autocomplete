import {Component} from '@angular/core';
import {NgxTextAutocompleteComponent} from "../../../ngx-text-autocomplete/src/public-api";
import {FormsModule} from "@angular/forms";
import {NgxTextAutocompleteDirective} from "../../../ngx-text-autocomplete/src/lib/ngx-text-autocomplete.directive";


const languages = [
  "Python", "JavaScript", "Java", "C++", "Ruby",
  "Go", "Rust", "Swift", "Kotlin", "TypeScript"
]

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgxTextAutocompleteComponent,
    NgxTextAutocompleteDirective,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  formControlValue = '';
  triggerCharacter = '@'



  findChoices(searchText: string) {
    return languages
      .filter(item => item.toLowerCase().includes(searchText.toLowerCase()))
  }

  getChoiceLabel(choice: string) {
    return `${this.triggerCharacter}${choice} `;
  }

  shortcut(event: KeyboardEvent): boolean {
    return (event.code === '32') && event.ctrlKey;
  }

}
