export class HtmlFilter {
	public static Factory() {
		let factoryFunction = ($filter: ng.ISCEService) => {
			return (value: string) => {
				return $filter.trustAsHtml(value);
			};
		};

		factoryFunction.$inject = ['$sce'];

		return factoryFunction;
	}
}
