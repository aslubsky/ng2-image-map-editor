export declare class Utils {
    static app: any;
    /**
     * Returns offset from html page top-left corner for some element
     *
     * @param node {HTMLElement} - html element
     * @returns {Object} - object with offsets, e.g. {x: 100, y: 200}
     */
    static getOffset(node: any): {
        x: number;
        y: number;
    };
    /**
     * Returns correct coordinates (incl. offsets)
     *
     * @param x {number} - x-coordinate
     * @param y {number} - y-coordinate
     * @returns {Object} - object with recalculated coordinates, e.g. {x: 100, y: 200}
     */
    static getRightCoords(x: any, y: any): {
        x: number;
        y: number;
    };
    /**
     * TODO: will use same method of app.js
     * @deprecated
     */
    static id(str: any): HTMLElement;
    /**
     * TODO: will use same method of app.js
     * @deprecated
     */
    static hide(node: any): typeof Utils;
    /**
     * TODO: will use same method of app.js
     * @deprecated
     */
    static show(node: any): typeof Utils;
    /**
     * Escape < and > (for code output)
     *
     * @param str {string} - a string with < and >
     * @returns {string} - a string with escaped < and >
     */
    static encode(str: any): any;
    /**
     * TODO: will use same method of app.js
     * @deprecated
     */
    static foreach(arr: any, func: any): void;
    /**
     * TODO: will use same method of app.js
     * @deprecated
     */
    static foreachReverse(arr: any, func: any): void;
    /**
     * TODO: will use same method of app.js
     * @deprecated
     */
    static stopEvent(e: any): typeof Utils;
}
