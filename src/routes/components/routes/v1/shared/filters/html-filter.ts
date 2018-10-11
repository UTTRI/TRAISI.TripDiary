export class HtmlFilter {
    public static Factory() {
        var factoryFunction = ($filter: ng.ISCEService) => {
            ;
            return (value: string) => {
                return $filter.trustAsHtml(value);
            };
        };

        factoryFunction.$inject = ['$sce'];

        return factoryFunction;
    }
}