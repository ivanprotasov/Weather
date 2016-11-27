import EventService from '../services/eventService'

class Pagination {
    private data: Array<Array<string>>;
    private eventService: EventService;
    private n: number;
    private parts: number;
    private selectedPart: number;
    private paginationEl: HTMLUListElement;
    private splettedData: Array<Array<Array<string>>>;

    constructor(data: Array<Array<string>>, n: number, eventService: EventService) {
        this.data = data;
        this.eventService = eventService;
        this.n = n;
        this.parts = Math.ceil(this.data.length / n);
        this.selectedPart = 0;
        this.splettedData = this.splitData();
        this.generatePaginationEl();
    }

    generatePaginationEl() {
        this.paginationEl = document.createElement('ul');
        let paginationEl = this.paginationEl;
        paginationEl.className = 'pagination';
        paginationEl.addEventListener('click', this.changePage.bind(this));
        let numbersView: string = ``;
        for (let i: number = 0; i < this.parts; i++) {
            if (!i) {
                numbersView = numbersView + `<li class='active'><a class='pagination-number' href="#">${i + 1}</a></li>`
            } else {
                numbersView = numbersView + `<li><a class='pagination-number' href="#">${i + 1}</a></li>`
            }

        }
        let paginationView = `
             <li>
                <a class='pagination-prew' href="#">«</a>
             </li>
             ${numbersView}
             <li>
                <a class='pagination-next' href="#">»</a>
             </li>
             `;
        paginationEl.innerHTML = paginationView;
        return paginationEl;
    }

    private changePage(e) {
        let target = e.target as HTMLElement;
        let className = target.className;
        let parentNode = target.parentNode as HTMLElement;
        let list = this.paginationEl.children;
        for (let i = 0; i < list.length; i++) {
            list[i].className = '';
        }
        if (className === 'pagination-number') {
            this.selectedPart = +target.innerText - 1;
            parentNode.className = 'active'
        } else if (className === 'pagination-prew') {
            this.selectedPart = (--this.selectedPart) < 0 ? 0 : this.selectedPart;
            list[this.selectedPart + 1].className = 'active'
        } else if (className === 'pagination-next') {
            this.selectedPart = (++this.selectedPart) === this.parts ? this.parts - 1 : this.selectedPart;
            list[this.selectedPart + 1].className = 'active'
        }
        this.eventService.publish('dataIsChanged', this.getData());
    }

    getData(): Array<Array<string>> {
        return this.splettedData[this.selectedPart];
    }

    private splitData(): Array<Array<Array<string>>> {
        let n = this.n;
        let splitedArr: Array<Array<Array<string>>> = [];

        for (let i: number = 0; i < this.parts; i++) {
            splitedArr.push([])
        }
        this.data.forEach(function (value, index) {
            let part: number = Math.floor(index / n);
            splitedArr[part].push(value);
        });
        return splitedArr;
    }
}

export default Pagination;