import { Area } from './area.class';
export declare class Rectangle extends Area {
    attributes: any;
    constructor(coords: any, type?: any);
    setSVGAttributes(params: any): this;
    redraw(params?: any): this;
    setParams(params: any): this;
    getNormalizedCoords(): void;
    dynamicDraw(x1: number, y1: number, isSquare?: boolean): any;
    onProcessDrawing(e: any): void;
    onStopDrawing(e: any): void;
    move(dx: number, dy: number): any;
    edit(editingType: string, dx: number, dy: number): any;
    dynamicEdit(temp_params: any, saveProportions: any): any;
    onProcessEditing(e: any): any;
    onStopEditing(e: any): void;
    toString(): string;
    toJSON(): any;
    static testCoords(coords: any): boolean;
    static createFromSaved(params: any): void;
    static createAndStartDrawing(coords: any): Rectangle;
}
