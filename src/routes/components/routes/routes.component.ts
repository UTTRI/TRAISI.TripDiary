import { Component, OnInit } from "@angular/core";


@Component({
    selector: 'traisi-routes-question',
	template: require('./routes.component.html').toString(),
	styles: [require('./routes.component.scss').toString()]
})
export class RoutesComponent  implements OnInit 
{

    /**
     * Angular's ngOnInit
     */
    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }

}