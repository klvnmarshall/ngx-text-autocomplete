import { ElementRef } from '@angular/core';
import { Subject } from "rxjs";
import * as i0 from "@angular/core";
export declare class NgxTextAutocompleteMenuComponent {
    dropdownMenuElement?: ElementRef<HTMLUListElement>;
    position: {
        top: number;
        left: number;
    } | undefined;
    selectChoice: Subject<string>;
    activeChoice: string;
    searchText: string;
    choiceLoadError?: string;
    choiceLoading: boolean;
    private _choices;
    set choices(choices: string[]);
    get choices(): string[];
    trackById: (index: number, choice: any) => any;
    onArrowDown(event: KeyboardEvent): void;
    onArrowUp(event: KeyboardEvent): void;
    onEnter(event: KeyboardEvent): void;
    private scrollToChoice;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxTextAutocompleteMenuComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgxTextAutocompleteMenuComponent, "ngx-text-autocomplete-menu", never, {}, {}, never, never, true, never>;
}
