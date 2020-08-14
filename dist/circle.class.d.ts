import { Area } from './area.class';
/**
 * The constructor for circles
 *
 * Initial state:
 *      ----
 *  /         \
 * |  (x, y)  |
 * \         /
 *    ----
 * with radius = 0
 *
 * @constructor
 * @param coords {Object} - coordinates of the begin pointer, e.g. {x: 100, y: 200}
 */
export declare class Circle extends Area {
    constructor(coords: any, type?: any);
    setSVGAttributes(params: any): this;
    setParams(params: any): this;
    dynamicDraw(x1: any, y1: any): any;
    onProcessDrawing(e: any): void;
    onStopDrawing(e: any): void;
    edit(editingType: any, dx: any, dy: any): any;
    move(dx: any, dy: any): any;
    dynamicEdit(temp_params: any): any;
    onProcessEditing(e: any): void;
    onStopEditing(e: any): void;
    toString(): string;
    /**
     * Returns true if coords array is valid for circles and false otherwise
     *
     * @static
     * @param coords {Array} - coords for new circle as array
     * @return {boolean}
     */
    static testCoords(coords: any): boolean;
    static createFromSaved(params: any): void;
    toJSON(): any;
    redraw(params?: any): this;
    /**
     * Creates new circle and add drawing handlers for DOM-elements
     *
     * @param coords {Object} coords
     * @returns created circle
     */
    static createAndStartDrawing(coords: any): Circle;
}
