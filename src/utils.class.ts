export class Utils {
    public static app: any;

    /**
     * Returns offset from html page top-left corner for some element
     *
     * @param node {HTMLElement} - html element
     * @returns {Object} - object with offsets, e.g. {x: 100, y: 200}
     */
    public static getOffset(node) {
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
    public static getRightCoords(x, y) {
        return {
            x: x - Utils.app.getOffset('x'),
            y: y - Utils.app.getOffset('y')
        };
    }

    /**
     * TODO: will use same method of app.js
     * @deprecated
     */
    public static id(str) {
        return document.getElementById(str);
    }

    /**
     * TODO: will use same method of app.js
     * @deprecated
     */
    public static hide(node) {
        node.style.display = 'none';

        return this;
    }

    /**
     * TODO: will use same method of app.js
     * @deprecated
     */
    public static show(node) {
        node.style.display = 'block';

        return this;
    }

    /**
     * Escape < and > (for code output)
     *
     * @param str {string} - a string with < and >
     * @returns {string} - a string with escaped < and >
     */
    public static encode(str) {
        return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    /**
     * TODO: will use same method of app.js
     * @deprecated
     */
    public static foreach(arr, func) {
        for (var i = 0, count = arr.length; i < count; i++) {
            func(arr[i], i);
        }
    }

    /**
     * TODO: will use same method of app.js
     * @deprecated
     */
    public static foreachReverse(arr, func) {
        for (var i = arr.length - 1; i >= 0; i--) {
            func(arr[i], i);
        }
    }

    /**
     * TODO: will use same method of app.js
     * @deprecated
     */
    public static stopEvent(e) {
        e.stopPropagation();
        e.preventDefault();

        return this;
    }
}
