export class OrdinalFilter {
	public static Factory() {
		let factoryFunction = () => {
			return (n: number) => {
				let s = ['th', 'st', 'nd', 'rd'],
					v = n % 100;
				return n + (s[(v - 20) % 10] || s[v] || s[0]);
			};
		};

		return factoryFunction;
	}
}
