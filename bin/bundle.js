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
	var pagination_1 = __webpack_require__(5);
	__webpack_require__(6);
	if (navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(function (position) {
	        weatherService_1["default"].getWeather(position)
	            .then(function (response) {
	            var weatherTable;
	            var tableData = JSON.parse(response);
	            var eventService = new eventService_1["default"]();
	            var weatherHead = weatherService_1["default"].prepareWeatherHeaderData(tableData);
	            var weatherBody = weatherService_1["default"].prepareWeatherBodyData(tableData);
	            var pagination = new pagination_1["default"](weatherBody, 10, eventService);
	            var splittedData = pagination.getData();
	            weatherTable = new table_1["default"](weatherHead, splittedData);
	            document.getElementById('root').innerHTML = "\n                        <div id='weather-table'></div>\n                        <div id='weather-pagination'></div>\n                    ";
	            document.getElementById('weather-table').innerHTML = weatherTable.getEl();
	            document.getElementById('weather-pagination').appendChild(pagination.generatePaginationEl());
	            eventService.subscribe('dataIsChanged', function (splittedData) {
	                weatherTable.render(splittedData);
	                document.getElementById('weather-table').innerHTML = weatherTable.getEl();
	            });
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
	        var url = 'http://api.openweathermap.org/data/2.5/find?lat=' + position.coords.latitude + '&lon=' + position.coords.longitude + '&cnt=50&APPID=3801414355a652393fc513e2ceef2156';
	        //let fakeUrl = 'test.json';
	        return httpService_1["default"].httpGet(url);
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
	        this.thead = this.renderTableHeadings();
	        this.render(this.tBody);
	    }
	    Table.prototype.render = function (tBody) {
	        var tbody = this.renderTableList(tBody);
	        this.tableEl =
	            "<table>\n            <thead>\n                <tr>\n                    " + this.thead + "\n                </tr>\n            </thead>\n            <tbody>\n                " + tbody + "\n            </tbody>\n         </table>";
	    };
	    Table.prototype.renderTableHeadings = function () {
	        var tableHead = "";
	        var list = this.tHead;
	        for (var i = 0; i < list.length; i++) {
	            tableHead +=
	                "<th>\n                    " + list[i] + "\n                </th>";
	        }
	        return tableHead;
	    };
	    Table.prototype.renderTableList = function (tBody) {
	        var tableList = "";
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

	"use strict";
	var Pagination = (function () {
	    function Pagination(data, n, eventService) {
	        this.data = data;
	        this.eventService = eventService;
	        this.n = n;
	        this.parts = Math.ceil(this.data.length / n);
	        this.selectedPart = 0;
	        this.splettedData = this.splitData();
	        this.generatePaginationEl();
	    }
	    Pagination.prototype.generatePaginationEl = function () {
	        this.paginationEl = document.createElement('ul');
	        var paginationEl = this.paginationEl;
	        paginationEl.className = 'pagination';
	        paginationEl.addEventListener('click', this.changePage.bind(this));
	        var numbersView = "";
	        for (var i = 0; i < this.parts; i++) {
	            if (!i) {
	                numbersView = numbersView + ("<li class='active'><a class='pagination-number' href=\"#\">" + (i + 1) + "</a></li>");
	            }
	            else {
	                numbersView = numbersView + ("<li><a class='pagination-number' href=\"#\">" + (i + 1) + "</a></li>");
	            }
	        }
	        var paginationView = "\n             <li>\n                <a class='pagination-prew' href=\"#\">\u00AB</a>\n             </li>\n             " + numbersView + "\n             <li>\n                <a class='pagination-next' href=\"#\">\u00BB</a>\n             </li>\n             ";
	        paginationEl.innerHTML = paginationView;
	        return paginationEl;
	    };
	    Pagination.prototype.changePage = function (e) {
	        var target = e.target;
	        var className = target.className;
	        var parentNode = target.parentNode;
	        var list = this.paginationEl.children;
	        for (var i = 0; i < list.length; i++) {
	            list[i].className = '';
	        }
	        if (className === 'pagination-number') {
	            this.selectedPart = +target.innerText - 1;
	            parentNode.className = 'active';
	        }
	        else if (className === 'pagination-prew') {
	            this.selectedPart = (--this.selectedPart) < 0 ? 0 : this.selectedPart;
	            list[this.selectedPart + 1].className = 'active';
	        }
	        else if (className === 'pagination-next') {
	            this.selectedPart = (++this.selectedPart) === this.parts ? this.parts - 1 : this.selectedPart;
	            list[this.selectedPart + 1].className = 'active';
	        }
	        this.eventService.publish('dataIsChanged', this.getData());
	    };
	    Pagination.prototype.getData = function () {
	        return this.splettedData[this.selectedPart];
	    };
	    Pagination.prototype.splitData = function () {
	        var n = this.n;
	        var splitedArr = [];
	        for (var i = 0; i < this.parts; i++) {
	            splitedArr.push([]);
	        }
	        this.data.forEach(function (value, index) {
	            var part = Math.floor(index / n);
	            splitedArr[part].push(value);
	        });
	        return splitedArr;
	    };
	    return Pagination;
	}());
	exports.__esModule = true;
	exports["default"] = Pagination;


/***/ },
/* 6 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDE0YTI2MGZiMTRmOGQ3MzUxOWEiLCJ3ZWJwYWNrOi8vL3NyYy9hcHAudHMiLCJ3ZWJwYWNrOi8vL3NyYy9zZXJ2aWNlcy93ZWF0aGVyU2VydmljZS50cyIsIndlYnBhY2s6Ly8vc3JjL3NlcnZpY2VzL2h0dHBTZXJ2aWNlLnRzIiwid2VicGFjazovLy9zcmMvc2VydmljZXMvZXZlbnRTZXJ2aWNlLnRzIiwid2VicGFjazovLy9zcmMvY29tcG9uZW50cy90YWJsZS90YWJsZS50cyIsIndlYnBhY2s6Ly8vc3JjL2NvbXBvbmVudHMvcGFnaW5hdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGVzL2Jhc2Uuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUN0Q0EsNENBQTJCLENBQTJCLENBQUM7QUFDdkQsMENBQXlCLENBQXlCLENBQUM7QUFHbkQsbUNBQWtCLENBQTBCLENBQUM7QUFDN0Msd0NBQXVCLENBQXlCLENBQUM7QUFDakQscUJBQU8sQ0FBb0IsQ0FBQztBQUc1QixHQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztLQUN4QixTQUFTLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsUUFBUTtTQUN2RCwyQkFBYyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7Y0FDOUIsSUFBSSxDQUNELGtCQUFRO2FBQ0osSUFBSSxZQUFZLENBQUM7YUFDakIsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQW1CLENBQUM7YUFDdkQsSUFB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S0FFTyw4QkFBUyxHQUFqQjtTQUNJLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDZixJQUFJLFVBQVUsR0FBK0IsRUFBRSxDQUFDO1NBRWhELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFVLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2FBQ3pDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1NBQ3ZCLENBQUM7U0FDRCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEtBQUssRUFBRSxLQUFLO2FBQ3BDLElBQUksSUFBSSxHQUFVLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ3hDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDakMsQ0FBQyxDQUFDLENBQUM7U0FDSCxNQUFNLENBQUMsVUFBVSxDQUFDO0tBQ3RCLENBQUM7S0FDTCxpQkFBQztBQUFELEVBQUM7QUFFRDtzQkFBZSxVQUFVLENBQUM7Ozs7Ozs7QUN4RjFCLDBDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDQxNGEyNjBmYjE0ZjhkNzM1MTlhIiwiaW1wb3J0IFdlYXRoZXJTZXJ2aWNlIGZyb20gJy4vc2VydmljZXMvd2VhdGhlclNlcnZpY2UnO1xyXG5pbXBvcnQgRXZlbnRTZXJ2aWNlIGZyb20gJy4vc2VydmljZXMvZXZlbnRTZXJ2aWNlJztcclxuXHJcbmltcG9ydCBBbGxXZWF0aGVyRGF0YSBmcm9tICcuL2NvbXBvbmVudHMvd2VhdGhlckRhdGEvYWxsV2VhdGhlckRhdGFJbnRlcmZhY2UnO1xyXG5pbXBvcnQgVGFibGUgZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlL3RhYmxlJztcclxuaW1wb3J0IFBhZ2luYXRpb24gZnJvbSAnLi9jb21wb25lbnRzL3BhZ2luYXRpb24nO1xyXG5pbXBvcnQgXCIuL3N0eWxlcy9iYXNlLnNjc3NcIjtcclxuXHJcblxyXG5pZiAobmF2aWdhdG9yLmdlb2xvY2F0aW9uKSB7XHJcbiAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uIChwb3NpdGlvbikge1xyXG4gICAgICAgIFdlYXRoZXJTZXJ2aWNlLmdldFdlYXRoZXIocG9zaXRpb24pXHJcbiAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB3ZWF0aGVyVGFibGU7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRhYmxlRGF0YSA9IEpTT04ucGFyc2UocmVzcG9uc2UpIGFzIEFsbFdlYXRoZXJEYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBldmVudFNlcnZpY2UgPSBuZXcgRXZlbnRTZXJ2aWNlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCB3ZWF0aGVySGVhZCA9IFdlYXRoZXJTZXJ2aWNlLnByZXBhcmVXZWF0aGVySGVhZGVyRGF0YSh0YWJsZURhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB3ZWF0aGVyQm9keSA9IFdlYXRoZXJTZXJ2aWNlLnByZXBhcmVXZWF0aGVyQm9keURhdGEodGFibGVEYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcGFnaW5hdGlvbiA9IG5ldyBQYWdpbmF0aW9uKHdlYXRoZXJCb2R5LCAxMCwgZXZlbnRTZXJ2aWNlKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc3BsaXR0ZWREYXRhID0gcGFnaW5hdGlvbi5nZXREYXRhKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgd2VhdGhlclRhYmxlID0gbmV3IFRhYmxlKHdlYXRoZXJIZWFkLCBzcGxpdHRlZERhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpLmlubmVySFRNTCA9IGBcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD0nd2VhdGhlci10YWJsZSc+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9J3dlYXRoZXItcGFnaW5hdGlvbic+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgYDtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2VhdGhlci10YWJsZScpLmlubmVySFRNTCA9IHdlYXRoZXJUYWJsZS5nZXRFbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3ZWF0aGVyLXBhZ2luYXRpb24nKS5hcHBlbmRDaGlsZChwYWdpbmF0aW9uLmdlbmVyYXRlUGFnaW5hdGlvbkVsKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBldmVudFNlcnZpY2Uuc3Vic2NyaWJlKCdkYXRhSXNDaGFuZ2VkJywgZnVuY3Rpb24gKHNwbGl0dGVkRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWF0aGVyVGFibGUucmVuZGVyKHNwbGl0dGVkRGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3ZWF0aGVyLXRhYmxlJykuaW5uZXJIVE1MID0gd2VhdGhlclRhYmxlLmdldEVsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3IgPT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKS5pbm5lckhUTUwgPSBgUmVqZWN0ZWQ6ICR7ZXJyb3J9YFxyXG4gICAgICAgICAgICApO1xyXG4gICAgfSk7XHJcbn0gZWxzZSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIkdlb2xvY2F0aW9uIGlzIG5vdCBzdXBwb3J0ZWQgYnkgdGhpcyBicm93c2VyLlwiKTtcclxufVxyXG5cclxuXHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290JykuaW5uZXJIVE1MID0gYExvYWRpbmdgO1xyXG5cclxuXHJcblxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2FwcC50cyIsImltcG9ydCBIdHRwU2VydmljZSBmcm9tICcuL2h0dHBTZXJ2aWNlJztcclxuXHJcbmNsYXNzIFdlYXRoZXJTZXJ2aWNlIHtcclxuICAgIHN0YXRpYyBnZXRXZWF0aGVyKHBvc2l0aW9uKSB7XHJcbiAgICAgICAgLy9sZXQgdXJsID0gJ2h0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L2ZpbmQ/bGF0PTUzLjkmbG9uPTI3LjU2NjcmY250PTUwJkFQUElEPTM4MDE0MTQzNTVhNjUyMzkzZmM1MTNlMmNlZWYyMTU2JztcclxuICAgICAgICBsZXQgdXJsID0gJ2h0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L2ZpbmQ/bGF0PScrcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlKycmbG9uPScrIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUgKycmY250PTUwJkFQUElEPTM4MDE0MTQzNTVhNjUyMzkzZmM1MTNlMmNlZWYyMTU2JztcclxuICAgICAgICAvL2xldCBmYWtlVXJsID0gJ3Rlc3QuanNvbic7XHJcbiAgICAgICAgcmV0dXJuIEh0dHBTZXJ2aWNlLmh0dHBHZXQodXJsKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcHJlcGFyZVdlYXRoZXJCb2R5RGF0YSh0YWJsZURhdGEpOkFycmF5PEFycmF5PHN0cmluZz4+IHtcclxuICAgICAgICBsZXQgcGFyc2VkQm9keURhdGEgPSB0YWJsZURhdGEubGlzdC5tYXAoZnVuY3Rpb24gKGN1cnJlbnRWYWx1ZSwgaW5kZXg6bnVtYmVyKTpBcnJheTxzdHJpbmc+IHtcclxuICAgICAgICAgICAgbGV0IHJvd0RhdGE6QXJyYXk8c3RyaW5nPiA9IFtdO1xyXG4gICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICBsZXQgaW5kZXhTdHJpbmc6c3RyaW5nID0gU3RyaW5nKGluZGV4KTtcclxuICAgICAgICAgICAgcm93RGF0YS5wdXNoKGluZGV4U3RyaW5nLCBjdXJyZW50VmFsdWUubmFtZSk7XHJcbiAgICAgICAgICAgIGxldCBtYWluID0gY3VycmVudFZhbHVlLm1haW47XHJcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiAgbWFpbikge1xyXG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlUGFyYW06c3RyaW5nID0gU3RyaW5nKG1haW5ba2V5XSk7XHJcbiAgICAgICAgICAgICAgICByb3dEYXRhLnB1c2godmFsdWVQYXJhbSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcm93RGF0YTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHBhcnNlZEJvZHlEYXRhXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHByZXBhcmVXZWF0aGVySGVhZGVyRGF0YSh0YWJsZURhdGEpOkFycmF5PHN0cmluZz4ge1xyXG4gICAgICAgIGxldCBwYXJzZWRIZWFkZXJEYXRhOkFycmF5PHN0cmluZz4gPSBbJyMnLCAnQ2l0eSBOYW1lJ107XHJcbiAgICAgICAgbGV0IG1haW4gPSB0YWJsZURhdGEubGlzdFswXS5tYWluO1xyXG4gICAgICAgIGZvciAobGV0IGtleSBpbiAgbWFpbikge1xyXG4gICAgICAgICAgICBwYXJzZWRIZWFkZXJEYXRhLnB1c2goa2V5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlZEhlYWRlckRhdGFcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFdlYXRoZXJTZXJ2aWNlO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvc2VydmljZXMvd2VhdGhlclNlcnZpY2UudHMiLCJjbGFzcyBIdHRwU2VydmljZSB7XHJcbiAgICBzdGF0aWMgaHR0cEdldCh1cmw6c3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHN0cmluZz4oZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB4aHIub3BlbignR0VUJywgdXJsLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0gbmV3IEVycm9yKHRoaXMuc3RhdHVzVGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihcIk5ldHdvcmsgRXJyb3JcIikpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgeGhyLnNlbmQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgSHR0cFNlcnZpY2U7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9zZXJ2aWNlcy9odHRwU2VydmljZS50cyIsImNsYXNzIEV2ZW50U2VydmljZSB7XHJcbiAgICBoYW5kbGVyczp7fTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgc3Vic2NyaWJlKGV2ZW50OnN0cmluZywgaGFuZGxlcjpGdW5jdGlvbikge1xyXG4gICAgICAgIGlmICh0aGlzLmhhbmRsZXJzW2V2ZW50XSA9PT0gdW5kZWZpbmVkKSAgdGhpcy5oYW5kbGVyc1tldmVudF0gPSBbXTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzW2V2ZW50XS5wdXNoKGhhbmRsZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1Ymxpc2goZXZlbnQ6c3RyaW5nLCBkYXRhOnt9KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFuZGxlcnNbZXZlbnRdID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgdmFyIGkgPSAwLFxyXG4gICAgICAgICAgICBsZW4gPSB0aGlzLmhhbmRsZXJzW2V2ZW50XS5sZW5ndGg7XHJcblxyXG4gICAgICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlcnNbZXZlbnRdW2ldKGFyZ3VtZW50c1tpICsgMV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRXZlbnRTZXJ2aWNlO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvc2VydmljZXMvZXZlbnRTZXJ2aWNlLnRzIiwiY2xhc3MgVGFibGUge1xyXG4gICAgcHJpdmF0ZSB0SGVhZDpBcnJheTxzdHJpbmc+O1xyXG4gICAgcHJpdmF0ZSB0Qm9keTpBcnJheTxBcnJheTxzdHJpbmc+PjtcclxuICAgIHByaXZhdGUgdGFibGVFbDpzdHJpbmc7XHJcbiAgICBwcml2YXRlIHRoZWFkOnN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0SGVhZCwgdEJvZHkpIHtcclxuICAgICAgICB0aGlzLnRIZWFkID0gdEhlYWQ7XHJcbiAgICAgICAgdGhpcy50Qm9keSA9IHRCb2R5O1xyXG4gICAgICAgIHRoaXMudGhlYWQgPSB0aGlzLnJlbmRlclRhYmxlSGVhZGluZ3MoKTtcclxuICAgICAgICB0aGlzLnJlbmRlcih0aGlzLnRCb2R5KTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIodEJvZHkpIHtcclxuICAgICAgICBsZXQgdGJvZHk6c3RyaW5nID0gdGhpcy5yZW5kZXJUYWJsZUxpc3QodEJvZHkpO1xyXG4gICAgICAgIHRoaXMudGFibGVFbCA9XHJcbiAgICAgICAgICAgIGA8dGFibGU+XHJcbiAgICAgICAgICAgIDx0aGVhZD5cclxuICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgICAke3RoaXMudGhlYWR9XHJcbiAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICA8L3RoZWFkPlxyXG4gICAgICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAgICAgICAke3Rib2R5fVxyXG4gICAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgICA8L3RhYmxlPmBcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbmRlclRhYmxlSGVhZGluZ3MoKTpzdHJpbmcge1xyXG4gICAgICAgIGxldCB0YWJsZUhlYWQ6c3RyaW5nID0gYGA7XHJcbiAgICAgICAgbGV0IGxpc3Q6QXJyYXk8c3RyaW5nPiA9IHRoaXMudEhlYWQ7XHJcbiAgICAgICAgZm9yIChsZXQgaTpudW1iZXIgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0YWJsZUhlYWQgKz1cclxuICAgICAgICAgICAgICAgIGA8dGg+XHJcbiAgICAgICAgICAgICAgICAgICAgJHtsaXN0W2ldfVxyXG4gICAgICAgICAgICAgICAgPC90aD5gXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0YWJsZUhlYWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW5kZXJUYWJsZUxpc3QodEJvZHkpOnN0cmluZyB7XHJcbiAgICAgICAgbGV0IHRhYmxlTGlzdDpzdHJpbmcgPSBgYDtcclxuICAgICAgICBmb3IgKGxldCBpOm51bWJlciA9IDA7IGkgPCB0Qm9keS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgcm93ID0gdGhpcy5yZW5kZXJSb3codEJvZHlbaV0pO1xyXG4gICAgICAgICAgICB0YWJsZUxpc3QgKz1cclxuICAgICAgICAgICAgICAgIGA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgJHtyb3d9XHJcbiAgICAgICAgICAgICAgICA8L3RyPmBcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRhYmxlTGlzdDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbmRlclJvdyhkYXRhOkFycmF5PHN0cmluZz4pOnN0cmluZyB7XHJcbiAgICAgICAgbGV0IHJvdzpzdHJpbmcgPSBgYDtcclxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICByb3cgKz0gYDx0ZD4ke2RhdGFba2V5XX08L3RkPmBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcm93O1xyXG4gICAgfVxyXG5cclxuICAgIGdldEVsKCk6c3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50YWJsZUVsXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFRhYmxlO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvY29tcG9uZW50cy90YWJsZS90YWJsZS50cyIsImltcG9ydCBFdmVudFNlcnZpY2UgZnJvbSAnLi4vc2VydmljZXMvZXZlbnRTZXJ2aWNlJ1xyXG5cclxuY2xhc3MgUGFnaW5hdGlvbiB7XHJcbiAgICBwcml2YXRlIGRhdGE6QXJyYXk8QXJyYXk8c3RyaW5nPj47XHJcbiAgICBwcml2YXRlIGV2ZW50U2VydmljZTpFdmVudFNlcnZpY2U7XHJcbiAgICBwcml2YXRlIG46bnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBwYXJ0czpudW1iZXI7XHJcbiAgICBwcml2YXRlIHNlbGVjdGVkUGFydDpudW1iZXI7XHJcbiAgICBwcml2YXRlIHBhZ2luYXRpb25FbDpIVE1MVUxpc3RFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBzcGxldHRlZERhdGE6QXJyYXk8QXJyYXk8QXJyYXk8c3RyaW5nPj4+O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRhdGE6QXJyYXk8QXJyYXk8c3RyaW5nPj4sIG46bnVtYmVyLCBldmVudFNlcnZpY2U6RXZlbnRTZXJ2aWNlKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgICAgICB0aGlzLmV2ZW50U2VydmljZSA9IGV2ZW50U2VydmljZTtcclxuICAgICAgICB0aGlzLm4gPSBuO1xyXG4gICAgICAgIHRoaXMucGFydHMgPSBNYXRoLmNlaWwodGhpcy5kYXRhLmxlbmd0aCAvIG4pO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRQYXJ0ID0gMDtcclxuICAgICAgICB0aGlzLnNwbGV0dGVkRGF0YSA9IHRoaXMuc3BsaXREYXRhKCk7XHJcbiAgICAgICAgdGhpcy5nZW5lcmF0ZVBhZ2luYXRpb25FbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdlbmVyYXRlUGFnaW5hdGlvbkVsKCkge1xyXG4gICAgICAgIHRoaXMucGFnaW5hdGlvbkVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcclxuICAgICAgICBsZXQgcGFnaW5hdGlvbkVsID0gdGhpcy5wYWdpbmF0aW9uRWw7XHJcbiAgICAgICAgcGFnaW5hdGlvbkVsLmNsYXNzTmFtZSA9ICdwYWdpbmF0aW9uJztcclxuICAgICAgICBwYWdpbmF0aW9uRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNoYW5nZVBhZ2UuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgbGV0IG51bWJlcnNWaWV3OnN0cmluZyA9IGBgO1xyXG4gICAgICAgIGZvciAobGV0IGk6bnVtYmVyID0gMDsgaSA8IHRoaXMucGFydHM7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoIWkpIHtcclxuICAgICAgICAgICAgICAgIG51bWJlcnNWaWV3ID0gbnVtYmVyc1ZpZXcgKyBgPGxpIGNsYXNzPSdhY3RpdmUnPjxhIGNsYXNzPSdwYWdpbmF0aW9uLW51bWJlcicgaHJlZj1cIiNcIj4ke2kgKyAxfTwvYT48L2xpPmBcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG51bWJlcnNWaWV3ID0gbnVtYmVyc1ZpZXcgKyBgPGxpPjxhIGNsYXNzPSdwYWdpbmF0aW9uLW51bWJlcicgaHJlZj1cIiNcIj4ke2kgKyAxfTwvYT48L2xpPmBcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHBhZ2luYXRpb25WaWV3ID0gYFxyXG4gICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgPGEgY2xhc3M9J3BhZ2luYXRpb24tcHJldycgaHJlZj1cIiNcIj7CqzwvYT5cclxuICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAke251bWJlcnNWaWV3fVxyXG4gICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgPGEgY2xhc3M9J3BhZ2luYXRpb24tbmV4dCcgaHJlZj1cIiNcIj7CuzwvYT5cclxuICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICBgO1xyXG4gICAgICAgIHBhZ2luYXRpb25FbC5pbm5lckhUTUwgPSBwYWdpbmF0aW9uVmlldztcclxuICAgICAgICByZXR1cm4gcGFnaW5hdGlvbkVsO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2hhbmdlUGFnZShlKSB7XHJcbiAgICAgICAgbGV0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICAgIGxldCBjbGFzc05hbWUgPSB0YXJnZXQuY2xhc3NOYW1lO1xyXG4gICAgICAgIGxldCBwYXJlbnROb2RlID0gdGFyZ2V0LnBhcmVudE5vZGUgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgbGV0IGxpc3QgPSB0aGlzLnBhZ2luYXRpb25FbC5jaGlsZHJlbjtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGlzdFtpXS5jbGFzc05hbWUgPSAnJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNsYXNzTmFtZSA9PT0gJ3BhZ2luYXRpb24tbnVtYmVyJykge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkUGFydCA9ICt0YXJnZXQuaW5uZXJUZXh0IC0gMTtcclxuICAgICAgICAgICAgcGFyZW50Tm9kZS5jbGFzc05hbWUgPSAnYWN0aXZlJ1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY2xhc3NOYW1lID09PSAncGFnaW5hdGlvbi1wcmV3Jykge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkUGFydCA9ICgtLXRoaXMuc2VsZWN0ZWRQYXJ0KSA8IDAgPyAwIDogdGhpcy5zZWxlY3RlZFBhcnQ7XHJcbiAgICAgICAgICAgIGxpc3RbdGhpcy5zZWxlY3RlZFBhcnQgKyAxXS5jbGFzc05hbWUgPSAnYWN0aXZlJ1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY2xhc3NOYW1lID09PSAncGFnaW5hdGlvbi1uZXh0Jykge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkUGFydCA9ICgrK3RoaXMuc2VsZWN0ZWRQYXJ0KSA9PT0gdGhpcy5wYXJ0cyA/IHRoaXMucGFydHMgLSAxIDogdGhpcy5zZWxlY3RlZFBhcnQ7XHJcbiAgICAgICAgICAgIGxpc3RbdGhpcy5zZWxlY3RlZFBhcnQgKyAxXS5jbGFzc05hbWUgPSAnYWN0aXZlJ1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmV2ZW50U2VydmljZS5wdWJsaXNoKCdkYXRhSXNDaGFuZ2VkJywgdGhpcy5nZXREYXRhKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERhdGEoKTpBcnJheTxBcnJheTxzdHJpbmc+PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3BsZXR0ZWREYXRhW3RoaXMuc2VsZWN0ZWRQYXJ0XTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNwbGl0RGF0YSgpOkFycmF5PEFycmF5PEFycmF5PHN0cmluZz4+PiB7XHJcbiAgICAgICAgbGV0IG4gPSB0aGlzLm47XHJcbiAgICAgICAgbGV0IHNwbGl0ZWRBcnI6QXJyYXk8QXJyYXk8QXJyYXk8c3RyaW5nPj4+ID0gW107XHJcblxyXG4gICAgICAgIGZvciAobGV0IGk6bnVtYmVyID0gMDsgaSA8IHRoaXMucGFydHM7IGkrKykge1xyXG4gICAgICAgICAgICBzcGxpdGVkQXJyLnB1c2goW10pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZGF0YS5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgbGV0IHBhcnQ6bnVtYmVyID0gTWF0aC5mbG9vcihpbmRleCAvIG4pO1xyXG4gICAgICAgICAgICBzcGxpdGVkQXJyW3BhcnRdLnB1c2godmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBzcGxpdGVkQXJyO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQYWdpbmF0aW9uO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvY29tcG9uZW50cy9wYWdpbmF0aW9uLnRzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zdHlsZXMvYmFzZS5zY3NzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=