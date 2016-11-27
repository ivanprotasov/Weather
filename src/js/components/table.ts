class Table {
    private tHead: Array<string>;
    private tBody: Array<Array<string>>;
    private tableEl: string;
    private thead: string;

    constructor(tHead, tBody) {
        this.tHead = tHead;
        this.tBody = tBody;
        this.thead = this.renderTableHeadings();
        this.render(this.tBody);
    }

    render(tBody) {
        let tbody: string = this.renderTableList(tBody);
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

    private renderTableHeadings(): string {
        let list: Array<string> = this.tHead;
        return list.reduce((previousValue, currentValue): string => {
                    return previousValue +=
                        `<th>
                            ${currentValue}
                        </th>`
                }, ``);
    }

    private renderTableList(tBody): string {
        return tBody.reduce((previousValue, currentValue): string => {
            let row = this.renderRow(currentValue);
            return previousValue +=
                `<tr>
                    ${row}
                </tr>`
        }, ``);
    }

    private renderRow(data: Array<string>): string {
        let row: string = ``;
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                row += `<td>${data[key]}</td>`
            }
        }
        return row;
    }

    getEl(): string {
        return this.tableEl
    }
}

export default Table;