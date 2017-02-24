export class AppEvent {
    public target: any;
    public func: any;
    public eventType: any;

    constructor(target: any, eventType: any, func: any,) {
        this.target = target;
        this.eventType = eventType;
        this.func = func;

        target.addEventListener(eventType, func, false);
    }

    public remove() {
        this.target.removeEventListener(this.eventType, this.func, false);
    }
}