import { ElementRef, EventEmitter, OnDestroy, ViewContainerRef } from '@angular/core';
import { NgxTextAutocompleteMenuComponent } from "./ngx-text-autocomplete-menu.component";
import * as i0 from "@angular/core";
export interface ChoiceSelectedEvent {
    choice: string;
    insertedAt: {
        start: number;
        end: number;
    };
}
export declare class NgxTextAutocompleteDirective implements OnDestroy {
    private viewContainerRef;
    private elm;
    /**
     * The character that will trigger the menu to appear
     */
    triggerCharacter: string;
    /**
     * An optional keyboard shortcut that will trigger the menu to appear
     */
    keyboardShortcut?: (event: KeyboardEvent) => boolean;
    /**
     * The regular expression that will match the search text after the trigger character
     */
    searchRegexp: RegExp;
    /**
     * Whether to close the menu when the host textarea loses focus
     */
    closeMenuOnBlur: boolean;
    /**
     * The menu component to show with available options.
     * You can extend the built in `TextInputAutocompleteMenuComponent` component to use a custom template
     */
    menuComponent: typeof NgxTextAutocompleteMenuComponent;
    /**
     * Called when the options menu is shown
     */
    menuShown: EventEmitter<any>;
    /**
     * Called when the options menu is hidden
     */
    menuHidden: EventEmitter<any>;
    /**
     * Called when a choice is selected
     */
    choiceSelected: EventEmitter<ChoiceSelectedEvent>;
    /**
     * A function that accepts a search string and returns an array of choices. Can also return a promise.
     */
    findChoices: (searchText: string) => string[] | Promise<string[]>;
    /**
     * A function that formats the selected choice once selected.
     */
    getChoiceLabel: (choice: string) => string;
    private menu;
    private menuHidden$;
    private usingShortcut;
    constructor(viewContainerRef: ViewContainerRef, elm: ElementRef);
    onKeypress(key: string): void;
    onKeyDown(event: KeyboardEvent): void;
    onChange(value: string): void;
    onBlur(): void;
    private showMenu;
    getLineHeight(elm: HTMLElement): number;
    private hideMenu;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxTextAutocompleteDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgxTextAutocompleteDirective, "textarea[NgxTextAutocomplete], input[type=\"text\"][NgxTextAutocomplete]", never, { "triggerCharacter": { "alias": "triggerCharacter"; "required": false; }; "keyboardShortcut": { "alias": "keyboardShortcut"; "required": false; }; "searchRegexp": { "alias": "searchRegexp"; "required": false; }; "closeMenuOnBlur": { "alias": "closeMenuOnBlur"; "required": false; }; "menuComponent": { "alias": "menuComponent"; "required": false; }; "findChoices": { "alias": "findChoices"; "required": false; }; "getChoiceLabel": { "alias": "getChoiceLabel"; "required": false; }; }, { "menuShown": "menuShown"; "menuHidden": "menuHidden"; "choiceSelected": "choiceSelected"; }, never, never, true, never>;
}
