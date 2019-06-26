export declare class Helper {
    static SIZE: number;
    static SIZENum: number;
    static OFFSET: number;
    static CLASS_NAME: string;
    static ACTIONS_TO_CURSORS: any;
    private _el;
    constructor(node: any, x: number, y: number, action: string);
    setCoords(x: number, y: number): this;
    setNumber(id: number): void;
    setId(id: number): this;
}
