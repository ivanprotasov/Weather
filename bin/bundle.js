/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var weatherService_1 = __webpack_require__(1);
	var eventService_1 = __webpack_require__(3);
	var table_1 = __webpack_require__(4);
	__webpack_require__(5);
	if (navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(function (position) {
	        weatherService_1["default"].getWeather(position)
	            .then(function (response) {
	            var tableData = JSON.parse(response);
	            //let weatherTable = new Table(WeatherService.prepareWeatherData(tableData));
	            var weatherHead = weatherService_1["default"].prepareWeatherHeaderData(tableData);
	            var weatherBody = weatherService_1["default"].prepareWeatherBodyData(tableData);
	            var weatherTable = new table_1["default"](weatherHead, weatherBody);
	            document.getElementById('root').innerHTML = weatherTable.getEl();
	            var pubSub = new eventService_1["default"]();
	            pubSub.subscribe('myEvent', function (arg) { alert("myEvent worked. Arg: " + arg); });
	            pubSub.publish('myEvent', 'it myArg');
	        }, function (error) { return document.getElementById('root').innerHTML = "Rejected: " + error; });
	    });
	}
	else {
	    console.log("Geolocation is not supported by this browser.");
	}
	document.getElementById('root').innerHTML = "Loading";


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var httpService_1 = __webpack_require__(2);
	var WeatherService = (function () {
	    function WeatherService() {
	    }
	    WeatherService.getWeather = function (position) {
	        //let url = 'http://api.openweathermap.org/data/2.5/find?lat=53.9&lon=27.5667&cnt=50&APPID=3801414355a652393fc513e2ceef2156';
	        //let url = 'http://api.openweathermap.org/data/2.5/find?lat='+position.coords.latitude+'&lon='+ position.coords.longitude +'&cnt=50&APPID=3801414355a652393fc513e2ceef2156';
	        var fakeUrl = 'test.json';
	        return httpService_1["default"].httpGet(fakeUrl);
	    };
	    WeatherService.prepareWeatherBodyData = function (tableData) {
	        var parsedBodyData = tableData.list.map(function (currentValue, index) {
	            var rowData = [];
	            index++;
	            var indexString = String(index);
	            rowData.push(indexString, currentValue.name);
	            var main = currentValue.main;
	            for (var key in main) {
	                var valueParam = String(main[key]);
	                rowData.push(valueParam);
	            }
	            return rowData;
	        });
	        return parsedBodyData;
	    };
	    WeatherService.prepareWeatherHeaderData = function (tableData) {
	        var parsedHeaderData = ['#', 'City Name'];
	        var main = tableData.list[0].main;
	        for (var key in main) {
	            parsedHeaderData.push(key);
	        }
	        return parsedHeaderData;
	    };
	    return WeatherService;
	}());
	exports.__esModule = true;
	exports["default"] = WeatherService;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	var HttpService = (function () {
	    function HttpService() {
	    }
	    HttpService.httpGet = function (url) {
	        return new Promise(function (resolve, reject) {
	            var xhr = new XMLHttpRequest();
	            xhr.open('GET', url, true);
	            xhr.onload = function () {
	                if (this.status == 200) {
	                    resolve(this.response);
	                }
	                else {
	                    var error = new Error(this.statusText);
	                    reject(error);
	                }
	            };
	            xhr.onerror = function () {
	                reject(new Error("Network Error"));
	            };
	            xhr.send();
	        });
	    };
	    return HttpService;
	}());
	exports.__esModule = true;
	exports["default"] = HttpService;


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	var EventService = (function () {
	    function EventService() {
	        this.handlers = {};
	    }
	    EventService.prototype.subscribe = function (event, handler) {
	        if (this.handlers[event] === undefined)
	            this.handlers[event] = [];
	        this.handlers[event].push(handler);
	    };
	    EventService.prototype.publish = function (event, data) {
	        if (this.handlers[event] === undefined)
	            return;
	        var i = 0, len = this.handlers[event].length;
	        for (i; i < len; i++) {
	            this.handlers[event][i](arguments[i + 1]);
	        }
	    };
	    return EventService;
	}());
	exports.__esModule = true;
	exports["default"] = EventService;


