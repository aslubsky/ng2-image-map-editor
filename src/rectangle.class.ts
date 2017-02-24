import {Area} from './area.class';
import {Helper} from './helper.class';
import {Utils} from './utils.class';

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
export class Rectangle extends Area {
    public attributes: any;

    constructor(coords: any, type?: any) {
        super(coords, 'rectangle');

        /**
         * @namespace
         * @property {number} x - Distance from the left edge of the image to the left side of the rectangle
         * @property {number} y - Distance from the top edge of the image to the top side of the rectangle
         * @property {number} width - Width of rectangle
         * @property {number} height - Height of rectangle
         */
        this._params = {
            x: coords.x,
            y: coords.y,
            width: 0,
            height: 0
        };

        this._el = document.createElementNS(Area.SVG_NS, 'rect');
        this._groupEl.appendChild(this._el);

        var x = coords.x - this._params.width / 2,
            y = coords.y - this._params.height / 2;

        this._helpers = {
            number: new Helper(this._groupEl, x, y, 'number'),
            center: new Helper(this._groupEl, x, y, 'move'),
            top: new Helper(this._groupEl, x, y, 'editTop'),
            bottom: new Helper(this._groupEl, x, y, 'editBottom'),
            left: new Helper(this._groupEl, x, y, 'editLeft'),
            right: new Helper(this._groupEl, x, y, 'editRight'),
            topLeft: new Helper(this._groupEl, x, y, 'editTopLeft'),
            topRight: new Helper(this._groupEl, x, y, 'editTopRight'),
            bottomLeft: new Helper(this._groupEl, x, y, 'editBottomLeft'),
            bottomRight: new Helper(this._groupEl, x, y, 'editBottomRight')
        };
        this._helpers.number.setNumber(coords.n);
        this.select().redraw();

        /* Add this object to array of all objects */
        Area.app.addObject(this);
    }


    /**
     * Set attributes for svg-elements of area by new parameters
     * -----top-----
     * |           |
     * ---center_y--
     * |           |
     * ---bottom----
     */
    public setSVGAttributes(params: any) {
        this._el.setAttribute('x', params.x);
        this._el.setAttribute('y', params.y);
        this._el.setAttribute('width', params.width);
        this._el.setAttribute('height', params.height);

        var top = params.y,
            center_y = params.y + params.height / 2,
            bottom = params.y + params.height,
            left = params.x,
            center_x = params.x + params.width / 2,
            right = params.x + params.width;

        this._helpers.number.setCoords(left, top - 5);
        this._helpers.center.setCoords(center_x, center_y);
        this._helpers.top.setCoords(center_x, top);
        this._helpers.bottom.setCoords(center_x, bottom);
        this._helpers.left.setCoords(left, center_y);
        this._helpers.right.setCoords(right, center_y);
        this._helpers.topLeft.setCoords(left, top);
        this._helpers.topRight.setCoords(right, top);
        this._helpers.bottomLeft.setCoords(left, bottom);
        this._helpers.bottomRight.setCoords(right, bottom);
        return this;
    }

    public redraw(params?: any) {
        this.setSVGAttributes(params ? params : this._params);
        return this;
    }

    public setParams(params: any) {
        this._params.x = params.x;
        this._params.y = params.y;
        this._params.width = params.width;
        this._params.height = params.height;

        return this;
    }

    public getNormalizedCoords() {

    }

    public dynamicDraw(x1: number, y1: number, isSquare?: boolean) {
        var x0 = this._params.x,
            y0 = this._params.y,
            new_x,
            new_y,
            new_width,
            new_height,
            delta,
            temp_params;

        new_width = Math.abs(x1 - x0);
        new_height = Math.abs(y1 - y0);

        if (isSquare) {
            delta = new_width - new_height;
            if (delta > 0) {
                new_width = new_height;
            } else {
                new_height = new_width;
            }
        }

        if (x0 > x1) {
            new_x = x1;
            if (isSquare && delta > 0) {
                new_x = x1 + Math.abs(delta);
            }
        } else {
            new_x = x0;
        }

        if (y0 > y1) {
            new_y = y1;
            if (isSquare && delta < 0) {
                new_y = y1 + Math.abs(delta);
            }
        } else {
            new_y = y0;
        }

        temp_params = {
            x: new_x,
            y: new_y,
            width: new_width,
            height: new_height
        };

        this.setSVGAttributes(temp_params);

        return temp_params;
    }


    public onProcessDrawing(e: any) {
        var coords = Utils.getRightCoords(e.pageX, e.pageY);

        this.dynamicDraw(coords.x, coords.y, e.shiftKey);
    }

    public onStopDrawing(e: any) {
        var coords = Utils.getRightCoords(e.pageX, e.pageY);

        this.setParams(this.dynamicDraw(coords.x, coords.y, e.shiftKey)).deselect();

        Area.app.removeAllEvents()
            .setIsDraw(false)
            .resetNewArea();
    }

