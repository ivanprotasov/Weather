class EventService {
    handlers:{};

    constructor() {
        this.handlers = {};
    }

    subscribe(event:string, handler:Function) {
        if (this.handlers[event] === undefined)  this.handlers[event] = [];
        this.handlers[event].push(handler);
    }

    publish(event:string, data:{}) {
        if (this.handlers[event] === undefined) return;

        var i = 0,
            len = this.handlers[event].length;

        for (i; i < len; i++) {
            this.handlers[event][i](arguments[i + 1]);
        }
    }
}

export default EventService;