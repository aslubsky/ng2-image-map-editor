"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var area_class_1 = require('./area.class');
var helper_class_1 = require('./helper.class');
var utils_class_1 = require('./utils.class');
var Polygon = (function (_super) {
    __extends(Polygon, _super);
    function Polygon(coords, type) {
        _super.call(this, coords, 'polygon');
        this._params = {
            points: [coords.x, coords.y]
        };
        this._el = document.createElementNS(area_class_1.Area.SVG_NS, 'polyline');
        this._groupEl.appendChild(this._el);
        this._helpers = [
            new helper_class_1.Helper(this._groupEl, this._params.points[0], this._params.points[1], 'number'),
            (new helper_class_1.Helper(this._groupEl, this._params.points[0], this._params.points[1], 'pointMove')).setId(1)
        ];
        this._helpers[0].setNumber(coords.n);
        this.selected_point = -1;
        this.select().redraw();
        area_class_1.Area.app.addObject(this);
    }
    Polygon.prototype.setCoords = function (params) {
        var coords_values = params.points.join(' ');
        this._el.setAttribute('points', coords_values);
        utils_class_1.Utils.foreach(this._helpers, function (x, i) {
            if (x._el.action == 'number') {
                x.setCoords(params.points[0], params.points[1]);
            }
            else {
                i = i - 1;
                x.setCoords(params.points[2 * i], params.points[2 * i + 1]);
            }
        });
        return this;
    };
    Polygon.prototype.setSVGAttributes = function (params) {
        var coords_values = params.points.join(' ');
        this._el.setAttribute('points', coords_values);
        utils_class_1.Utils.foreach(this._helpers, function (helper, i) {
            if (helper._el.action == 'number') {
                helper.setCoords(params.points[0], params.points[1]);
            }
            else {
                i = i - 1;
                helper.setCoords(params.points[2 * i], params.points[2 * i + 1]);
            }
        });
        return this;
    };
    Polygon.prototype.setParams = function (arr) {
        if (arr.isArray) {
            this._params.points = Array.prototype.slice.call(arr);
        }
        else {
            this._params.points = Array.prototype.slice.call(arr.points);
        }
        return this;
    };
    Polygon.prototype.addPoint = function (x, y) {
        var helper = new helper_class_1.Helper(this._groupEl, x, y, 'pointMove');
        helper.setId(this._helpers.length);
        this._helpers.push(helper);
        this._params.points.push(x, y);
        this.redraw();
        return this;
    };
    Polygon.prototype.right_angle = function (x, y) {
        var old_x = this._params.points[this._params.points.length - 2], old_y = this._params.points[this._params.points.length - 1], dx = x - old_x, dy = -(y - old_y), tan = dy / dx;
        if (dx > 0 && dy > 0) {
            if (tan > 2.414) {
                x = old_x;
            }
            else if (tan < 0.414) {
                y = old_y;
            }
            else {
                Math.abs(dx) > Math.abs(dy) ? x = old_x + dy : y = old_y - dx;
            }
        }
        else if (dx < 0 && dy > 0) {
            if (tan < -2.414) {
                x = old_x;
            }
            else if (tan > -0.414) {
                y = old_y;
            }
            else {
                Math.abs(dx) > Math.abs(dy) ? x = old_x - dy : y = old_y + dx;
            }
        }
        else if (dx < 0 && dy < 0) {
            if (tan > 2.414) {
                x = old_x;
            }
            else if (tan < 0.414) {
                y = old_y;
            }
            else {
                Math.abs(dx) > Math.abs(dy) ? x = old_x + dy : y = old_y - dx;
            }
        }
        else if (dx > 0 && dy < 0) {
            if (tan < -2.414) {
                x = old_x;
            }
            else if (tan > -0.414) {
                y = old_y;
            }
            else {
                Math.abs(dx) > Math.abs(dy) ? x = old_x - dy : y = old_y + dx;
            }
        }
        return {
            x: x,
            y: y
        };
    };
    Polygon.prototype.dynamicDraw = function (x, y, right_angle) {
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
    Polygon.prototype.onProcessDrawing = function (e) {
        var coords = utils_class_1.Utils.getRightCoords(e.pageX, e.pageY);
        this.dynamicDraw(coords.x, coords.y, e.shiftKey);
    };
    Polygon.prototype.onAddPointDrawing = function (e) {
        var coords = utils_class_1.Utils.getRightCoords(e.pageX, e.pageY);
        if (e.shiftKey) {
            coords = this.right_angle(coords.x, coords.y);
        }
        this.addPoint(coords.x, coords.y);
    };
    Polygon.prototype.onStopDrawing = function (e) {
        if (e.type == 'click' || (e.type == 'keydown' && e.keyCode == 13)) {
            if (this._params.points.length >= 6) {
                this._polyline = this._el;
                this._el = document.createElementNS(area_class_1.Area.SVG_NS, 'polygon');
                this._groupEl.replaceChild(this._el, this._polyline);
                this.redraw(this._params).deselect();
                delete (this._polyline);
                area_class_1.Area.app.removeAllEvents()
                    .setIsDraw(false)
                    .resetNewArea();
            }
        }
        e.stopPropagation();
    };
    Polygon.prototype.redraw = function (params) {
        this.setSVGAttributes(params ? params : this._params);
        return this;
    };
    Polygon.prototype.move = function (x, y) {
        var temp_params = this._params;
        for (var i = 0, count = this._params.points.length; i < count; i++) {
            this._params.points[i] += (i % 2 ? y : x);
        }
        return temp_params;
    };
    Polygon.prototype.pointMove = function (x, y) {
        if (this.selected_point == 1) {
            this._params.points[0] += x;
            this._params.points[1] += y;
        }
        else {
            this._params.points[2 * this.selected_point - 2] += x;
            this._params.points[2 * this.selected_point - 1] += y;
        }
        return this._params;
    };
    Polygon.prototype.dynamicEdit = function (temp_params) {
        this.setCoords(temp_params);
        return temp_params;
    };
    Polygon.prototype.onProcessEditing = function (e) {
        var editType = area_class_1.Area.app.getEditType();
        if (typeof this[editType] === 'function') {
            this.dynamicEdit(this[editType](e.pageX - this.delta.x, e.pageY - this.delta.y));
            this.delta.x = e.pageX;
            this.delta.y = e.pageY;
        }
    };
    Polygon.prototype.onStopEditing = function (e) {
        var editType = area_class_1.Area.app.getEditType();
        this.setParams(this.dynamicEdit(this[editType](e.pageX - this.delta.x, e.pageY - this.delta.y)));
        area_class_1.Area.app.removeAllEvents();
    };
    Polygon.prototype.toString = function () {
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
    Polygon.testCoords = function (coords) {
        return coords.length >= 6 && coords.length % 2 === 0;
    };
    Polygon.createFromSaved = function (params) {
        if (!this.testCoords(params.coords)) {
            return;
        }
        area_class_1.Area.app.setIsDraw(true);
        var area = new Polygon({
            x: params.coords[0],
            y: params.coords[1],
            n: params.number
        });
        for (var i = 2, c = params.coords.length; i < c; i += 2) {
            area.addPoint(params.coords[i], params.coords[i + 1]);
        }
        area._polyline = area._el;
        area._el = document.createElementNS(area_class_1.Area.SVG_NS, 'polygon');
        area._groupEl.replaceChild(area._el, area._polyline);
        area.setCoords(area._params).deselect();
        delete (area._polyline);
        area_class_1.Area.app.setIsDraw(false)
            .resetNewArea();
        area.setInfoAttributes(params);
    };
    Polygon.createAndStartDrawing = function (coords) {
        coords.n = area_class_1.Area.app.getAreas().length;
        var newArea = new Polygon(coords);
        area_class_1.Area.app.addEvent(area_class_1.Area.app.domElements.container, 'mousemove', newArea.onProcessDrawing.bind(newArea))
            .addEvent(area_class_1.Area.app.domElements.container, 'click', newArea.onAddPointDrawing.bind(newArea))
            .addEvent(document, 'keydown', newArea.onStopDrawing.bind(newArea))
            .addEvent(newArea._helpers[0]._el, 'click', newArea.onStopDrawing.bind(newArea));
        return newArea;
    };
    Polygon.prototype.toJSON = function () {
        return {
            type: 'polygon',
            coords: this._params.points,
            href: this.attributes.href,
            alt: this.attributes.alt,
            title: this.attributes.title
        };
    };
    return Polygon;
}(area_class_1.Area));
exports.Polygon = Polygon;
//# sourceMappingURL=polygon.class.js.map