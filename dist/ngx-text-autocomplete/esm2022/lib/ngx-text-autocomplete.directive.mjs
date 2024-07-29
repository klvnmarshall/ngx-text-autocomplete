import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { NgxTextAutocompleteMenuComponent } from "./ngx-text-autocomplete-menu.component";
import { Subject, takeUntil } from "rxjs";
import toPX from 'to-px';
import getCaretCoordinates from 'textarea-caret';
import * as i0 from "@angular/core";
export class NgxTextAutocompleteDirective {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXRleHQtYXV0b2NvbXBsZXRlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC10ZXh0LWF1dG9jb21wbGV0ZS9zcmMvbGliL25neC10ZXh0LWF1dG9jb21wbGV0ZS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLFNBQVMsRUFFVCxZQUFZLEVBQ1osWUFBWSxFQUVaLEtBQUssRUFFTCxNQUFNLEVBRVAsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGdDQUFnQyxFQUFDLE1BQU0sd0NBQXdDLENBQUM7QUFDeEYsT0FBTyxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDeEMsT0FBTyxJQUFJLE1BQU0sT0FBTyxDQUFDO0FBQ3pCLE9BQU8sbUJBQW1CLE1BQU0sZ0JBQWdCLENBQUM7O0FBZWpELE1BQU0sT0FBTyw0QkFBNEI7SUFrRTdCO0lBQ0E7SUFqRVY7O09BRUc7SUFDTSxnQkFBZ0IsR0FBRyxHQUFHLENBQUM7SUFFaEM7O09BRUc7SUFDTSxnQkFBZ0IsQ0FBcUM7SUFFOUQ7O09BRUc7SUFDTSxZQUFZLEdBQUcsT0FBTyxDQUFDO0lBRWhDOztPQUVHO0lBQ00sZUFBZSxHQUFHLEtBQUssQ0FBQztJQUVqQzs7O09BR0c7SUFDTSxhQUFhLEdBQUcsZ0NBQWdDLENBQUM7SUFFMUQ7O09BRUc7SUFDTyxTQUFTLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQUV6Qzs7T0FFRztJQUNPLFVBQVUsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBRTFDOztPQUVHO0lBQ08sY0FBYyxHQUFHLElBQUksWUFBWSxFQUF1QixDQUFDO0lBRW5FOztPQUVHO0lBQ00sV0FBVyxHQUF5RCxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFFdEY7O09BRUc7SUFDTSxjQUFjLEdBQStCLE1BQU0sQ0FBQyxFQUFFLENBQUMs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QU07Z0JBS0csY0FBYztzQkFBdkIsTUFBTTtnQkFLRSxXQUFXO3NCQUFuQixLQUFLO2dCQUtHLGNBQWM7c0JBQXRCLEtBQUs7Z0JBcUJOLFVBQVU7c0JBRFQsWUFBWTt1QkFBQyxVQUFVLEVBQUUsQ0FBQyxZQUFZLENBQUM7Z0JBU3hDLFNBQVM7c0JBRFIsWUFBWTt1QkFBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBVW5DLFFBQVE7c0JBRFAsWUFBWTt1QkFBQyxPQUFPLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztnQkFzRDlDLE1BQU07c0JBREwsWUFBWTt1QkFBQyxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50UmVmLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdExpc3RlbmVyLFxuICBJbmplY3RvcixcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT3V0cHV0LFxuICBWaWV3Q29udGFpbmVyUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtOZ3hUZXh0QXV0b2NvbXBsZXRlTWVudUNvbXBvbmVudH0gZnJvbSBcIi4vbmd4LXRleHQtYXV0b2NvbXBsZXRlLW1lbnUuY29tcG9uZW50XCI7XG5pbXBvcnQge1N1YmplY3QsIHRha2VVbnRpbH0gZnJvbSBcInJ4anNcIjtcbmltcG9ydCB0b1BYIGZyb20gJ3RvLXB4JztcbmltcG9ydCBnZXRDYXJldENvb3JkaW5hdGVzIGZyb20gJ3RleHRhcmVhLWNhcmV0JztcblxuZXhwb3J0IGludGVyZmFjZSBDaG9pY2VTZWxlY3RlZEV2ZW50IHtcbiAgY2hvaWNlOiBzdHJpbmc7XG4gIGluc2VydGVkQXQ6IHtcbiAgICBzdGFydDogbnVtYmVyO1xuICAgIGVuZDogbnVtYmVyO1xuICB9O1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBhbmd1bGFyLWVzbGludC9kaXJlY3RpdmUtc2VsZWN0b3JcbiAgc2VsZWN0b3I6ICd0ZXh0YXJlYVtOZ3hUZXh0QXV0b2NvbXBsZXRlXSwgaW5wdXRbdHlwZT1cInRleHRcIl1bTmd4VGV4dEF1dG9jb21wbGV0ZV0nLFxuICBzdGFuZGFsb25lOiB0cnVlXG59KVxuZXhwb3J0IGNsYXNzIE5neFRleHRBdXRvY29tcGxldGVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuXG4gIC8qKlxuICAgKiBUaGUgY2hhcmFjdGVyIHRoYXQgd2lsbCB0cmlnZ2VyIHRoZSBtZW51IHRvIGFwcGVhclxuICAgKi9cbiAgQElucHV0KCkgdHJpZ2dlckNoYXJhY3RlciA9ICdAJztcblxuICAvKipcbiAgICogQW4gb3B0aW9uYWwga2V5Ym9hcmQgc2hvcnRjdXQgdGhhdCB3aWxsIHRyaWdnZXIgdGhlIG1lbnUgdG8gYXBwZWFyXG4gICAqL1xuICBASW5wdXQoKSBrZXlib2FyZFNob3J0Y3V0PzogKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgcmVndWxhciBleHByZXNzaW9uIHRoYXQgd2lsbCBtYXRjaCB0aGUgc2VhcmNoIHRleHQgYWZ0ZXIgdGhlIHRyaWdnZXIgY2hhcmFjdGVyXG4gICAqL1xuICBASW5wdXQoKSBzZWFyY2hSZWdleHAgPSAvXlxcdyokLztcblxuICAvKipcbiAgICogV2hldGhlciB0byBjbG9zZSB0aGUgbWVudSB3aGVuIHRoZSBob3N0IHRleHRhcmVhIGxvc2VzIGZvY3VzXG4gICAqL1xuICBASW5wdXQoKSBjbG9zZU1lbnVPbkJsdXIgPSBmYWxzZTtcblxuICAvKipcbiAgICogVGhlIG1lbnUgY29tcG9uZW50IHRvIHNob3cgd2l0aCBhdmFpbGFibGUgb3B0aW9ucy5cbiAgICogWW91IGNhbiBleHRlbmQgdGhlIGJ1aWx0IGluIGBUZXh0SW5wdXRBdXRvY29tcGxldGVNZW51Q29tcG9uZW50YCBjb21wb25lbnQgdG8gdXNlIGEgY3VzdG9tIHRlbXBsYXRlXG4gICAqL1xuICBASW5wdXQoKSBtZW51Q29tcG9uZW50ID0gTmd4VGV4dEF1dG9jb21wbGV0ZU1lbnVDb21wb25lbnQ7XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBvcHRpb25zIG1lbnUgaXMgc2hvd25cbiAgICovXG4gIEBPdXRwdXQoKSBtZW51U2hvd24gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBvcHRpb25zIG1lbnUgaXMgaGlkZGVuXG4gICAqL1xuICBAT3V0cHV0KCkgbWVudUhpZGRlbiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gYSBjaG9pY2UgaXMgc2VsZWN0ZWRcbiAgICovXG4gIEBPdXRwdXQoKSBjaG9pY2VTZWxlY3RlZCA9IG5ldyBFdmVudEVtaXR0ZXI8Q2hvaWNlU2VsZWN0ZWRFdmVudD4oKTtcblxuICAvKipcbiAgICogQSBmdW5jdGlvbiB0aGF0IGFjY2VwdHMgYSBzZWFyY2ggc3RyaW5nIGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIGNob2ljZXMuIENhbiBhbHNvIHJldHVybiBhIHByb21pc2UuXG4gICAqL1xuICBASW5wdXQoKSBmaW5kQ2hvaWNlczogKHNlYXJjaFRleHQ6IHN0cmluZykgPT4gc3RyaW5nW10gfCBQcm9taXNlPHN0cmluZ1tdPiA9ICgpID0+IFtdO1xuXG4gIC8qKlxuICAgKiBBIGZ1bmN0aW9uIHRoYXQgZm9ybWF0cyB0aGUgc2VsZWN0ZWQgY2hvaWNlIG9uY2Ugc2VsZWN0ZWQuXG4gICAqL1xuICBASW5wdXQoKSBnZXRDaG9pY2VMYWJlbDogKGNob2ljZTogc3RyaW5nKSA9PiBzdHJpbmcgPSBjaG9pY2UgPT4gY2hvaWNlO1xuXG4gIHByaXZhdGUgbWVudTpcbiAgICB8IHtcbiAgICBjb21wb25lbnQ6IENvbXBvbmVudFJlZjxOZ3hUZXh0QXV0b2NvbXBsZXRlTWVudUNvbXBvbmVudD47XG4gICAgdHJpZ2dlckNoYXJhY3RlclBvc2l0aW9uOiBudW1iZXI7XG4gICAgbGFzdENhcmV0UG9zaXRpb24/OiBudW1iZXI7XG4gIH1cbiAgICB8IHVuZGVmaW5lZDtcblxuICBwcml2YXRlIG1lbnVIaWRkZW4kID0gbmV3IFN1YmplY3QoKTtcblxuICBwcml2YXRlIHVzaW5nU2hvcnRjdXQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgcHJpdmF0ZSBlbG06IEVsZW1lbnRSZWZcbiAgKSB7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdrZXlwcmVzcycsIFsnJGV2ZW50LmtleSddKVxuICBvbktleXByZXNzKGtleTogc3RyaW5nKSB7XG4gICAgaWYgKGtleSA9PT0gdGhpcy50cmlnZ2VyQ2hhcmFjdGVyKSB7XG4gICAgICB0aGlzLnVzaW5nU2hvcnRjdXQgPSBmYWxzZTtcbiAgICAgIHRoaXMuc2hvd01lbnUoKTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdrZXlkb3duJywgWyckZXZlbnQnXSlcbiAgb25LZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKHRoaXMua2V5Ym9hcmRTaG9ydGN1dCAmJiB0aGlzLmtleWJvYXJkU2hvcnRjdXQoZXZlbnQpKSB7XG4gICAgICB0aGlzLnVzaW5nU2hvcnRjdXQgPSB0cnVlO1xuICAgICAgdGhpcy5zaG93TWVudSgpO1xuICAgICAgdGhpcy5vbkNoYW5nZSgnJyk7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignaW5wdXQnLCBbJyRldmVudC50YXJnZXQudmFsdWUnXSlcbiAgb25DaGFuZ2UodmFsdWU6IHN0cmluZykge1xuICAgIGlmICghdGhpcy5tZW51KSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICB2YWx1ZVt0aGlzLm1lbnUudHJpZ2dlckNoYXJhY3RlclBvc2l0aW9uXSAhPT0gdGhpcy50cmlnZ2VyQ2hhcmFjdGVyICYmXG4gICAgICAhdGhpcy51c2luZ1Nob3J0Y3V0XG4gICAgKSB7XG4gICAgICB0aGlzLmhpZGVNZW51KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGN1cnNvciA9IHRoaXMuZWxtLm5hdGl2ZUVsZW1lbnQuc2VsZWN0aW9uU3RhcnQ7XG4gICAgICBpZiAoY3Vyc29yIDwgdGhpcy5tZW51LnRyaWdnZXJDaGFyYWN0ZXJQb3NpdGlvbikge1xuICAgICAgICB0aGlzLmhpZGVNZW51KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy51c2luZ1Nob3J0Y3V0ICYmICF0aGlzLm1lbnUpIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMudHJpZ2dlckNoYXJhY3RlcjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvZmZzZXQgPSB0aGlzLnVzaW5nU2hvcnRjdXQgPyAwIDogMTtcbiAgICAgICAgY29uc3Qgc2VhcmNoVGV4dCA9IHZhbHVlLnNsaWNlKFxuICAgICAgICAgIHRoaXMubWVudS50cmlnZ2VyQ2hhcmFjdGVyUG9zaXRpb24gKyBvZmZzZXQsXG4gICAgICAgICAgY3Vyc29yXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKCFzZWFyY2hUZXh0Lm1hdGNoKHRoaXMuc2VhcmNoUmVnZXhwKSkge1xuICAgICAgICAgIHRoaXMuaGlkZU1lbnUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm1lbnUuY29tcG9uZW50Lmluc3RhbmNlLnNlYXJjaFRleHQgPSBzZWFyY2hUZXh0O1xuICAgICAgICAgIHRoaXMubWVudS5jb21wb25lbnQuaW5zdGFuY2UuY2hvaWNlcyA9IFtdO1xuICAgICAgICAgIHRoaXMubWVudS5jb21wb25lbnQuaW5zdGFuY2UuY2hvaWNlTG9hZEVycm9yID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHRoaXMubWVudS5jb21wb25lbnQuaW5zdGFuY2UuY2hvaWNlTG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5tZW51LmNvbXBvbmVudC5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKHRoaXMuZmluZENob2ljZXMoc2VhcmNoVGV4dCkpXG4gICAgICAgICAgICAudGhlbihjaG9pY2VzID0+IHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMubWVudSkge1xuICAgICAgICAgICAgICAgIHRoaXMubWVudS5jb21wb25lbnQuaW5zdGFuY2UuY2hvaWNlcyA9IGNob2ljZXM7XG4gICAgICAgICAgICAgICAgdGhpcy5tZW51LmNvbXBvbmVudC5pbnN0YW5jZS5jaG9pY2VMb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5tZW51LmNvbXBvbmVudC5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMubWVudSkge1xuICAgICAgICAgICAgICAgIHRoaXMubWVudS5jb21wb25lbnQuaW5zdGFuY2UuY2hvaWNlTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMubWVudS5jb21wb25lbnQuaW5zdGFuY2UuY2hvaWNlTG9hZEVycm9yID0gZXJyO1xuICAgICAgICAgICAgICAgIHRoaXMubWVudS5jb21wb25lbnQuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2JsdXInKVxuICBvbkJsdXIoKSB7XG4gICAgaWYgKHRoaXMubWVudSkge1xuICAgICAgdGhpcy5tZW51Lmxhc3RDYXJldFBvc2l0aW9uID0gdGhpcy5lbG0ubmF0aXZlRWxlbWVudC5zZWxlY3Rpb25TdGFydDtcblxuICAgICAgaWYgKHRoaXMuY2xvc2VNZW51T25CbHVyKSB7XG4gICAgICAgIHRoaXMuaGlkZU1lbnUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNob3dNZW51KCkge1xuICAgIGlmICghdGhpcy5tZW51KSB7XG4gICAgICB0aGlzLm1lbnUgPSB7XG4gICAgICAgIGNvbXBvbmVudDogdGhpcy52aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUNvbXBvbmVudCh0aGlzLm1lbnVDb21wb25lbnQpLFxuICAgICAgICB0cmlnZ2VyQ2hhcmFjdGVyUG9zaXRpb246IHRoaXMuZWxtLm5hdGl2ZUVsZW1lbnQuc2VsZWN0aW9uU3RhcnRcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGxpbmVIZWlnaHQgPSB0aGlzLmdldExpbmVIZWlnaHQodGhpcy5lbG0ubmF0aXZlRWxlbWVudCk7XG4gICAgICBjb25zdCB7dG9wLCBsZWZ0fSA9IGdldENhcmV0Q29vcmRpbmF0ZXMoXG4gICAgICAgIHRoaXMuZWxtLm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgIHRoaXMuZWxtLm5hdGl2ZUVsZW1lbnQuc2VsZWN0aW9uU3RhcnRcbiAgICAgICk7XG4gICAgICB0aGlzLm1lbnUuY29tcG9uZW50Lmluc3RhbmNlLnBvc2l0aW9uID0ge1xuICAgICAgICB0b3A6IHRvcCArIGxpbmVIZWlnaHQsXG4gICAgICAgIGxlZnRcbiAgICAgIH07XG4gICAgICB0aGlzLm1lbnUuY29tcG9uZW50LmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgIHRoaXMubWVudS5jb21wb25lbnQuaW5zdGFuY2Uuc2VsZWN0Q2hvaWNlXG4gICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLm1lbnVIaWRkZW4kKSlcbiAgICAgICAgLnN1YnNjcmliZShjaG9pY2UgPT4ge1xuICAgICAgICAgIGNvbnN0IGxhYmVsID0gdGhpcy5nZXRDaG9pY2VMYWJlbChjaG9pY2UpO1xuICAgICAgICAgIGNvbnN0IHRleHRhcmVhOiBIVE1MVGV4dEFyZWFFbGVtZW50ID0gdGhpcy5lbG0ubmF0aXZlRWxlbWVudDtcbiAgICAgICAgICBjb25zdCB2YWx1ZTogc3RyaW5nID0gdGV4dGFyZWEudmFsdWU7XG4gICAgICAgICAgY29uc3Qgc3RhcnRJbmRleCA9IHRoaXMubWVudSEudHJpZ2dlckNoYXJhY3RlclBvc2l0aW9uO1xuICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gdmFsdWUuc2xpY2UoMCwgc3RhcnRJbmRleCk7XG4gICAgICAgICAgY29uc3QgY2FyZXRQb3NpdGlvbiA9XG4gICAgICAgICAgICB0aGlzLm1lbnUhLmxhc3RDYXJldFBvc2l0aW9uIHx8IHRleHRhcmVhLnNlbGVjdGlvblN0YXJ0O1xuICAgICAgICAgIGNvbnN0IGVuZCA9IHZhbHVlLnNsaWNlKGNhcmV0UG9zaXRpb24pO1xuICAgICAgICAgIHRleHRhcmVhLnZhbHVlID0gc3RhcnQgKyBsYWJlbCArIGVuZDtcbiAgICAgICAgICAvLyBmb3JjZSBuZyBtb2RlbCAvIGZvcm0gY29udHJvbCB0byB1cGRhdGVcbiAgICAgICAgICB0ZXh0YXJlYS5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnaW5wdXQnKSk7XG4gICAgICAgICAgdGhpcy5oaWRlTWVudSgpO1xuICAgICAgICAgIGNvbnN0IHNldEN1cnNvckF0ID0gKHN0YXJ0ICsgbGFiZWwpLmxlbmd0aDtcbiAgICAgICAgICB0ZXh0YXJlYS5zZXRTZWxlY3Rpb25SYW5nZShzZXRDdXJzb3JBdCwgc2V0Q3Vyc29yQXQpO1xuICAgICAgICAgIHRleHRhcmVhLmZvY3VzKCk7XG4gICAgICAgICAgdGhpcy5jaG9pY2VTZWxlY3RlZC5lbWl0KHtcbiAgICAgICAgICAgIGNob2ljZSxcbiAgICAgICAgICAgIGluc2VydGVkQXQ6IHtcbiAgICAgICAgICAgICAgc3RhcnQ6IHN0YXJ0SW5kZXgsXG4gICAgICAgICAgICAgIGVuZDogc3RhcnRJbmRleCArIGxhYmVsLmxlbmd0aFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIHRoaXMubWVudVNob3duLmVtaXQoKTtcbiAgICB9XG4gIH1cblxuICBnZXRMaW5lSGVpZ2h0KGVsbTogSFRNTEVsZW1lbnQpOiBudW1iZXIge1xuICAgIGNvbnN0IGxpbmVIZWlnaHRTdHIgPSBnZXRDb21wdXRlZFN0eWxlKGVsbSkubGluZUhlaWdodDtcbiAgICBjb25zdCBmb250U2l6ZVN0ciA9IGdldENvbXB1dGVkU3R5bGUoZWxtKS5mb250U2l6ZTtcbiAgICBjb25zdCBmb250U2l6ZSA9IHRvUFgoZm9udFNpemVTdHIpID8/IDE2O1xuICAgIGNvbnN0IG5vcm1hbCA9IDEuMjtcbiAgICBjb25zdCBsaW5lSGVpZ2h0TnVtID0gcGFyc2VGbG9hdChsaW5lSGVpZ2h0U3RyKTtcblxuICAgIGlmIChsaW5lSGVpZ2h0U3RyID09PSBsaW5lSGVpZ2h0TnVtICsgJycpIHtcbiAgICAgIHJldHVybiBmb250U2l6ZSAqIGxpbmVIZWlnaHROdW07XG4gICAgfVxuXG4gICAgaWYgKGxpbmVIZWlnaHRTdHIudG9Mb3dlckNhc2UoKSA9PT0gJ25vcm1hbCcpIHtcbiAgICAgIHJldHVybiBmb250U2l6ZSAqIG5vcm1hbDtcbiAgICB9XG5cbiAgICByZXR1cm4gdG9QWChsaW5lSGVpZ2h0U3RyKSA/PyAxNjtcbiAgfVxuXG4gIHByaXZhdGUgaGlkZU1lbnUoKSB7XG4gICAgaWYgKHRoaXMubWVudSkge1xuICAgICAgdGhpcy5tZW51LmNvbXBvbmVudC5kZXN0cm95KCk7XG4gICAgICB0aGlzLm1lbnVIaWRkZW4kLm5leHQobnVsbCk7XG4gICAgICB0aGlzLm1lbnVIaWRkZW4uZW1pdCgpO1xuICAgICAgdGhpcy5tZW51ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuaGlkZU1lbnUoKTtcbiAgfVxuXG59XG4iXX0=