/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	var Table = (function () {
	    function Table(tHead, tBody) {
	        this.tHead = tHead;
	        this.tBody = tBody;
	        console.log(tHead);
	        console.log(tBody);
	        var thead = this.renderTableHeadings(), tbody = this.renderTableList();
	        this.tableEl =
	            "<table>\n            <thead>\n                <tr>\n                    " + thead + "\n                </tr>\n            </thead>\n            <tbody>\n                " + tbody + "\n            </tbody>\n         </table>";
	    }
	    Table.prototype.renderTableHeadings = function () {
	        var tableHead = "";
	        var list = this.tHead;
	        console.log(this.tHead);
	        for (var i = 0; i < list.length; i++) {
	            tableHead +=
	                "<th>\n                    " + list[i] + "\n                </th>";
	        }
	        return tableHead;
	    };
	    Table.prototype.renderTableList = function () {
	        var tableList = "", tBody = this.tBody;
	        for (var i = 0; i < tBody.length; i++) {
	            var row = this.renderRow(tBody[i]);
	            tableList +=
	                "<tr>\n                    " + row + "\n                </tr>";
	        }
	        return tableList;
	    };
	    Table.prototype.renderRow = function (data) {
	        var row = "";
	        for (var key in data) {
	            if (data.hasOwnProperty(key)) {
	                row += "<td>" + data[key] + "</td>";
	            }
	        }
	        return row;
	    };
	    Table.prototype.getEl = function () {
	        return this.tableEl;
	    };
	    return Table;
	}());
	exports.__esModule = true;
	exports["default"] = Table;


