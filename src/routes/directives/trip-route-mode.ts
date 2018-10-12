import { Directive, ElementRef, Injector, SimpleChanges } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';

@Directive({
  selector: 'trip-route-mode'
})
export class TripRouteModeDirective extends UpgradeComponent {
  constructor(elementRef: ElementRef, injector: Injector) {

    console.log('here');
    console.log(elementRef);
    console.log(injector);
    super('tripRouteMode', elementRef, injector);
  }
}