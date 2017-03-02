"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var area_class_1 = require('./area.class');
var helper_class_1 = require('./helper.class');
var utils_class_1 = require('./utils.class');
var Circle = (function (_super) {
    __extends(Circle, _super);
    function Circle(coords, type) {
        _super.call(this, coords, 'circle');
        this._params = {
            cx: coords.x,
            cy: coords.y,
            radius: 0
        };
        this._el = document.createElementNS(area_class_1.Area.SVG_NS, 'circle');
        this._groupEl.appendChild(this._el);
        this._helpers = {
            number: new helper_class_1.Helper(this._groupEl, coords.x, coords.y, 'number'),
            center: new helper_class_1.Helper(this._groupEl, coords.x, coords.y, 'move'),
            top: new helper_class_1.Helper(this._groupEl, coords.x, coords.y, 'editTop'),
            bottom: new helper_class_1.Helper(this._groupEl, coords.x, coords.y, 'editBottom'),
            left: new helper_class_1.Helper(this._groupEl, coords.x, coords.y, 'editLeft'),
            right: new helper_class_1.Helper(this._groupEl, coords.x, coords.y, 'editRight')
        };
        this._helpers.number.setNumber(coords.n);
        this.select().redraw();
        area_class_1.Area.app.addObject(this);
    }
    Circle.prototype.setSVGAttributes = function (params) {
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
    Circle.prototype.setParams = function (params) {
        this._params.cx = params.cx;
        this._params.cy = params.cy;
        this._params.radius = params.radius;
        return this;
    };
    Circle.prototype.dynamicDraw = function (x1, y1) {
        var x0 = this._params.cx, y0 = this._params.cy, dx, dy, radius, temp_params;
        x1 = x1 || x0;
        y1 = y1 || y0;
        dx = Math.abs(x0 - x1);
        dy = Math.abs(y0 - y1);
        radius = Math.round(Math.sqrt(dx * dx + dy * dy));
        temp_params = {
            cx: x0,
            cy: y0,
            radius: radius
        };
        this.setSVGAttributes(temp_params);
        return temp_params;
    };
    Circle.prototype.onProcessDrawing = function (e) {
        var coords = utils_class_1.Utils.getRightCoords(e.pageX, e.pageY);
        this.dynamicDraw(coords.x, coords.y);
    };
    Circle.prototype.onStopDrawing = function (e) {
        var coords = utils_class_1.Utils.getRightCoords(e.pageX, e.pageY);
        this.setParams(this.dynamicDraw(coords.x, coords.y)).deselect();
        area_class_1.Area.app.removeAllEvents()
            .setIsDraw(false)
            .resetNewArea();
    };
    Circle.prototype.edit = function (editingType, dx, dy) {
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
    Circle.prototype.move = function (dx, dy) {
        var temp_params = Object.create(this._params);
        temp_params.cx += dx;
        temp_params.cy += dy;
        return temp_params;
    };
    Circle.prototype.dynamicEdit = function (temp_params) {
        if (temp_params.radius < 0) {
            temp_params.radius = Math.abs(temp_params.radius);
        }
        this.setSVGAttributes(temp_params);
        return temp_params;
    };
    Circle.prototype.onProcessEditing = function (e) {
        var editType = area_class_1.Area.app.getEditType();
        this.dynamicEdit(this.edit(editType, e.pageX - this.delta.x, e.pageY - this.delta.y));
    };
    Circle.prototype.onStopEditing = function (e) {
        var editType = area_class_1.Area.app.getEditType();
        this.setParams(this.dynamicEdit(this.edit(editType, e.pageX - this.delta.x, e.pageY - this.delta.y)));
        area_class_1.Area.app.removeAllEvents();
    };
    Circle.prototype.toString = function () {
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
    Circle.testCoords = function (coords) {
        return coords.length === 3;
    };
    Circle.createFromSaved = function (params) {
        if (!this.testCoords(params.coords)) {
            return;
        }
        area_class_1.Area.app.setIsDraw(true);
        var area = new Circle({
            x: params.coords[0],
            y: params.coords[1],
            n: params.number
        });
        area.setParams(area.dynamicDraw(params.coords[0], params.coords[1] + params.coords[2])).deselect();
        area_class_1.Area.app.setIsDraw(false)
            .resetNewArea();
        area.setInfoAttributes(params);
    };
    Circle.prototype.toJSON = function () {
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
    Circle.prototype.redraw = function (params) {
        this.setSVGAttributes(params ? params : this._params);
        return this;
    };
    Circle.createAndStartDrawing = function (coords) {
        coords.n = area_class_1.Area.app.getAreas().length;
        var newArea = new Circle(coords);
        area_class_1.Area.app.addEvent(area_class_1.Area.app.domElements.container, 'mousemove', newArea.onProcessDrawing.bind(newArea))
            .addEvent(area_class_1.Area.app.domElements.container, 'click', newArea.onStopDrawing.bind(newArea));
        return newArea;
    };
    return Circle;
}(area_class_1.Area));
exports.Circle = Circle;
//# sourceMappingURL=circle.class.js.map