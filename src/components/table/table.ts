class Table {
    private tHead: Array<string>;
    private tBody: Array<Array<string>>;
    private tableEl: string;
    constructor(tHead, tBody){
        this.tHead = tHead;
        this.tBody = tBody;
        console.log(tHead);
        console.log(tBody);
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
        let tableHead: string = ``;
        let list:Array<string> = this.tHead;
        console.log(this.tHead);
        for (let i:number=0; i<list.length; i++){
            tableHead+=
                `<th>
                    ${list[i]}
                </th>`
        }
        return tableHead;
    }
    private renderTableList():string{
        let tableList:string = ``,
            tBody = this.tBody;
        for (let i:number=0; i<tBody.length; i++){
            let row = this.renderRow(tBody[i]);
            tableList+=
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
    getEl():string{
        return this.tableEl
    }
}

export default Table;