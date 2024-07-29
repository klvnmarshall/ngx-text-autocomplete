import {Component} from '@angular/core';
import {NgxInputAutocompleteComponent} from "../../../ngx-input-autocomplete/src/public-api";
import {FormsModule} from "@angular/forms";
import {NgxInputAutocompleteDirective} from "../../../ngx-input-autocomplete/src/lib/ngx-input-autocomplete.directive";


const languages = [
  "Python", "JavaScript", "Java", "C++", "Ruby",
  "Go", "Rust", "Swift", "Kotlin", "TypeScript"
]

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
