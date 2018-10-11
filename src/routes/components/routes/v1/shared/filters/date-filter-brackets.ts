export class DateFilterBrackets {
    public static Factory() {
        var factoryFunction = ($filter: ng.IFilterService) => {
            var angularDateFilter = $filter('date');
            return (theDate: string) => {
                if (theDate != null) {
                    return "(" + angularDateFilter(theDate, "hh:mm a") + ")";
                }
                else {
                    return "";
                }
                
            };
        };

        factoryFunction.$inject = ['$filter'];

        return factoryFunction;
    }
}