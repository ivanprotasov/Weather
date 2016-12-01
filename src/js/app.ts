//import Main from './components/main'
//import "./../styles/base.scss";
//
//let app = new Main;
import { Component } from '@angular/core';

@Component({
    selector: 'my-app',
    template: `<h1>Hello {{name}}</h1>`
})
export class AppComponent { name = 'Angular'; }



