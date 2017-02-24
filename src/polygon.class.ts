import {Area} from './area.class';
import {Helper} from './helper.class';
import {Utils} from './utils.class';

/**
 * The constructor for polygons
 *
 * Initial state:
 *    (x, y)
 * only one point of the line
 *
 * @constructor
 * @param coords {Object} - coordinates of the begin pointer, e.g. {x: 100, y: 200}
 */
export class Polygon extends Area {

    private selected_point: number;
    private _polyline: any;

    constructor(coords: any, type?: any) {
        super(coords, 'polygon');

        /**
         * @namespace
         * @property {array} points - Array of coordinates of polygon points
         */
        this._params = {
            points: [coords.x, coords.y]
        };

        this._el = document.createElementNS(Area.SVG_NS, 'polyline');
        this._groupEl.appendChild(this._el);

        this._helpers = [ //array of all helpers-rectangles
            new Helper(this._groupEl, this._params.points[0], this._params.points[1], 'number'),
            (new Helper(this._groupEl, this._params.points[0], this._params.points[1], 'pointMove')).setId(1)
        ];
        this._helpers[0].setNumber(coords.n);
        this.selected_point = -1;

        this.select().redraw();

        Area.app.addObject(this); //add this object to array of all objects
    }


    public setCoords(params?: any) {
        var coords_values = params.points.join(' ');
        this._el.setAttribute('points', coords_values);
        Utils.foreach(this._helpers, function (x, i) {
            if (x._el.action == 'number') {
                x.setCoords(params.points[0], params.points[1]);
            } else {
                i = i - 1;
                x.setCoords(params.points[2 * i], params.points[2 * i + 1]);
            }
            //x.setCoords(params.points[2 * i], params.points[2 * i + 1]);
        });

        return this;
    };

    public setSVGAttributes(params) {
        var coords_values = params.points.join(' ');
        this._el.setAttribute('points', coords_values);

        Utils.foreach(this._helpers, function (helper, i) {
            if (helper._el.action == 'number') {
                helper.setCoords(params.points[0], params.points[1]);
            } else {
                i = i - 1;
                helper.setCoords(params.points[2 * i], params.points[2 * i + 1]);
            }
        });
        return this;
    };

    public setParams(arr) {
        if (arr.isArray) {
            this._params.points = Array.prototype.slice.call(arr);
        } else {
            this._params.points = Array.prototype.slice.call(arr.points);
        }
        return this;
    };

    public addPoint(x, y) {
        var helper = new Helper(this._groupEl, x, y, 'pointMove');
        helper.setId(this._helpers.length);
        this._helpers.push(helper);
        this._params.points.push(x, y);
        this.redraw();

        return this;
    };

    public right_angle(x, y) {
        var old_x = this._params.points[this._params.points.length - 2],
            old_y = this._params.points[this._params.points.length - 1],
            dx = x - old_x,
            dy = -(y - old_y),
            tan = dy / dx; //tangens

        if (dx > 0 && dy > 0) {
            if (tan > 2.414) {
                x = old_x;
            } else if (tan < 0.414) {
                y = old_y;
            } else {
                Math.abs(dx) > Math.abs(dy) ? x = old_x + dy : y = old_y - dx;
            }
        } else if (dx < 0 && dy > 0) {
            if (tan < -2.414) {
                x = old_x;
            } else if (tan > -0.414) {
                y = old_y;
            } else {
                Math.abs(dx) > Math.abs(dy) ? x = old_x - dy : y = old_y + dx;
            }
        } else if (dx < 0 && dy < 0) {
            if (tan > 2.414) {
                x = old_x;
            } else if (tan < 0.414) {
                y = old_y;
            } else {
                Math.abs(dx) > Math.abs(dy) ? x = old_x + dy : y = old_y - dx;
            }
        } else if (dx > 0 && dy < 0) {
            if (tan < -2.414) {
                x = old_x;
            } else if (tan > -0.414) {
                y = old_y;
            } else {
                Math.abs(dx) > Math.abs(dy) ? x = old_x - dy : y = old_y + dx;
            }
        }

        return {
            x: x,
            y: y
        };
    };

    public dynamicDraw(x, y, right_angle) {
        var temp_params = {
            points: [].concat(this._params.points)
        };

        if (right_angle) {
            var right_coords = this.right_angle(x, y);
            x = right_coords.x;
            y = right_coords.y;
        }

        temp_params.points.push(x, y);

        this.redraw(temp_params);

        return temp_params;
    };

    public onProcessDrawing(e) {
        var coords = Utils.getRightCoords(e.pageX, e.pageY);

        this.dynamicDraw(coords.x, coords.y, e.shiftKey);
    };