    public move(dx: number, dy: number) { //offset x and y
        var temp_params = Object.create(this._params);

        temp_params.x += dx;
        temp_params.y += dy;

        return temp_params;
    }


    /**
     * Changes area parameters by editing type and offsets
     *
     * @param {String} editingType - A type of editing
     * @returns {Object} - Object with changed parameters of area
     */
    public edit(editingType: string, dx: number, dy: number) {
        var tempParams = Object.assign({}, this._params);

        switch (editingType) {
            case 'move':
                tempParams.x += dx;
                tempParams.y += dy;
                break;

            case 'editLeft':
                tempParams.x += dx;
                tempParams.width -= dx;
                break;

            case 'editRight':
                tempParams.width += dx;
                break;

            case 'editTop':
                tempParams.y += dy;
                tempParams.height -= dy;
                break;

            case 'editBottom':
                tempParams.height += dy;
                break;

            case 'editTopLeft':
                tempParams.x += dx;
                tempParams.y += dy;
                tempParams.width -= dx;
                tempParams.height -= dy;
                break;

            case 'editTopRight':
                tempParams.y += dy;
                tempParams.width += dx;
                tempParams.height -= dy;
                break;

            case 'editBottomLeft':
                tempParams.x += dx;
                tempParams.width -= dx;
                tempParams.height += dy;
                break;

            case 'editBottomRight':
                tempParams.width += dx;
                tempParams.height += dy;
                break;
        }

        return tempParams;
    }

    public dynamicEdit(temp_params: any, saveProportions: any) {
        if (temp_params.width < 0) {
            temp_params.width = Math.abs(temp_params.width);
            temp_params.x -= temp_params.width;
        }

        if (temp_params.height < 0) {
            temp_params.height = Math.abs(temp_params.height);
            temp_params.y -= temp_params.height;
        }

        if (saveProportions) {
            var proportions = this._params.width / this._params.height,
                new_proportions = temp_params.width / temp_params.height,
                delta = new_proportions - proportions,
                x0 = this._params.x,
                y0 = this._params.y,
                x1 = temp_params.x,
                y1 = temp_params.y;

            if (delta > 0) {
                temp_params.width = Math.round(temp_params.height * proportions);
            } else {
                temp_params.height = Math.round(temp_params.width / proportions);
            }

        }

        this.setSVGAttributes(temp_params);

        return temp_params;
    }

    public onProcessEditing(e: any) {
        return this.dynamicEdit(
            this.edit(
                Area.app.getEditType(),
                e.pageX - this.delta.x,
                e.pageY - this.delta.y
            ),
            e.shiftKey
        );
    }

    public onStopEditing(e: any) {

        this.setParams(this.onProcessEditing(e));
        Area.app.removeAllEvents()
            .setIsDraw(false)
            .resetNewArea();
    };

    public toString() { //to html map area code
        var x2 = this._params.x + this._params.width,
            y2 = this._params.y + this._params.height;

        return '<area shape="rect" coords="' // TODO: use template engine
            + this._params.x + ', '
            + this._params.y + ', '
            + x2 + ', '
            + y2
            + '"'
            + (this.href ? ' href="' + this.href + '"' : '')
            + (this.alt ? ' alt="' + this.alt + '"' : '')
            + (this.title ? ' title="' + this.title + '"' : '')
            + ' />';
    };

    /**
     * Returns true if coords array is valid for rectangles and false otherwise
     *
     * @static
     * @param coords {Array} - coords for new rectangle as array
     * @return {boolean}
     */
    public static testCoords(coords) {
        return coords.length === 4;
    }

    public static createFromSaved(params: any) {
        if (!this.testCoords(params.coords)) {
            return;
        }

        Area.app.setIsDraw(true);

        var area = new Rectangle({
            x: params.coords[0],
            y: params.coords[1],
            n: params.number
        });

        area.setParams(area.dynamicDraw(params.coords[2], params.coords[3])).deselect();

        Area.app.setIsDraw(false)
            .resetNewArea();

        area.setInfoAttributes(params);
    }

    public toJSON(): any {
        return {
            type: 'rectangle',
            coords: [
                this._params.x,
                this._params.y,
                this._params.x + this._params.width,
                this._params.y + this._params.height
            ],
            href: this.attributes.href,
            alt: this.attributes.alt,
            title: this.attributes.title
        };
    }

    /**
     * Creates new rectangle and add drawing handlers for DOM-elements
     *
     * @param coords {Object} coords
     * @returns created rectangle
     */
    public static  createAndStartDrawing(coords) {
        coords.n = Area.app.getAreas().length;
        var newArea = new Rectangle(coords);

        Area.app.addEvent(Area.app.domElements.container, 'mousemove', newArea.onProcessDrawing.bind(newArea))
            .addEvent(Area.app.domElements.container, 'click', newArea.onStopDrawing.bind(newArea));

        return newArea;
    }
}