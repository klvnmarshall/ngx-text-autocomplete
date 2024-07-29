import * as i0 from '@angular/core';
import { Component, ViewChild, HostListener, EventEmitter, Directive, Input, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import toPX from 'to-px';
import getCaretCoordinates from 'textarea-caret';

class NgxTextAutocompleteMenuComponent {
    dropdownMenuElement;
    position;
    selectChoice = new Subject();
    activeChoice = '';
    searchText = '';
    choiceLoadError;
    choiceLoading = false;
    _choices = [];
    set choices(choices) {
        this._choices = choices;
    }
    get choices() {
        return this._choices;
    }
    trackById = (index, choice) => choice.id !== undefined ? choice.id : choice;
    onArrowDown(event) {
        event.preventDefault();
        const index = this.choices.indexOf(this.activeChoice);
        if (this.choices[index + 1]) {
            this.scrollToChoice(index + 1);
        }
    }
    onArrowUp(event) {
        event.preventDefault();
        const index = this.choices.indexOf(this.activeChoice);
        if (this.choices[index - 1]) {
            this.scrollToChoice(index - 1);
        }
    }
    onEnter(event) {
        if (this.choices.indexOf(this.activeChoice) > -1) {
            event.preventDefault();
            this.selectChoice.next(this.activeChoice);
        }
    }
    scrollToChoice(index) {
        this.activeChoice = this._choices[index];
        if (this.dropdownMenuElement) {
            const ulPosition = this.dropdownMenuElement.nativeElement.getBoundingClientRect();
            const li = this.dropdownMenuElement.nativeElement.children[index];
            const liPosition = li.getBoundingClientRect();
            if (liPosition.top < ulPosition.top ||
                liPosition.bottom > ulPosition.bottom) {
                li.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: NgxTextAutocompleteMenuComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.1.2", type: NgxTextAutocompleteMenuComponent, isStandalone: true, selector: "ngx-text-autocomplete-menu", host: { listeners: { "document:keydown.ArrowDown": "onArrowDown($event)", "document:keydown.ArrowUp": "onArrowUp($event)", "document:keydown.Enter": "onEnter($event)" } }, viewQueries: [{ propertyName: "dropdownMenuElement", first: true, predicate: ["dropdownMenu"], descendants: true }], ngImport: i0, template: `

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

  `, isInline: true, styles: [".dropdown-menu{display:block;max-height:400px;overflow-y:auto}.dropdown-item:hover{cursor:pointer}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: NgxTextAutocompleteMenuComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-text-autocomplete-menu', standalone: true, imports: [], template: `

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

  `, styles: [".dropdown-menu{display:block;max-height:400px;overflow-y:auto}.dropdown-item:hover{cursor:pointer}\n"] }]
        }], propDecorators: { dropdownMenuElement: [{
                type: ViewChild,
                args: ['dropdownMenu']
            }], onArrowDown: [{
                type: HostListener,
                args: ['document:keydown.ArrowDown', ['$event']]
            }], onArrowUp: [{
                type: HostListener,
                args: ['document:keydown.ArrowUp', ['$event']]
            }], onEnter: [{
                type: HostListener,
                args: ['document:keydown.Enter', ['$event']]
            }] } });

class NgxTextAutocompleteDirective {
    viewContainerRef;
    elm;
    /**
     * The character that will trigger the menu to appear
     */
    triggerCharacter = '@';
    /**
     * An optional keyboard shortcut that will trigger the menu to appear
     */
    keyboardShortcut;
    /**
     * The regular expression that will match the search text after the trigger character
     */
    searchRegexp = /^\w*$/;
    /**
     * Whether to close the menu when the host textarea loses focus
     */
    closeMenuOnBlur = false;
    /**
     * The menu component to show with available options.
     * You can extend the built in `TextInputAutocompleteMenuComponent` component to use a custom template
     */
    menuComponent = NgxTextAutocompleteMenuComponent;
    /**
     * Called when the options menu is shown
     */
    menuShown = new EventEmitter();
    /**
     * Called when the options menu is hidden
     */
    menuHidden = new EventEmitter();
    /**
     * Called when a choice is selected
     */
    choiceSelected = new EventEmitter();
    /**
     * A function that accepts a search string and returns an array of choices. Can also return a promise.
     */
    findChoices = () => [];
    /**
     * A function that formats the selected choice once selected.
     */
    getChoiceLabel = choice => choice;
    menu;
    menuHidden$ = new Subject();
    usingShortcut = false;
    constructor(viewContainerRef, elm) {
        this.viewContainerRef = viewContainerRef;
        this.elm = elm;
    }
    onKeypress(key) {
        if (key === this.triggerCharacter) {
            this.usingShortcut = false;
            this.showMenu();
        }
    }
    onKeyDown(event) {
        if (this.keyboardShortcut && this.keyboardShortcut(event)) {
            this.usingShortcut = true;
            this.showMenu();
            this.onChange('');
        }
    }
    onChange(value) {
        if (!this.menu) {
            return;
        }
        if (value[this.menu.triggerCharacterPosition] !== this.triggerCharacter &&
            !this.usingShortcut) {
            this.hideMenu();
        }
        else {
            const cursor = this.elm.nativeElement.selectionStart;
            if (cursor < this.menu.triggerCharacterPosition) {
                this.hideMenu();
            }
            else {
                if (this.usingShortcut && !this.menu) {
                    value = this.triggerCharacter;
                }
                const offset = this.usingShortcut ? 0 : 1;
                const searchText = value.slice(this.menu.triggerCharacterPosition + offset, cursor);
                if (!searchText.match(this.searchRegexp)) {
                    this.hideMenu();
                }
                else {
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
    onBlur() {
        if (this.menu) {
            this.menu.lastCaretPosition = this.elm.nativeElement.selectionStart;
            if (this.closeMenuOnBlur) {
                this.hideMenu();
            }
        }
    }
    showMenu() {
        if (!this.menu) {
            this.menu = {
                component: this.viewContainerRef.createComponent(this.menuComponent),
                triggerCharacterPosition: this.elm.nativeElement.selectionStart
            };
            const lineHeight = this.getLineHeight(this.elm.nativeElement);
            const { top, left } = getCaretCoordinates(this.elm.nativeElement, this.elm.nativeElement.selectionStart);
            this.menu.component.instance.position = {
                top: top + lineHeight,
                left
            };
            this.menu.component.changeDetectorRef.detectChanges();
            this.menu.component.instance.selectChoice
                .pipe(takeUntil(this.menuHidden$))
                .subscribe(choice => {
                const label = this.getChoiceLabel(choice);
                const textarea = this.elm.nativeElement;
                const value = textarea.value;
                const startIndex = this.menu.triggerCharacterPosition;
                const start = value.slice(0, startIndex);
                const caretPosition = this.menu.lastCaretPosition || textarea.selectionStart;
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
    getLineHeight(elm) {
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
    hideMenu() {
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: NgxTextAutocompleteDirective, deps: [{ token: i0.ViewContainerRef }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.1.2", type: NgxTextAutocompleteDirective, isStandalone: true, selector: "textarea[NgxTextAutocomplete], input[type=\"text\"][NgxTextAutocomplete]", inputs: { triggerCharacter: "triggerCharacter", keyboardShortcut: "keyboardShortcut", searchRegexp: "searchRegexp", closeMenuOnBlur: "closeMenuOnBlur", menuComponent: "menuComponent", findChoices: "findChoices", getChoiceLabel: "getChoiceLabel" }, outputs: { menuShown: "menuShown", menuHidden: "menuHidden", choiceSelected: "choiceSelected" }, host: { listeners: { "keypress": "onKeypress($event.key)", "keydown": "onKeyDown($event)", "input": "onChange($event.target.value)", "blur": "onBlur()" } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: NgxTextAutocompleteDirective, decorators: [{
            type: Directive,
            args: [{
                    // eslint-disable-next-line @angular-eslint/directive-selector
                    selector: 'textarea[NgxTextAutocomplete], input[type="text"][NgxTextAutocomplete]',
                    standalone: true
                }]
        }], ctorParameters: () => [{ type: i0.ViewContainerRef }, { type: i0.ElementRef }], propDecorators: { triggerCharacter: [{
                type: Input
            }], keyboardShortcut: [{
                type: Input
            }], searchRegexp: [{
                type: Input
            }], closeMenuOnBlur: [{
                type: Input
            }], menuComponent: [{
                type: Input
            }], menuShown: [{
                type: Output
            }], menuHidden: [{
                type: Output
            }], choiceSelected: [{
                type: Output
            }], findChoices: [{
                type: Input
            }], getChoiceLabel: [{
                type: Input
            }], onKeypress: [{
                type: HostListener,
                args: ['keypress', ['$event.key']]
            }], onKeyDown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }], onChange: [{
                type: HostListener,
                args: ['input', ['$event.target.value']]
            }], onBlur: [{
                type: HostListener,
                args: ['blur']
            }] } });

class NgxTextAutocompleteComponent {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: NgxTextAutocompleteComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.1.2", type: NgxTextAutocompleteComponent, isStandalone: true, selector: "ngx-text-autocomplete", ngImport: i0, template: '<ng-content></ng-content>', isInline: true, styles: [":host{position:relative;display:block}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: NgxTextAutocompleteComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-text-autocomplete', standalone: true, imports: [], template: '<ng-content></ng-content>', styles: [":host{position:relative;display:block}\n"] }]
        }] });

/*
 * Public API Surface of ngx-text-autocomplete
 */

/**
 * Generated bundle index. Do not edit.
 */

export { NgxTextAutocompleteComponent, NgxTextAutocompleteDirective, NgxTextAutocompleteMenuComponent };
//# sourceMappingURL=ngx-text-autocomplete.mjs.map
