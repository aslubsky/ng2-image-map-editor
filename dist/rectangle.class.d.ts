import { Area } from './area.class';
/**
 * The constructor for rectangles
 *
 * Initial state:
 * (x, y) -----
 * |          |
 * -----------
 * with width = 0 and height = 0
 *
 * @constructor
 * @param coords {Object} - coordinates of the begin point, e.g. {x: 100, y: 200}
 */
export declare class Rectangle extends Area {
    attributes: any;
    constructor(coords: any, type?: any);
    /**
     * Set attributes for svg-elements of area by new parameters
     * -----top-----
     * |           |
     * ---center_y--
     * |           |
     * ---bottom----
     */
    setSVGAttributes(params: any): this;
    redraw(params?: any): this;
    setParams(params: any): this;
    getNormalizedCoords(): void;
    dynamicDraw(x1: number, y1: number, isSquare?: boolean): any;
    onProcessDrawing(e: any): void;
    onStopDrawing(e: any): void;
    move(dx: number, dy: number): any;
    /**
     * Changes area parameters by editing type and offsets
     *
     * @param {String} editingType - A type of editing
     * @returns {Object} - Object with changed parameters of area
     */
    edit(editingType: string, dx: number, dy: number): any;
    dynamicEdit(temp_params: any, saveProportions: any): any;
    onProcessEditing(e: any): any;
    onStopEditing(e: any): void;
    toString(): string;
    toJSON(): any;
    /**
     * Returns true if coords array is valid for rectangles and false otherwise
     *
     * @static
     * @param coords {Array} - coords for new rectangle as array
     * @return {boolean}
     */
    static testCoords(coords: any): boolean;
    static createFromSaved(params: any): void;
    /**
     * Creates new rectangle and add drawing handlers for DOM-elements
     *
     * @param coords {Object} coords
     * @returns created rectangle
     */
    static createAndStartDrawing(coords: any): Rectangle;
}
