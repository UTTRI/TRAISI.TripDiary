export class DateFilter {
	public static Factory() {
		let factoryFunction = ($filter: ng.IFilterService) => {
			let angularDateFilter = $filter('date');
			return (theDate: string) => {
				return angularDateFilter(theDate, 'hh:mm a');
			};
		};

		factoryFunction.$inject = ['$filter'];

		return factoryFunction;
	}
}
