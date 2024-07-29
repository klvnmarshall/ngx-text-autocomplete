import { Component, HostListener, ViewChild } from '@angular/core';
import { Subject } from "rxjs";
import * as i0 from "@angular/core";
export class NgxTextAutocompleteMenuComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXRleHQtYXV0b2NvbXBsZXRlLW1lbnUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXRleHQtYXV0b2NvbXBsZXRlL3NyYy9saWIvbmd4LXRleHQtYXV0b2NvbXBsZXRlLW1lbnUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQWMsWUFBWSxFQUFFLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM3RSxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDOztBQXdDN0IsTUFBTSxPQUFPLGdDQUFnQztJQUNoQixtQkFBbUIsQ0FBZ0M7SUFDOUUsUUFBUSxDQUEyQztJQUNuRCxZQUFZLEdBQUcsSUFBSSxPQUFPLEVBQVUsQ0FBQztJQUNyQyxZQUFZLEdBQUcsRUFBRSxDQUFBO0lBQ2pCLFVBQVUsR0FBRyxFQUFFLENBQUM7SUFDaEIsZUFBZSxDQUFTO0lBQ3hCLGFBQWEsR0FBRyxLQUFLLENBQUM7SUFFZCxRQUFRLEdBQWEsRUFBRSxDQUFDO0lBQ2hDLElBQUksT0FBTyxDQUFDLE9BQWlCO1FBQzNCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO0lBQzFCLENBQUM7SUFFRCxJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUVELFNBQVMsR0FBRyxDQUFDLEtBQWEsRUFBRSxNQUFXLEVBQUUsRUFBRSxDQUN6QyxNQUFNLENBQUMsRUFBRSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0lBRy9DLFdBQVcsQ0FBQyxLQUFvQjtRQUM5QixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdkIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3RELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUM1QixJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNqQyxDQUFDO0lBQ0gsQ0FBQztJQUdELFNBQVMsQ0FBQyxLQUFvQjtRQUM1QixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdkIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3RELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUM1QixJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNqQyxDQUFDO0lBQ0gsQ0FBQztJQUdELE9BQU8sQ0FBQyxLQUFvQjtRQUMxQixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ2pELEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDNUMsQ0FBQztJQUNILENBQUM7SUFFTyxjQUFjLENBQUMsS0FBYTtRQUNsQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFekMsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUM3QixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFDbEYsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbEUsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFFOUMsSUFDRSxVQUFVLENBQUMsR0FBRyxHQUFHLFVBQVUsQ0FBQyxHQUFHO2dCQUMvQixVQUFVLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQ3JDLENBQUM7Z0JBQ0QsRUFBRSxDQUFDLGNBQWMsQ0FBQztvQkFDaEIsUUFBUSxFQUFFLFFBQVE7b0JBQ2xCLEtBQUssRUFBRSxTQUFTO2lCQUNqQixDQUFDLENBQUM7WUFDTCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7dUdBakVVLGdDQUFnQzsyRkFBaEMsZ0NBQWdDLHVYQWxDakM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFCVDs7MkZBYVUsZ0NBQWdDO2tCQXRDNUMsU0FBUzsrQkFDRSw0QkFBNEIsY0FDMUIsSUFBSSxXQUNQLEVBQUUsWUFDRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBcUJUOzhCQWMwQixtQkFBbUI7c0JBQTdDLFNBQVM7dUJBQUMsY0FBYztnQkFxQnpCLFdBQVc7c0JBRFYsWUFBWTt1QkFBQyw0QkFBNEIsRUFBRSxDQUFDLFFBQVEsQ0FBQztnQkFVdEQsU0FBUztzQkFEUixZQUFZO3VCQUFDLDBCQUEwQixFQUFFLENBQUMsUUFBUSxDQUFDO2dCQVVwRCxPQUFPO3NCQUROLFlBQVk7dUJBQUMsd0JBQXdCLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgRWxlbWVudFJlZiwgSG9zdExpc3RlbmVyLCBWaWV3Q2hpbGR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tIFwicnhqc1wiO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtdGV4dC1hdXRvY29tcGxldGUtbWVudScsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIGltcG9ydHM6IFtdLFxuICB0ZW1wbGF0ZTogYFxuXG4gICAgQGlmIChjaG9pY2VzLmxlbmd0aCkge1xuICAgICAgPHVsXG4gICAgICAgICNkcm9wZG93bk1lbnVcbiAgICAgICAgY2xhc3M9XCJkcm9wZG93bi1tZW51XCJcbiAgICAgICAgW3N0eWxlLnRvcC5weF09XCJwb3NpdGlvbj8udG9wXCJcbiAgICAgICAgW3N0eWxlLmxlZnQucHhdPVwicG9zaXRpb24/LmxlZnRcIj5cblxuICAgICAgICBAZm9yIChjaG9pY2Ugb2YgY2hvaWNlczsgdHJhY2sgY2hvaWNlKSB7XG4gICAgICAgICAgPGxpIGNsYXNzPVwiZHJvcGRvd24taXRlbVwiXG4gICAgICAgICAgICAgIFtjbGFzcy5hY3RpdmVdPVwiYWN0aXZlQ2hvaWNlID09PSBjaG9pY2VcIlxuICAgICAgICAgICAgICAoY2xpY2spPVwic2VsZWN0Q2hvaWNlLm5leHQoY2hvaWNlKVwiPlxuICAgICAgICAgICAgPGE+XG4gICAgICAgICAgICAgIHt7IGNob2ljZSB9fVxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgIH1cbiAgICAgIDwvdWw+XG4gICAgfVxuXG4gIGAsXG4gIHN0eWxlczogYFxuICAgIC5kcm9wZG93bi1tZW51IHtcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgbWF4LWhlaWdodDogNDAwcHg7XG4gICAgICBvdmVyZmxvdy15OiBhdXRvO1xuICAgIH1cblxuICAgIC5kcm9wZG93bi1pdGVtOmhvdmVyIHtcbiAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICB9XG4gIGBcbn0pXG5leHBvcnQgY2xhc3MgTmd4VGV4dEF1dG9jb21wbGV0ZU1lbnVDb21wb25lbnQge1xuICBAVmlld0NoaWxkKCdkcm9wZG93bk1lbnUnKSBkcm9wZG93bk1lbnVFbGVtZW50PzogRWxlbWVudFJlZjxIVE1MVUxpc3RFbGVtZW50PjtcbiAgcG9zaXRpb246IHsgdG9wOiBudW1iZXI7IGxlZnQ6IG51bWJlciB9IHwgdW5kZWZpbmVkXG4gIHNlbGVjdENob2ljZSA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgYWN0aXZlQ2hvaWNlID0gJydcbiAgc2VhcmNoVGV4dCA9ICcnO1xuICBjaG9pY2VMb2FkRXJyb3I/OiBzdHJpbmdcbiAgY2hvaWNlTG9hZGluZyA9IGZhbHNlO1xuXG4gIHByaXZhdGUgX2Nob2ljZXM6IHN0cmluZ1tdID0gW107XG4gIHNldCBjaG9pY2VzKGNob2ljZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fY2hvaWNlcyA9IGNob2ljZXM7XG4gIH1cblxuICBnZXQgY2hvaWNlcygpIHtcbiAgICByZXR1cm4gdGhpcy5fY2hvaWNlcztcbiAgfVxuXG4gIHRyYWNrQnlJZCA9IChpbmRleDogbnVtYmVyLCBjaG9pY2U6IGFueSkgPT5cbiAgICBjaG9pY2UuaWQgIT09IHVuZGVmaW5lZCA/IGNob2ljZS5pZCA6IGNob2ljZTtcblxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDprZXlkb3duLkFycm93RG93bicsIFsnJGV2ZW50J10pXG4gIG9uQXJyb3dEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuY2hvaWNlcy5pbmRleE9mKHRoaXMuYWN0aXZlQ2hvaWNlKTtcbiAgICBpZiAodGhpcy5jaG9pY2VzW2luZGV4ICsgMV0pIHtcbiAgICAgIHRoaXMuc2Nyb2xsVG9DaG9pY2UoaW5kZXggKyAxKTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDprZXlkb3duLkFycm93VXAnLCBbJyRldmVudCddKVxuICBvbkFycm93VXAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5jaG9pY2VzLmluZGV4T2YodGhpcy5hY3RpdmVDaG9pY2UpO1xuICAgIGlmICh0aGlzLmNob2ljZXNbaW5kZXggLSAxXSkge1xuICAgICAgdGhpcy5zY3JvbGxUb0Nob2ljZShpbmRleCAtIDEpO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OmtleWRvd24uRW50ZXInLCBbJyRldmVudCddKVxuICBvbkVudGVyKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKHRoaXMuY2hvaWNlcy5pbmRleE9mKHRoaXMuYWN0aXZlQ2hvaWNlKSA+IC0xKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy5zZWxlY3RDaG9pY2UubmV4dCh0aGlzLmFjdGl2ZUNob2ljZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzY3JvbGxUb0Nob2ljZShpbmRleDogbnVtYmVyKSB7XG4gICAgdGhpcy5hY3RpdmVDaG9pY2UgPSB0aGlzLl9jaG9pY2VzW2luZGV4XTtcblxuICAgIGlmICh0aGlzLmRyb3Bkb3duTWVudUVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IHVsUG9zaXRpb24gPSB0aGlzLmRyb3Bkb3duTWVudUVsZW1lbnQubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGNvbnN0IGxpID0gdGhpcy5kcm9wZG93bk1lbnVFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5baW5kZXhdO1xuICAgICAgY29uc3QgbGlQb3NpdGlvbiA9IGxpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICBpZiAoXG4gICAgICAgIGxpUG9zaXRpb24udG9wIDwgdWxQb3NpdGlvbi50b3AgfHxcbiAgICAgICAgbGlQb3NpdGlvbi5ib3R0b20gPiB1bFBvc2l0aW9uLmJvdHRvbVxuICAgICAgKSB7XG4gICAgICAgIGxpLnNjcm9sbEludG9WaWV3KHtcbiAgICAgICAgICBiZWhhdmlvcjogJ3Ntb290aCcsXG4gICAgICAgICAgYmxvY2s6ICduZWFyZXN0J1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==