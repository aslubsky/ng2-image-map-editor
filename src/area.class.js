import { Rectangle } from './rectangle.class';
import { Circle } from './circle.class';
import { Polygon } from './polygon.class';
export var Area = (function () {
    function Area(coords, type) {
        this.type = type;
        this.attributes = {
            href: '',
            alt: '',
            title: ''
        };
        this._params = {};
        this._groupEl = document.createElementNS(Area.SVG_NS, 'g');
        Area.app.addNodeToSvg(this._groupEl);
        this._groupEl.obj = this;
        this._el = null;
        this._helpers = {};
    }
    Area.prototype.testCoords = function () {
        throw new Error('This is abstract method');
    };
    Area.prototype.setCoords = function (params) {
        throw new Error('This is abstract method');
    };
    Area.prototype.redraw = function (params) {
        throw new Error('This is abstract method');
    };
    Area.prototype.remove = function () {
        Area.app.removeNodeFromSvg(this._groupEl);
    };
    Area.prototype.select = function () {
        this._el.classList.add(Area.CLASS_NAMES.SELECTED);
        return this;
    };
    Area.prototype.deselect = function () {
        this._el.classList.remove(Area.CLASS_NAMES.SELECTED);
        return this;
    };
    Area.prototype.with_href = function () {
        this._el.classList.add(Area.CLASS_NAMES.WITH_HREF);
        return this;
    };
    Area.prototype.without_href = function () {
        this._el.classList.remove(Area.CLASS_NAMES.WITH_HREF);
        return this;
    };
    Area.prototype.setInfoAttributes = function (params) {
        if (params.href) {
            this.attributes.href = params.href;
        }
        if (params.alt) {
            this.attributes.alt = params.alt;
        }
        if (params.title) {
            this.attributes.title = params.title;
        }
    };
    Area.prototype.toJSON = function () {
        return {
            coords: this._params,
            attributes: this.attributes
        };
    };
    Area.SVG_NS = 'http://www.w3.org/2000/svg';
    Area.HTML = 'http://www.w3.org/1999/xhtml';
    Area.CLASS_NAMES = {
        SELECTED: 'selected',
        WITH_HREF: 'with_href'
    };
    Area.CONSTRUCTORS = {
        rectangle: Rectangle,
        circle: Circle,
        polygon: Polygon
    };
    return Area;
}());
//# sourceMappingURL=area.class.js.map