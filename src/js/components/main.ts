import WeatherService from './../services/weatherService';
import EventService from './../services/eventService';

import AllWeatherData from './weatherDataInterfaces/allWeatherDataInterface';
import Table from './table';
import Pagination from './pagination';
import GoogleMapsLoader  = require('google-maps') ;

class Main {
    constructor () {

        document.getElementById('root').innerHTML = `
            <div class="bs-docs-header">
                <div class="container">
                    <h1>Awesome weather app</h1>
                </div>
            </div>
            <div id='weather-table'>Loading</div>
            <div id='weather-pagination' class='align-center'></div>
            <div id='weather-map'></div>`;


        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                WeatherService.getWeather(position).then(this.renderPage.bind(this), this.renderError.bind(this));
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
            WeatherService.getWeather('').then(this.renderPage.bind(this));
        }
    }

    renderPage(data) {
        let weatherTable;
        let tableData = JSON.parse(data) as AllWeatherData;
        let eventService = new EventService();

        let weatherHead = WeatherService.prepareWeatherHeaderData(tableData);
        let weatherBody = WeatherService.prepareWeatherBodyData(tableData);
        let pagination = new Pagination(weatherBody, 10, eventService);
        let splittedData = pagination.getData();
        weatherTable = new Table(weatherHead, splittedData);


        document.getElementById('weather-table').innerHTML = weatherTable.getEl();
        document.getElementById('weather-pagination').appendChild(pagination.generatePaginationEl());

        eventService.subscribe('dataIsChanged', function (splittedData) {
            weatherTable.render(splittedData);
            document.getElementById('weather-table').innerHTML = weatherTable.getEl();
        });
    }

    renderError(error) {
        document.getElementById('weather-table').innerHTML = `Weather data is not available: ${error}`
    }
}

export default Main;