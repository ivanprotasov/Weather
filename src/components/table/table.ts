class Table {
    private tHead:Array<string>;
    private tBody:Array<Array<string>>;
    private tableEl:string;
    private thead:string;

    constructor(tHead, tBody) {
        this.tHead = tHead;
        this.tBody = tBody;
        this.thead = this.renderTableHeadings();
        this.render(this.tBody);
    }

    render(tBody) {
        let tbody:string = this.renderTableList(tBody);
        this.tableEl =
            `<table>
            <thead>
                <tr>
                    ${this.thead}
                </tr>
            </thead>
            <tbody>
                ${tbody}
            </tbody>
         </table>`
    }

    private renderTableHeadings():string {
        let tableHead:string = ``;
        let list:Array<string> = this.tHead;
        for (let i:number = 0; i < list.length; i++) {
            tableHead +=
                `<th>
                    ${list[i]}
                </th>`
        }
        return tableHead;
    }

    private renderTableList(tBody):string {
        let tableList:string = ``;
        for (let i:number = 0; i < tBody.length; i++) {
            let row = this.renderRow(tBody[i]);
            tableList +=
                `<tr>
                    ${row}
                </tr>`
        }
        return tableList;
    }

    private renderRow(data:Array<string>):string {
        let row:string = ``;
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                row += `<td>${data[key]}</td>`
            }
        }
        return row;
    }

    getEl():string {
        return this.tableEl
    }
}

export default Table;