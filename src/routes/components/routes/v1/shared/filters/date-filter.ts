export class DateFilter {
    public static Factory() {
        var factoryFunction = ($filter: ng.IFilterService) => {
            var angularDateFilter = $filter('date');
            return (theDate: string) => {
                return angularDateFilter(theDate, "hh:mm a");
            };
        };

        factoryFunction.$inject = ['$filter'];

        return factoryFunction;
    }
}