import { Directive, ElementRef } from "@angular/core";

@Directive({
    selector: '[timelineWedge]'
  })
export class TimelineWedge
{
    
   /**
    *Creates an instance of TimelineWedge.
    * @param {ElementRef} _element
    * @memberof TimelineWedge
    */
   constructor(private _element: ElementRef) {
    }
}