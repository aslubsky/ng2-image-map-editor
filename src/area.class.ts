export class Area {
    public static app: any;
    public static SVG_NS: string = 'http://www.w3.org/2000/svg';
    public static HTML: string = 'http://www.w3.org/1999/xhtml';
    public static CLASS_NAMES: any = {
        SELECTED: 'selected',
        WITH_HREF: 'with_href'
    };

    protected type: any;
    protected attributes: any;

    protected _params: any;

    protected _groupEl: any;
    protected _el: any;
    protected _helpers: any;

    public delta: any;

    public href: string;
    public alt: string;
    public title: string;


    constructor(coords: any, type?: any) {
        // Public properties:
        this.type = type;
        this.attributes = {
            href: '',
            alt: '',
            title: ''
        };

        // Private properties:
        this._params = {};

        // the g-element, it contains this area and helpers elements
        this._groupEl = document.createElementNS(Area.SVG_NS, 'g');
        Area.app.addNodeToSvg(this._groupEl);

        // Todo: remove this fielf from DOM-element
        /* Link to parent object */
        this._groupEl.obj = this;

        // svg-dom-element of area
        this._el = null;

        // Array/object with all helpers of area
        this._helpers = {}; // or []
    }

    public testCoords() {
        throw new Error('This is abstract method');
    }

    public setCoords(params?: any) {
        throw new Error('This is abstract method');
    }

    public redraw(params?: any) {
        throw new Error('This is abstract method');
    }

    public remove() {
        Area.app.removeNodeFromSvg(this._groupEl);
    }

    public select() {
        this._el.classList.add(Area.CLASS_NAMES.SELECTED);
        return this;
    }

    public deselect() {
        this._el.classList.remove(Area.CLASS_NAMES.SELECTED);
        return this;
    }

    public with_href() {
        this._el.classList.add(Area.CLASS_NAMES.WITH_HREF);
        return this;
    }

    public without_href() {
        this._el.classList.remove(Area.CLASS_NAMES.WITH_HREF);
        return this;
    }

    public setInfoAttributes(params: any) {
        if (params.href) {
            this.attributes.href = params.href;
        }

        if (params.alt) {
            this.attributes.alt = params.alt;
        }

        if (params.title) {
            this.attributes.title = params.title;
        }
    }

    public toJSON(): any {
        return {
            // type: this._type,//?????
            coords: this._params,
            attributes: this.attributes
        };
    }
}