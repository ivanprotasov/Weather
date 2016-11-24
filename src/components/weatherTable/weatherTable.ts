import AllWeatherData from './allWeatherDataInterface'
import MainWeatherData from './mainWeatherDataInterface'

class WeatherTable {
    data: AllWeatherData;
    tableEl: string;
    constructor(data:AllWeatherData){
        this.data = data;
        let thead:string = this.renderTableHeadings(),
            tbody:string = this.renderTableList();

        this.tableEl =
            `<table>
            <thead>
                <tr>
                    ${thead}
                </tr>
            </thead>
            <tbody>
                ${tbody}
            </tbody>
         </table>`
    }

    private renderTableHeadings():string{
        let tableHead: string =
                `<th>#</th>
             <th>City Name</th>`,
            list = this.data.list[0].main;
        for (let key in list) {
            if (list.hasOwnProperty(key)) {
                tableHead += `<th>${key}</th>`
            }
        }

        return tableHead;
    }

    private renderTableList():string{
        let tableList:string = ``,
            data = this.data;
        for (let i:number=0; i<data.list.length; i++){
            let row = this.renderMainData(data.list[i].main);
            tableList+=
                `<tr>
                    <td>${i+1}</td>
                    <td>${data.list[i].name}</td>
                    ${row}
                </tr>`
        }
        return tableList;
    }

    private renderMainData(data:MainWeatherData):string {
        let row:string = ``;
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                row += `<td>${data[key]}</td>`
            }
        }
        return row;
    }

    getDataValue():AllWeatherData{
        return this.data;
    }

    getEl():string{
        return this.tableEl
    }
}

export default WeatherTable;