    public onAddPointDrawing(e) {
        var coords = Utils.getRightCoords(e.pageX, e.pageY);

        if (e.shiftKey) {
            coords = this.right_angle(coords.x, coords.y);
        }

        this.addPoint(coords.x, coords.y);
    };

    public onStopDrawing(e) {
        if (e.type == 'click' || (e.type == 'keydown' && e.keyCode == 13)) {
            if (this._params.points.length >= 6) {//>= 3 points for polygon
                this._polyline = this._el;
                this._el = document.createElementNS(Area.SVG_NS, 'polygon');
                this._groupEl.replaceChild(this._el, this._polyline);
                this.redraw(this._params).deselect();
                delete(this._polyline);

                Area.app.removeAllEvents()
                    .setIsDraw(false)
                    .resetNewArea();
            }
        }
        e.stopPropagation();
    };

    public redraw(params?: any) {
        this.setSVGAttributes(params ? params : this._params);
        return this;
    }

    public move(x, y) { //offset x and y
        //var temp_params = Object.create(this._params);
        var temp_params = this._params;

        for (var i = 0, count = this._params.points.length; i < count; i++) {
            this._params.points[i] += (i % 2 ? y : x);
        }
        return temp_params;
    };

    public pointMove(x, y) {//offset x and y
        if (this.selected_point == 1) {
            this._params.points[0] += x;
            this._params.points[1] += y;
        } else {
            this._params.points[2 * this.selected_point - 2] += x;
            this._params.points[2 * this.selected_point - 1] += y;
        }

        return this._params;
    };

    public dynamicEdit(temp_params) {
        this.setCoords(temp_params);

        return temp_params;
    };

    public onProcessEditing(e) {
        var editType = Area.app.getEditType();
        if (typeof this[editType] === 'function') {
            this.dynamicEdit(
                this[editType](e.pageX - this.delta.x, e.pageY - this.delta.y)
            );
            this.delta.x = e.pageX;
            this.delta.y = e.pageY;
        }
    };

    public onStopEditing(e) {
        var editType = Area.app.getEditType();
        this.setParams(
            this.dynamicEdit(
                this[editType](e.pageX - this.delta.x, e.pageY - this.delta.y)
            )
        );
        Area.app.removeAllEvents();
    };

    public toString() { //to html map area code
        for (var i = 0, count = this._params.points.length, str = ''; i < count; i++) {
            str += this._params.points[i];
            if (i != count - 1) {
                str += ', ';
            }
        }

        return '<area shape="poly" coords="'
            + str
            + '"'
            + (this.href ? ' href="' + this.href + '"' : '')
            + (this.alt ? ' alt="' + this.alt + '"' : '')
            + (this.title ? ' title="' + this.title + '"' : '')
            + ' />';
    };

    /**
     * Returns true if coords array is valid for polygons and false otherwise
     *
     * @static
     * @param coords {Array} - coords for new polygon as array
     * @return {boolean}
     */
    public static testCoords(coords) {
        return coords.length >= 6 && coords.length % 2 === 0;
    };

    public static createFromSaved(params) {
        if (!this.testCoords(params.coords)) {
            return;
        }

        Area.app.setIsDraw(true);

        var area = new Polygon({
            x: params.coords[0],
            y: params.coords[1],
            n: params.number
        });

        for (var i = 2, c = params.coords.length; i < c; i += 2) {
            area.addPoint(params.coords[i], params.coords[i + 1]);
        }

        area._polyline = area._el;
        area._el = document.createElementNS(Area.SVG_NS, 'polygon');
        area._groupEl.replaceChild(area._el, area._polyline);

        area.setCoords(area._params).deselect();
        delete(area._polyline);

        Area.app.setIsDraw(false)
            .resetNewArea();

        area.setInfoAttributes(params);

    };

    /**
     * Creates new polygon and add drawing handlers for DOM-elements
     *
     * @param coords {Object} coords
     * @returns created polygon
     */
    public static createAndStartDrawing(coords) {
        coords.n = Area.app.getAreas().length;
        var newArea = new Polygon(coords);

        Area.app.addEvent(Area.app.domElements.container, 'mousemove', newArea.onProcessDrawing.bind(newArea))
            .addEvent(Area.app.domElements.container, 'click', newArea.onAddPointDrawing.bind(newArea))
            .addEvent(document, 'keydown', newArea.onStopDrawing.bind(newArea))
            .addEvent(newArea._helpers[0]._el, 'click', newArea.onStopDrawing.bind(newArea));

        return newArea;
    };

    public toJSON(): any {
        return {
            type: 'polygon',
            coords: this._params.points,
            href: this.attributes.href,
            alt: this.attributes.alt,
            title: this.attributes.title
        };
    }
}