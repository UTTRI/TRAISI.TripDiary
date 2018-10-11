import {TimelineLineDirective} from "./timeline-line-directive";

export class TimelineLineMapDirective extends TimelineLineDirective {

    public templateUrl: string = '/static/dist/directives/trips/templates/timeline-line-map.html';


    /**
     * Factory method for the timeline directive
     */
    public static Factory(url: string = null) {

        var directive = ($window) => {
            return new TimelineLineMapDirective($window);
        };


        return directive;
    }

}