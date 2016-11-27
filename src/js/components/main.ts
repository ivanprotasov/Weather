import WeatherService from './../services/weatherService';
import EventService from './../services/eventService';

import AllWeatherData from './weatherDataInterfaces/allWeatherDataInterface';
import Table from './table';
import Pagination from './pagination';

class Main {
    constructor () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                WeatherService.getWeather(position)
                    .then(
                        response => {
                            let weatherTable;
                            let tableData = JSON.parse(response) as AllWeatherData;
                            let eventService = new EventService();

                            let weatherHead = WeatherService.prepareWeatherHeaderData(tableData);
                            let weatherBody = WeatherService.prepareWeatherBodyData(tableData);
                            let pagination = new Pagination(weatherBody, 10, eventService);
                            let splittedData = pagination.getData();
                            weatherTable = new Table(weatherHead, splittedData);

                            document.getElementById('root').innerHTML = `
                    <div class="bs-docs-header">
                        <div class="container">
                            <h1>Awesome weather app</h1>
                        </div>
                    </div>
                    <div id='weather-table'></div>
                    <div id='weather-pagination' class='align-center'></div>
                    `;
                            document.getElementById('weather-table').innerHTML = weatherTable.getEl();
                            document.getElementById('weather-pagination').appendChild(pagination.generatePaginationEl());

                            eventService.subscribe('dataIsChanged', function (splittedData) {
                                weatherTable.render(splittedData);
                                document.getElementById('weather-table').innerHTML = weatherTable.getEl();
                            });
                        },
                        error => document.getElementById('root').innerHTML = `Rejected: ${error}`
                    );
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }
}

export default Main;