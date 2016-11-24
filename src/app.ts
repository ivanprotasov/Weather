import WeatherService from './services/weatherService';
import EventService from './services/eventService';

import AllWeatherData from './components/weatherTable/allWeatherDataInterface';
import Table from './components/table/table';
import "./styles/base.scss";


if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
        WeatherService.getWeather(position)
            .then(
                response => {
                    let tableData = JSON.parse(response) as AllWeatherData;

                    //let weatherTable = new Table(WeatherService.prepareWeatherData(tableData));
                    let weatherHead = WeatherService.prepareWeatherHeaderData(tableData);
                    let weatherBody = WeatherService.prepareWeatherBodyData(tableData);
                    let weatherTable = new Table(weatherHead, weatherBody);
                    document.getElementById('root').innerHTML = weatherTable.getEl();
                    var pubSub = new EventService();
                    pubSub.subscribe('myEvent', function(arg){alert("myEvent worked. Arg: " + arg);});
                    pubSub.publish('myEvent', 'it myArg');
                },
                error => document.getElementById('root').innerHTML = `Rejected: ${error}`
            );
    });
} else {
    console.log("Geolocation is not supported by this browser.");
}


document.getElementById('root').innerHTML = `Loading`;



