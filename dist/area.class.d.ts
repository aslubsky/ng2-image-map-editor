export declare class Area {
    static app: any;
    static SVG_NS: string;
    static HTML: string;
    static CLASS_NAMES: any;
    protected type: any;
    protected attributes: any;
    protected _params: any;
    protected _groupEl: any;
    protected _el: any;
    protected _helpers: any;
    delta: any;
    href: string;
    alt: string;
    title: string;
    constructor(coords: any, type?: any);
    testCoords(): void;
    setCoords(params?: any): void;
    redraw(params?: any): void;
    remove(): void;
    select(): this;
    deselect(): this;
    with_href(): this;
    without_href(): this;
    setInfoAttributes(params: any): void;
    toJSON(): any;
}
