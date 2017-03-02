import { Area } from './area.class';
export declare class Polygon extends Area {
    private selected_point;
    private _polyline;
    constructor(coords: any, type?: any);
    setCoords(params?: any): this;
    setSVGAttributes(params: any): this;
    setParams(arr: any): this;
    addPoint(x: any, y: any): this;
    right_angle(x: any, y: any): {
        x: any;
        y: any;
    };
    dynamicDraw(x: any, y: any, right_angle: any): {
        points: any[];
    };
    onProcessDrawing(e: any): void;
    onAddPointDrawing(e: any): void;
    onStopDrawing(e: any): void;
    redraw(params?: any): this;
    move(x: any, y: any): any;
    pointMove(x: any, y: any): any;
    dynamicEdit(temp_params: any): any;
    onProcessEditing(e: any): void;
    onStopEditing(e: any): void;
    toString(): string;
    static testCoords(coords: any): boolean;
    static createFromSaved(params: any): void;
    static createAndStartDrawing(coords: any): Polygon;
    toJSON(): any;
}
