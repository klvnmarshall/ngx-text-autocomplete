import {
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Injector,
  Input,
  OnDestroy,
  Output,
  ViewContainerRef
} from '@angular/core';
import {NgxTextAutocompleteMenuComponent} from "./ngx-text-autocomplete-menu.component";
import {Subject, takeUntil} from "rxjs";
import toPX from 'to-px';
import getCaretCoordinates from 'textarea-caret';

export interface ChoiceSelectedEvent {
  choice: string;
  insertedAt: {
    start: number;
    end: number;
  };
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'textarea[NgxTextAutocomplete], input[type="text"][NgxTextAutocomplete]',
  standalone: true
})
export class NgxTextAutocompleteDirective implements OnDestroy {

  /**
   * The character that will trigger the menu to appear
   */
  @Input() triggerCharacter = '@';

  /**
   * An optional keyboard shortcut that will trigger the menu to appear
   */
  @Input() keyboardShortcut?: (event: KeyboardEvent) => boolean;

  /**
   * The regular expression that will match the search text after the trigger character
   */
  @Input() searchRegexp = /^\w*$/;

  /**
   * Whether to close the menu when the host textarea loses focus
   */
  @Input() closeMenuOnBlur = false;

  /**
   * The menu component to show with available options.
   * You can extend the built in `TextInputAutocompleteMenuComponent` component to use a custom template
   */
  @Input() menuComponent = NgxTextAutocompleteMenuComponent;

  /**
   * Called when the options menu is shown
   */
  @Output() menuShown = new EventEmitter();

  /**
   * Called when the options menu is hidden
   */
  @Output() menuHidden = new EventEmitter();

  /**
   * Called when a choice is selected
   */
  @Output() choiceSelected = new EventEmitter<ChoiceSelectedEvent>();

  /**
   * A function that accepts a search string and returns an array of choices. Can also return a promise.
   */
  @Input() findChoices: (searchText: string) => string[] | Promise<string[]> = () => [];

  /**
   * A function that formats the selected choice once selected.
   */
  @Input() getChoiceLabel: (choice: string) => string = choice => choice;

  private menu:
    | {
    component: ComponentRef<NgxTextAutocompleteMenuComponent>;
    triggerCharacterPosition: number;
    lastCaretPosition?: number;
  }
    | undefined;

  private menuHidden$ = new Subject();

  private usingShortcut = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private elm: ElementRef
  ) {
  }

  @HostListener('keypress', ['$event.key'])
  onKeypress(key: string) {
    if (key === this.triggerCharacter) {
      this.usingShortcut = false;
      this.showMenu();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.keyboardShortcut && this.keyboardShortcut(event)) {
      this.usingShortcut = true;
      this.showMenu();
      this.onChange('');
    }
  }

  @HostListener('input', ['$event.target.value'])
  onChange(value: string) {
    if (!this.menu) {
      return
    }

    if (
      value[this.menu.triggerCharacterPosition] !== this.triggerCharacter &&
      !this.usingShortcut
    ) {
      this.hideMenu();
    } else {
      const cursor = this.elm.nativeElement.selectionStart;
      if (cursor < this.menu.triggerCharacterPosition) {
        this.hideMenu();
      } else {
        if (this.usingShortcut && !this.menu) {
          value = this.triggerCharacter;
        }
        const offset = this.usingShortcut ? 0 : 1;
        const searchText = value.slice(
          this.menu.triggerCharacterPosition + offset,
          cursor
        );

        if (!searchText.match(this.searchRegexp)) {
          this.hideMenu();
        } else {
          this.menu.component.instance.searchText = searchText;
          this.menu.component.instance.choices = [];
          this.menu.component.instance.choiceLoadError = undefined;
          this.menu.component.instance.choiceLoading = true;
          this.menu.component.changeDetectorRef.detectChanges();
          Promise.resolve(this.findChoices(searchText))
            .then(choices => {
              if (this.menu) {
                this.menu.component.instance.choices = choices;
                this.menu.component.instance.choiceLoading = false;
                this.menu.component.changeDetectorRef.detectChanges();
              }
            })
            .catch(err => {
              if (this.menu) {
                this.menu.component.instance.choiceLoading = false;
                this.menu.component.instance.choiceLoadError = err;
                this.menu.component.changeDetectorRef.detectChanges();
              }
            });
        }
      }
    }
  }

  @HostListener('blur')
  onBlur() {
    if (this.menu) {
      this.menu.lastCaretPosition = this.elm.nativeElement.selectionStart;

      if (this.closeMenuOnBlur) {
        this.hideMenu();
      }
    }
  }

  private showMenu() {
    if (!this.menu) {
      this.menu = {
        component: this.viewContainerRef.createComponent(this.menuComponent),
        triggerCharacterPosition: this.elm.nativeElement.selectionStart
      };

      const lineHeight = this.getLineHeight(this.elm.nativeElement);
      const {top, left} = getCaretCoordinates(
        this.elm.nativeElement,
        this.elm.nativeElement.selectionStart
      );
      this.menu.component.instance.position = {
        top: top + lineHeight,
        left
      };
      this.menu.component.changeDetectorRef.detectChanges();
      this.menu.component.instance.selectChoice
        .pipe(takeUntil(this.menuHidden$))
        .subscribe(choice => {
          const label = this.getChoiceLabel(choice);
          const textarea: HTMLTextAreaElement = this.elm.nativeElement;
          const value: string = textarea.value;
          const startIndex = this.menu!.triggerCharacterPosition;
          const start = value.slice(0, startIndex);
          const caretPosition =
            this.menu!.lastCaretPosition || textarea.selectionStart;
          const end = value.slice(caretPosition);
          textarea.value = start + label + end;
          // force ng model / form control to update
          textarea.dispatchEvent(new Event('input'));
          this.hideMenu();
          const setCursorAt = (start + label).length;
          textarea.setSelectionRange(setCursorAt, setCursorAt);
          textarea.focus();
          this.choiceSelected.emit({
            choice,
            insertedAt: {
              start: startIndex,
              end: startIndex + label.length
            }
          });
        });
      this.menuShown.emit();
    }
  }

  getLineHeight(elm: HTMLElement): number {
    const lineHeightStr = getComputedStyle(elm).lineHeight;
    const fontSizeStr = getComputedStyle(elm).fontSize;
    const fontSize = toPX(fontSizeStr) ?? 16;
    const normal = 1.2;
    const lineHeightNum = parseFloat(lineHeightStr);

    if (lineHeightStr === lineHeightNum + '') {
      return fontSize * lineHeightNum;
    }

    if (lineHeightStr.toLowerCase() === 'normal') {
      return fontSize * normal;
    }

    return toPX(lineHeightStr) ?? 16;
  }

  private hideMenu() {
    if (this.menu) {
      this.menu.component.destroy();
      this.menuHidden$.next(null);
      this.menuHidden.emit();
      this.menu = undefined;
    }
  }

  ngOnDestroy() {
    this.hideMenu();
  }

}
