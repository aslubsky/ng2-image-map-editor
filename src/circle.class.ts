import {Area} from './area.class';
import {Helper} from './helper.class';
import {Utils} from './utils.class';

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
export class Circle extends Area {

    constructor(coords: any, type?: any) {
        super(coords, 'circle');

        /**
         * @namespace
         * @property {number} cx - Distance from the left edge of the image to the center of the circle
         * @property {number} cy - Distance from the top edge of the image to the center of the circle
         * @property {number} radius - Radius of the circle
         */
        this._params = {
            cx: coords.x,
            cy: coords.y,
            radius: 0
        };

        this._el = document.createElementNS(Area.SVG_NS, 'circle');
        this._groupEl.appendChild(this._el);

        this._helpers = { //array of all helpers-rectangles
            number: new Helper(this._groupEl, coords.x, coords.y, 'number'),
            center: new Helper(this._groupEl, coords.x, coords.y, 'move'),
            top: new Helper(this._groupEl, coords.x, coords.y, 'editTop'),
            bottom: new Helper(this._groupEl, coords.x, coords.y, 'editBottom'),
            left: new Helper(this._groupEl, coords.x, coords.y, 'editLeft'),
            right: new Helper(this._groupEl, coords.x, coords.y, 'editRight')
        };
        this._helpers.number.setNumber(coords.n);
        this.select().redraw();

        Area.app.addObject(this); //add this object to array of all objects
    }

    public setSVGAttributes(params) {
        this._el.setAttribute('cx', params.cx);
        this._el.setAttribute('cy', params.cy);
        this._el.setAttribute('r', params.radius);

        this._helpers.number.setCoords(params.cx, params.cy - params.radius - 5);
        this._helpers.center.setCoords(params.cx, params.cy);
        this._helpers.top.setCoords(params.cx, params.cy - params.radius);
        this._helpers.right.setCoords(params.cx + params.radius, params.cy);
        this._helpers.bottom.setCoords(params.cx, params.cy + params.radius);
        this._helpers.left.setCoords(params.cx - params.radius, params.cy);

        return this;
    };

    public setParams(params) {
        this._params.cx = params.cx;
        this._params.cy = params.cy;
        this._params.radius = params.radius;

        return this;
    };

    public dynamicDraw(x1, y1) {
        var x0 = this._params.cx,
            y0 = this._params.cy,
            dx,
            dy,
            radius,
            temp_params;

        x1 = x1 || x0;
        y1 = y1 || y0;

        dx = Math.abs(x0 - x1);
        dy = Math.abs(y0 - y1);
        radius = Math.round(Math.sqrt(dx * dx + dy * dy));

        temp_params = {
            /* params */
            cx: x0,
            cy: y0,
            radius: radius
        };

        this.setSVGAttributes(temp_params);

        return temp_params;
    };

    public onProcessDrawing(e) {
        var coords = Utils.getRightCoords(e.pageX, e.pageY);

        this.dynamicDraw(coords.x, coords.y);
    };

    public onStopDrawing(e) {
        var coords = Utils.getRightCoords(e.pageX, e.pageY);

        this.setParams(this.dynamicDraw(coords.x, coords.y)).deselect();

        Area.app.removeAllEvents()
            .setIsDraw(false)
            .resetNewArea();
    };

    public edit(editingType, dx, dy) {
        var tempParams = Object.assign({}, this._params);
        switch (editingType) {
            case 'move':
                tempParams.cx += dx;
                tempParams.cy += dy;
                break;

            case 'editTop':
                tempParams.radius -= dy;
                break;

            case 'editBottom':
                tempParams.radius += dy;
                break;

            case 'editLeft':
                tempParams.radius -= dx;
                break;

            case 'editRight':
                tempParams.radius += dx;
                break;
        }
        return tempParams;
    };

    public move(dx, dy) { //offset x and y
        var temp_params = Object.create(this._params);

        temp_params.cx += dx;
        temp_params.cy += dy;

        return temp_params;
    };

    public dynamicEdit(temp_params) {
        if (temp_params.radius < 0) {
            temp_params.radius = Math.abs(temp_params.radius);
        }
        this.setSVGAttributes(temp_params);

        return temp_params;
    };

    public onProcessEditing(e) {
        var editType = Area.app.getEditType();
        this.dynamicEdit(
            this.edit(editType, e.pageX - this.delta.x, e.pageY - this.delta.y)
        );
    };

    public onStopEditing(e) {
        var editType = Area.app.getEditType();

        this.setParams(
            this.dynamicEdit(
                this.edit(editType, e.pageX - this.delta.x, e.pageY - this.delta.y)
            )
        );

        Area.app.removeAllEvents();
    };

    public toString() { //to html map area code
        return '<area shape="circle" coords="'
            + this._params.cx + ', '
            + this._params.cy + ', '
            + this._params.radius
            + '"'
            + (this.href ? ' href="' + this.href + '"' : '')
            + (this.alt ? ' alt="' + this.alt + '"' : '')
            + (this.title ? ' title="' + this.title + '"' : '')
            + ' />';
    };

    /**
     * Returns true if coords array is valid for circles and false otherwise
     *
     * @static
     * @param coords {Array} - coords for new circle as array
     * @return {boolean}
     */
    public static testCoords(coords) {
        return coords.length === 3;
    };

    public static createFromSaved(params) {
        if (!this.testCoords(params.coords)) {
            return;
        }

        Area.app.setIsDraw(true);
        var area = new Circle({
            x: params.coords[0],
            y: params.coords[1],
            n: params.number
        });

        area.setParams(area.dynamicDraw(
            params.coords[0],
            params.coords[1] + params.coords[2]
        )).deselect();

        Area.app.setIsDraw(false)
            .resetNewArea();

        area.setInfoAttributes(params);
    };

    public toJSON(): any {
        return {
            type: 'circle',
            coords: [
                this._params.cx,
                this._params.cy,
                this._params.radius
            ],
            href: this.attributes.href,
            alt: this.attributes.alt,
            title: this.attributes.title
        };
    };

    public redraw(params?: any) {
        this.setSVGAttributes(params ? params : this._params);
        return this;
    }

    /**
     * Creates new circle and add drawing handlers for DOM-elements
     *
     * @param coords {Object} coords
     * @returns created circle
     */
    public static createAndStartDrawing(coords) {
        coords.n = Area.app.getAreas().length;
        var newArea = new Circle(coords);

        Area.app.addEvent(Area.app.domElements.container, 'mousemove', newArea.onProcessDrawing.bind(newArea))
            .addEvent(Area.app.domElements.container, 'click', newArea.onStopDrawing.bind(newArea));

        return newArea;
    };
}