import HttpService from './httpService';

class WeatherService {
    static getWeather(position) {
        // let url = 'http://api.openweathermap.org/data/2.5/find?lat=53.9&lon=27.5667&cnt=50&APPID=3801414355a652393fc513e2ceef2156';
        let url = 'http://api.openweathermap.org/data/2.5/find?lat=' + position.coords.latitude + '&lon=' + position.coords.longitude + '&cnt=50&APPID=3801414355a652393fc513e2ceef2156';
        // let fakeUrl = './../test-data/test.json';
        return HttpService.httpGet(url);
    }

    static prepareWeatherBodyData(tableData): Array<Array<string>> {
        let parsedBodyData = tableData.list.map(function (currentValue, index: number): Array<string> {
            let rowData: Array<string> = [];
            index++;
            let indexString: string = String(index);
            rowData.push(indexString, currentValue.name);
            let main = currentValue.main;
            for (let key in  main) {
                let valueParam: string = String(main[key]);
                rowData.push(valueParam)
            }
            return rowData;
        });

        return parsedBodyData
    }

    static prepareWeatherHeaderData(tableData): Array<string> {
        let parsedHeaderData: Array<string> = ['#', 'City Name'];
        let main = tableData.list[0].main;
        for (let key in  main) {
            parsedHeaderData.push(key);
        }
        return parsedHeaderData
    }
}


export default WeatherService;