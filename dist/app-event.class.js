"use strict";
var AppEvent = (function () {
    function AppEvent(target, eventType, func) {
        this.target = target;
        this.eventType = eventType;
        this.func = func;
        target.addEventListener(eventType, func, false);
    }
    AppEvent.prototype.remove = function () {
        this.target.removeEventListener(this.eventType, this.func, false);
    };
    return AppEvent;
}());
exports.AppEvent = AppEvent;
//# sourceMappingURL=app-event.class.js.map