/***/ },
/* 5 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjFlMWE3MDBiNTM0OTgzNGU5MWQiLCJ3ZWJwYWNrOi8vL3NyYy9hcHAudHMiLCJ3ZWJwYWNrOi8vL3NyYy9zZXJ2aWNlcy93ZWF0aGVyU2VydmljZS50cyIsIndlYnBhY2s6Ly8vc3JjL3NlcnZpY2VzL2h0dHBTZXJ2aWNlLnRzIiwid2VicGFjazovLy9zcmMvc2VydmljZXMvZXZlbnRTZXJ2aWNlLnRzIiwid2VicGFjazovLy9zcmMvY29tcG9uZW50cy90YWJsZS90YWJsZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGVzL2Jhc2Uuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUN0Q0EsNENBQTJCLENBQTJCLENBQUM7QUFDdkQsMENBQXlCLENBQXlCLENBQUM7QUFHbkQsbUNBQWtCLENBQTBCLENBQUM7QUFDN0MscUJBQU8sQ0FBb0IsQ0FBQztBQUc1QixHQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztLQUN4QixTQUFTLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLFVBQVMsUUFBUTtTQUN0RCwyQkFBYyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7Y0FDOUIsSUFBSSxDQUNELGtCQUFRO2FBQ0osSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQW1CLENBQUM7YUFFdkQsNkVBQTZFO2FBQzdFLElBQUksV0FBVyxHQUFHLDJCQUFjLENBQUMsd0JBQXdCLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDckUsSUFBSSxXQUFXLEdBQUcsMkJB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Ozs7Ozs7QUM5RHJCLDBDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGYxZTFhNzAwYjUzNDk4MzRlOTFkIiwiaW1wb3J0IFdlYXRoZXJTZXJ2aWNlIGZyb20gJy4vc2VydmljZXMvd2VhdGhlclNlcnZpY2UnO1xyXG5pbXBvcnQgRXZlbnRTZXJ2aWNlIGZyb20gJy4vc2VydmljZXMvZXZlbnRTZXJ2aWNlJztcclxuXHJcbmltcG9ydCBBbGxXZWF0aGVyRGF0YSBmcm9tICcuL2NvbXBvbmVudHMvd2VhdGhlclRhYmxlL2FsbFdlYXRoZXJEYXRhSW50ZXJmYWNlJztcclxuaW1wb3J0IFRhYmxlIGZyb20gJy4vY29tcG9uZW50cy90YWJsZS90YWJsZSc7XHJcbmltcG9ydCBcIi4vc3R5bGVzL2Jhc2Uuc2Nzc1wiO1xyXG5cclxuXHJcbmlmIChuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHtcclxuICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24ocG9zaXRpb24pe1xyXG4gICAgICAgIFdlYXRoZXJTZXJ2aWNlLmdldFdlYXRoZXIocG9zaXRpb24pXHJcbiAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0YWJsZURhdGEgPSBKU09OLnBhcnNlKHJlc3BvbnNlKSBhcyBBbGxXZWF0aGVyRGF0YTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9sZXQgd2VhdGhlclRhYmxlID0gbmV3IFRhYmxlKFdlYXRoZXJTZXJ2aWNlLnByZXBhcmVXZWF0aGVyRGF0YSh0YWJsZURhdGEpKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgd2VhdGhlckhlYWQgPSBXZWF0aGVyU2VydmljZS5wcmVwYXJlV2VhdGhlckhlYWRlckRhdGEodGFibGVEYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgd2VhdGhlckJvZHkgPSBXZWF0aGVyU2VydmljZS5wcmVwYXJlV2VhdGhlckJvZHlEYXRhKHRhYmxlRGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHdlYXRoZXJUYWJsZSA9IG5ldyBUYWJsZSh3ZWF0aGVySGVhZCwgd2VhdGhlckJvZHkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290JykuaW5uZXJIVE1MID0gd2VhdGhlclRhYmxlLmdldEVsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHB1YlN1YiA9IG5ldyBFdmVudFNlcnZpY2UoKTtcclxuICAgICAgICAgICAgICAgICAgICBwdWJTdWIuc3Vic2NyaWJlKCdteUV2ZW50JywgZnVuY3Rpb24oYXJnKXthbGVydChcIm15RXZlbnQgd29ya2VkLiBBcmc6IFwiICsgYXJnKTt9KTtcclxuICAgICAgICAgICAgICAgICAgICBwdWJTdWIucHVibGlzaCgnbXlFdmVudCcsICdpdCBteUFyZycpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yID0+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290JykuaW5uZXJIVE1MID0gYFJlamVjdGVkOiAke2Vycm9yfWBcclxuICAgICAgICAgICAgKTtcclxuICAgIH0pO1xyXG59IGVsc2Uge1xyXG4gICAgY29uc29sZS5sb2coXCJHZW9sb2NhdGlvbiBpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoaXMgYnJvd3Nlci5cIik7XHJcbn1cclxuXHJcblxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpLmlubmVySFRNTCA9IGBMb2FkaW5nYDtcclxuXHJcblxyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9hcHAudHMiLCJpbXBvcnQgSHR0cFNlcnZpY2UgZnJvbSAnLi9odHRwU2VydmljZSc7XHJcblxyXG5jbGFzcyBXZWF0aGVyU2VydmljZSB7XHJcbiAgICBzdGF0aWMgZ2V0V2VhdGhlcihwb3NpdGlvbil7XHJcbiAgICAgICAgLy9sZXQgdXJsID0gJ2h0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L2ZpbmQ/bGF0PTUzLjkmbG9uPTI3LjU2NjcmY250PTUwJkFQUElEPTM4MDE0MTQzNTVhNjUyMzkzZmM1MTNlMmNlZWYyMTU2JztcclxuICAgICAgICAvL2xldCB1cmwgPSAnaHR0cDovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvZmluZD9sYXQ9Jytwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUrJyZsb249JysgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSArJyZjbnQ9NTAmQVBQSUQ9MzgwMTQxNDM1NWE2NTIzOTNmYzUxM2UyY2VlZjIxNTYnO1xyXG4gICAgICAgIGxldCBmYWtlVXJsID0gJ3Rlc3QuanNvbic7XHJcbiAgICAgICAgcmV0dXJuIEh0dHBTZXJ2aWNlLmh0dHBHZXQoZmFrZVVybCk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcHJlcGFyZVdlYXRoZXJCb2R5RGF0YSh0YWJsZURhdGEpOkFycmF5PEFycmF5PHN0cmluZz4+e1xyXG4gICAgICAgIGxldCBwYXJzZWRCb2R5RGF0YSA9IHRhYmxlRGF0YS5saXN0Lm1hcChmdW5jdGlvbihjdXJyZW50VmFsdWUsIGluZGV4Om51bWJlcik6QXJyYXk8c3RyaW5nPntcclxuICAgICAgICAgICAgbGV0IHJvd0RhdGE6QXJyYXk8c3RyaW5nPiA9IFtdO1xyXG4gICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICBsZXQgaW5kZXhTdHJpbmc6c3RyaW5nID0gU3RyaW5nKGluZGV4KTtcclxuICAgICAgICAgICAgcm93RGF0YS5wdXNoKGluZGV4U3RyaW5nLGN1cnJlbnRWYWx1ZS5uYW1lKTtcclxuICAgICAgICAgICAgbGV0IG1haW4gPSBjdXJyZW50VmFsdWUubWFpbjtcclxuICAgICAgICAgICAgZm9yIChsZXQga2V5IGluICBtYWluKXtcclxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZVBhcmFtOnN0cmluZyA9IFN0cmluZyhtYWluW2tleV0pO1xyXG4gICAgICAgICAgICAgICAgcm93RGF0YS5wdXNoKHZhbHVlUGFyYW0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJvd0RhdGE7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBwYXJzZWRCb2R5RGF0YVxyXG4gICAgfVxyXG4gICAgc3RhdGljIHByZXBhcmVXZWF0aGVySGVhZGVyRGF0YSh0YWJsZURhdGEpOkFycmF5PHN0cmluZz57XHJcbiAgICAgICAgbGV0IHBhcnNlZEhlYWRlckRhdGE6IEFycmF5PHN0cmluZz4gPSBbJyMnLCdDaXR5IE5hbWUnXTtcclxuICAgICAgICBsZXQgbWFpbiA9IHRhYmxlRGF0YS5saXN0WzBdLm1haW47XHJcbiAgICAgICAgZm9yIChsZXQga2V5IGluICBtYWluKXtcclxuICAgICAgICAgICAgcGFyc2VkSGVhZGVyRGF0YS5wdXNoKGtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwYXJzZWRIZWFkZXJEYXRhXHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBXZWF0aGVyU2VydmljZTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL3NlcnZpY2VzL3dlYXRoZXJTZXJ2aWNlLnRzIiwiY2xhc3MgSHR0cFNlcnZpY2Uge1xyXG4gICAgc3RhdGljIGh0dHBHZXQodXJsOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8c3RyaW5nPihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0gbmV3IEVycm9yKHRoaXMuc3RhdHVzVGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKFwiTmV0d29yayBFcnJvclwiKSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB4aHIuc2VuZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBIdHRwU2VydmljZTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL3NlcnZpY2VzL2h0dHBTZXJ2aWNlLnRzIiwiY2xhc3MgRXZlbnRTZXJ2aWNlIHtcclxuICAgIGhhbmRsZXJzOiB7fTtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycyA9IHt9O1xyXG4gICAgfVxyXG4gICAgc3Vic2NyaWJlKGV2ZW50OnN0cmluZywgaGFuZGxlcjpGdW5jdGlvbil7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFuZGxlcnNbZXZlbnRdID09PSB1bmRlZmluZWQpICB0aGlzLmhhbmRsZXJzW2V2ZW50XSA9IFtdO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnNbZXZlbnRdLnB1c2goaGFuZGxlcik7XHJcbiAgICB9XHJcbiAgICBwdWJsaXNoKGV2ZW50OnN0cmluZywgZGF0YTp7fSl7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFuZGxlcnNbZXZlbnRdID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgdmFyIGkgPSAwLFxyXG4gICAgICAgICAgICBsZW4gPSB0aGlzLmhhbmRsZXJzW2V2ZW50XS5sZW5ndGg7XHJcblxyXG4gICAgICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVyc1tldmVudF1baV0oYXJndW1lbnRzW2krMV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRXZlbnRTZXJ2aWNlO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvc2VydmljZXMvZXZlbnRTZXJ2aWNlLnRzIiwiY2xhc3MgVGFibGUge1xyXG4gICAgcHJpdmF0ZSB0SGVhZDogQXJyYXk8c3RyaW5nPjtcclxuICAgIHByaXZhdGUgdEJvZHk6IEFycmF5PEFycmF5PHN0cmluZz4+O1xyXG4gICAgcHJpdmF0ZSB0YWJsZUVsOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3Rvcih0SGVhZCwgdEJvZHkpe1xyXG4gICAgICAgIHRoaXMudEhlYWQgPSB0SGVhZDtcclxuICAgICAgICB0aGlzLnRCb2R5ID0gdEJvZHk7XHJcbiAgICAgICAgY29uc29sZS5sb2codEhlYWQpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRCb2R5KTtcclxuICAgICAgICBsZXQgdGhlYWQ6c3RyaW5nID0gdGhpcy5yZW5kZXJUYWJsZUhlYWRpbmdzKCksXHJcbiAgICAgICAgICAgIHRib2R5OnN0cmluZyA9IHRoaXMucmVuZGVyVGFibGVMaXN0KCk7XHJcblxyXG4gICAgICAgIHRoaXMudGFibGVFbCA9XHJcbiAgICAgICAgICAgIGA8dGFibGU+XHJcbiAgICAgICAgICAgIDx0aGVhZD5cclxuICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgICAke3RoZWFkfVxyXG4gICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgPC90aGVhZD5cclxuICAgICAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgICAgICAgJHt0Ym9keX1cclxuICAgICAgICAgICAgPC90Ym9keT5cclxuICAgICAgICAgPC90YWJsZT5gXHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJlbmRlclRhYmxlSGVhZGluZ3MoKTpzdHJpbmd7XHJcbiAgICAgICAgbGV0IHRhYmxlSGVhZDogc3RyaW5nID0gYGA7XHJcbiAgICAgICAgbGV0IGxpc3Q6QXJyYXk8c3RyaW5nPiA9IHRoaXMudEhlYWQ7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy50SGVhZCk7XHJcbiAgICAgICAgZm9yIChsZXQgaTpudW1iZXI9MDsgaTxsaXN0Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgdGFibGVIZWFkKz1cclxuICAgICAgICAgICAgICAgIGA8dGg+XHJcbiAgICAgICAgICAgICAgICAgICAgJHtsaXN0W2ldfVxyXG4gICAgICAgICAgICAgICAgPC90aD5gXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0YWJsZUhlYWQ7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJlbmRlclRhYmxlTGlzdCgpOnN0cmluZ3tcclxuICAgICAgICBsZXQgdGFibGVMaXN0OnN0cmluZyA9IGBgLFxyXG4gICAgICAgICAgICB0Qm9keSA9IHRoaXMudEJvZHk7XHJcbiAgICAgICAgZm9yIChsZXQgaTpudW1iZXI9MDsgaTx0Qm9keS5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGxldCByb3cgPSB0aGlzLnJlbmRlclJvdyh0Qm9keVtpXSk7XHJcbiAgICAgICAgICAgIHRhYmxlTGlzdCs9XHJcbiAgICAgICAgICAgICAgICBgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgICR7cm93fVxyXG4gICAgICAgICAgICAgICAgPC90cj5gXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0YWJsZUxpc3Q7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJlbmRlclJvdyhkYXRhOkFycmF5PHN0cmluZz4pOnN0cmluZyB7XHJcbiAgICAgICAgbGV0IHJvdzpzdHJpbmcgPSBgYDtcclxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICByb3cgKz0gYDx0ZD4ke2RhdGFba2V5XX08L3RkPmBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcm93O1xyXG4gICAgfVxyXG4gICAgZ2V0RWwoKTpzdHJpbmd7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGFibGVFbFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBUYWJsZTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2NvbXBvbmVudHMvdGFibGUvdGFibGUudHMiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3N0eWxlcy9iYXNlLnNjc3Ncbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==