export declare class Utils {
    static app: any;
    static getOffset(node: any): {
        x: number;
        y: number;
    };
    static getRightCoords(x: any, y: any): {
        x: number;
        y: number;
    };
    static id(str: any): HTMLElement;
    static hide(node: any): typeof Utils;
    static show(node: any): typeof Utils;
    static encode(str: any): any;
    static foreach(arr: any, func: any): void;
    static foreachReverse(arr: any, func: any): void;
    static stopEvent(e: any): typeof Utils;
}
