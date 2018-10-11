export class TimeFilter {
    public static Factory() {
        var factoryFunction = () => {
            ;
            return (seconds: number) => {
                let minutes = seconds/60;
                let timestring = minutes > 60? Math.floor(minutes/60) + "hr " : "";
                timestring = timestring + Math.floor(minutes % 60) + "min";
                return timestring;
            };
        };


        return factoryFunction;
    }
}