export class Utils {
    /**
     * Returns offset from html page top-left corner for some element
     *
     * @param node {HTMLElement} - html element
     * @returns {Object} - object with offsets, e.g. {x: 100, y: 200}
     */
    static getOffset(node) {
        var boxCoords = node.getBoundingClientRect();
        return {
            x: Math.round(boxCoords.left + window.pageXOffset),
            y: Math.round(boxCoords.top + window.pageYOffset)
        };
    }
    /**
     * Returns correct coordinates (incl. offsets)
     *
     * @param x {number} - x-coordinate
     * @param y {number} - y-coordinate
     * @returns {Object} - object with recalculated coordinates, e.g. {x: 100, y: 200}
     */
    static getRightCoords(x, y) {
        return {
            x: x - Utils.app.getOffset('x'),
            y: y - Utils.app.getOffset('y')
        };
    }
    /**
     * TODO: will use same method of app.js
     * @deprecated
     */
    static id(str) {
        return document.getElementById(str);
    }
    /**
     * TODO: will use same method of app.js
     * @deprecated
     */
    static hide(node) {
        node.style.display = 'none';
        return this;
    }
    /**
     * TODO: will use same method of app.js
     * @deprecated
     */
    static show(node) {
        node.style.display = 'block';
        return this;
    }
    /**
     * Escape < and > (for code output)
     *
     * @param str {string} - a string with < and >
     * @returns {string} - a string with escaped < and >
     */
    static encode(str) {
        return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    /**
     * TODO: will use same method of app.js
     * @deprecated
     */
    static foreach(arr, func) {
        for (var i = 0, count = arr.length; i < count; i++) {
            func(arr[i], i);
        }
    }
    /**
     * TODO: will use same method of app.js
     * @deprecated
     */
    static foreachReverse(arr, func) {
        for (var i = arr.length - 1; i >= 0; i--) {
            func(arr[i], i);
        }
    }
    /**
     * TODO: will use same method of app.js
     * @deprecated
     */
    static stopEvent(e) {
        e.stopPropagation();
        e.preventDefault();
        return this;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuY2xhc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxPQUFPLEtBQUs7SUFHZDs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSTtRQUN4QixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUM3QyxPQUFPO1lBQ0gsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO1lBQ2xELENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztTQUNwRCxDQUFDO0lBQ04sQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDN0IsT0FBTztZQUNILENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDO1lBQy9CLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDO1NBQ2xDLENBQUM7SUFDTixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ2hCLE9BQU8sUUFBUSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJO1FBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUU1QixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJO1FBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUU3QixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUc7UUFDcEIsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRDs7O09BR0c7SUFDSSxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJO1FBQzNCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDaEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNuQjtJQUNMLENBQUM7SUFFRDs7O09BR0c7SUFDSSxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxJQUFJO1FBQ2xDLEtBQUssSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN0QyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ25CO0lBQ0wsQ0FBQztJQUVEOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNyQixDQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDcEIsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRW5CLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBVdGlscyB7XG4gICAgcHVibGljIHN0YXRpYyBhcHA6IGFueTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgb2Zmc2V0IGZyb20gaHRtbCBwYWdlIHRvcC1sZWZ0IGNvcm5lciBmb3Igc29tZSBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gbm9kZSB7SFRNTEVsZW1lbnR9IC0gaHRtbCBlbGVtZW50XG4gICAgICogQHJldHVybnMge09iamVjdH0gLSBvYmplY3Qgd2l0aCBvZmZzZXRzLCBlLmcuIHt4OiAxMDAsIHk6IDIwMH1cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldE9mZnNldChub2RlKSB7XG4gICAgICAgIHZhciBib3hDb29yZHMgPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogTWF0aC5yb3VuZChib3hDb29yZHMubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldCksXG4gICAgICAgICAgICB5OiBNYXRoLnJvdW5kKGJveENvb3Jkcy50b3AgKyB3aW5kb3cucGFnZVlPZmZzZXQpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBjb3JyZWN0IGNvb3JkaW5hdGVzIChpbmNsLiBvZmZzZXRzKVxuICAgICAqXG4gICAgICogQHBhcmFtIHgge251bWJlcn0gLSB4LWNvb3JkaW5hdGVcbiAgICAgKiBAcGFyYW0geSB7bnVtYmVyfSAtIHktY29vcmRpbmF0ZVxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IC0gb2JqZWN0IHdpdGggcmVjYWxjdWxhdGVkIGNvb3JkaW5hdGVzLCBlLmcuIHt4OiAxMDAsIHk6IDIwMH1cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldFJpZ2h0Q29vcmRzKHgsIHkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHggLSBVdGlscy5hcHAuZ2V0T2Zmc2V0KCd4JyksXG4gICAgICAgICAgICB5OiB5IC0gVXRpbHMuYXBwLmdldE9mZnNldCgneScpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVE9ETzogd2lsbCB1c2Ugc2FtZSBtZXRob2Qgb2YgYXBwLmpzXG4gICAgICogQGRlcHJlY2F0ZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGlkKHN0cikge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc3RyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUT0RPOiB3aWxsIHVzZSBzYW1lIG1ldGhvZCBvZiBhcHAuanNcbiAgICAgKiBAZGVwcmVjYXRlZFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgaGlkZShub2RlKSB7XG4gICAgICAgIG5vZGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUT0RPOiB3aWxsIHVzZSBzYW1lIG1ldGhvZCBvZiBhcHAuanNcbiAgICAgKiBAZGVwcmVjYXRlZFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgc2hvdyhub2RlKSB7XG4gICAgICAgIG5vZGUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXNjYXBlIDwgYW5kID4gKGZvciBjb2RlIG91dHB1dClcbiAgICAgKlxuICAgICAqIEBwYXJhbSBzdHIge3N0cmluZ30gLSBhIHN0cmluZyB3aXRoIDwgYW5kID5cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIGEgc3RyaW5nIHdpdGggZXNjYXBlZCA8IGFuZCA+XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBlbmNvZGUoc3RyKSB7XG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvPC9nLCAnJmx0OycpLnJlcGxhY2UoLz4vZywgJyZndDsnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUT0RPOiB3aWxsIHVzZSBzYW1lIG1ldGhvZCBvZiBhcHAuanNcbiAgICAgKiBAZGVwcmVjYXRlZFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZm9yZWFjaChhcnIsIGZ1bmMpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGNvdW50ID0gYXJyLmxlbmd0aDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIGZ1bmMoYXJyW2ldLCBpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRPRE86IHdpbGwgdXNlIHNhbWUgbWV0aG9kIG9mIGFwcC5qc1xuICAgICAqIEBkZXByZWNhdGVkXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBmb3JlYWNoUmV2ZXJzZShhcnIsIGZ1bmMpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IGFyci5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgZnVuYyhhcnJbaV0sIGkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVE9ETzogd2lsbCB1c2Ugc2FtZSBtZXRob2Qgb2YgYXBwLmpzXG4gICAgICogQGRlcHJlY2F0ZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHN0b3BFdmVudChlKSB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG4iXX0=