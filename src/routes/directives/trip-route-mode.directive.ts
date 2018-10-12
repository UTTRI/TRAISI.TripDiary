import { UpgradeComponent } from "@angular/upgrade/static";
import { ElementRef, Injector, Directive } from "@angular/core";

@Directive({
    selector: 'trip-route-mode'
})
export class TripRouteModeDirective extends UpgradeComponent {
    constructor(elementRef: ElementRef, injector: Injector) {


        console.log(injector);
        super('tripRouteMode', elementRef, injector);

        console.log('in here');
        console.log(injector);
    }
}

export function tripRouteModeContainer() {
    return {
        restrict: 'E',
        scope: {},
        bindToController: {
        },
        template: `hello there`,
        controller: function () {

            
        }
    }
};