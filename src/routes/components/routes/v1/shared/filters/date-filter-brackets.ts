export class DateFilterBrackets {
	public static Factory() {
		let factoryFunction = ($filter: ng.IFilterService) => {
			let angularDateFilter = $filter('date');
			return (theDate: string) => {
				if (theDate != null) {
					return '(' + angularDateFilter(theDate, 'hh:mm a') + ')';
				} else {
					return '';
				}
			};
		};

		factoryFunction.$inject = ['$filter'];

		return factoryFunction;
	}
}
