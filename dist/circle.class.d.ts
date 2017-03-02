import { Area } from './area.class';
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
    static testCoords(coords: any): boolean;
    static createFromSaved(params: any): void;
    toJSON(): any;
    redraw(params?: any): this;
    static createAndStartDrawing(coords: any): Circle;
}
