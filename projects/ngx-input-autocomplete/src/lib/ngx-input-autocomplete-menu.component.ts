import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {Subject} from "rxjs";

@Component({
  selector: 'ngx-input-autocomplete-menu',
  standalone: true,
  imports: [],
  template: `

    @if (choices.length) {
      <ul
        #dropdownMenu
        class="dropdown-menu"
        [style.top.px]="position?.top"
        [style.left.px]="position?.left">

        @for (choice of choices; track choice) {
          <li class="dropdown-item"
              [class.active]="activeChoice === choice"
              (click)="selectChoice.next(choice)">
            <a>
              {{ choice }}
            </a>
          </li>
        }
      </ul>
    }

  `,
  styles: `
    .dropdown-menu {
      display: block;
      max-height: 400px;
      overflow-y: auto;
    }

    .dropdown-item:hover {
      cursor: pointer;
    }
  `
})
export class NgxInputAutocompleteMenuComponent {
  @ViewChild('dropdownMenu') dropdownMenuElement?: ElementRef<HTMLUListElement>;
  position: { top: number; left: number } | undefined
  selectChoice = new Subject<string>();
  activeChoice = ''
  searchText = '';
  choiceLoadError?: string
  choiceLoading = false;

  private _choices: string[] = [];
  set choices(choices: string[]) {
    this._choices = choices;
  }

  get choices() {
    return this._choices;
  }

  trackById = (index: number, choice: any) =>
    choice.id !== undefined ? choice.id : choice;

  @HostListener('document:keydown.ArrowDown', ['$event'])
  onArrowDown(event: KeyboardEvent) {
    event.preventDefault();
    const index = this.choices.indexOf(this.activeChoice);
    if (this.choices[index + 1]) {
      this.scrollToChoice(index + 1);
    }
  }

  @HostListener('document:keydown.ArrowUp', ['$event'])
  onArrowUp(event: KeyboardEvent) {
    event.preventDefault();
    const index = this.choices.indexOf(this.activeChoice);
    if (this.choices[index - 1]) {
      this.scrollToChoice(index - 1);
    }
  }

  @HostListener('document:keydown.Enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    if (this.choices.indexOf(this.activeChoice) > -1) {
      event.preventDefault();
      this.selectChoice.next(this.activeChoice);
    }
  }

  private scrollToChoice(index: number) {
    this.activeChoice = this._choices[index];

    if (this.dropdownMenuElement) {
      const ulPosition = this.dropdownMenuElement.nativeElement.getBoundingClientRect();
      const li = this.dropdownMenuElement.nativeElement.children[index];
      const liPosition = li.getBoundingClientRect();

      if (
        liPosition.top < ulPosition.top ||
        liPosition.bottom > ulPosition.bottom
      ) {
        li.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }
}
