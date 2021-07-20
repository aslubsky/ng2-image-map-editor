import * as i0 from '@angular/core';
import { EventEmitter, forwardRef, Component, Input, Output, NgModule } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';

class Utils {
    /**
     * Returns offset from html page top-left corner for some element
     *
     * @param node {HTMLElement} - html element
     * @returns {Object} - object with offsets, e.g. {x: 100, y: 200}
     */
    static getOffset(node) {
        var boxCoords = node.getBoundingClientRect();
        return {
            x: Math.round(boxCoords.left + window.pageXOffset),
            y: Math.round(boxCoords.top + window.pageYOffset)
        };
    }
    /**
     * Returns correct coordinates (incl. offsets)
     *
     * @param x {number} - x-coordinate
     * @param y {number} - y-coordinate
     * @returns {Object} - object with recalculated coordinates, e.g. {x: 100, y: 200}
     */
    static getRightCoords(x, y) {
        return {
            x: x - Utils.app.getOffset('x'),
            y: y - Utils.app.getOffset('y')
        };
    }
    /**
     * TODO: will use same method of app.js
     * @deprecated
     */
    static id(str) {
        return document.getElementById(str);
    }
    /**
     * TODO: will use same method of app.js
     * @deprecated
     */
    static hide(node) {
        node.style.display = 'none';
        return this;
    }
    /**
     * TODO: will use same method of app.js
     * @deprecated
     */
    static show(node) {
        node.style.display = 'block';
        return this;
    }
    /**
     * Escape < and > (for code output)
     *
     * @param str {string} - a string with < and >
     * @returns {string} - a string with escaped < and >
     */
    static encode(str) {
        return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    /**
     * TODO: will use same method of app.js
     * @deprecated
     */
    static foreach(arr, func) {
        for (var i = 0, count = arr.length; i < count; i++) {
            func(arr[i], i);
        }
    }
    /**
     * TODO: will use same method of app.js
     * @deprecated
     */
    static foreachReverse(arr, func) {
        for (var i = arr.length - 1; i >= 0; i--) {
            func(arr[i], i);
        }
    }
    /**
     * TODO: will use same method of app.js
     * @deprecated
     */
    static stopEvent(e) {
        e.stopPropagation();
        e.preventDefault();
        return this;
    }
}

class Help {
    constructor() {
        this.block = Utils.id('help');
        // console.log('this.block', this.block);
        this.overlay = Utils.id('overlay');
        this.close_button = this.block.querySelector('.close_button');
        this.overlay.addEventListener('click', this.hide.bind(this), false);
        this.close_button.addEventListener('click', this.hide.bind(this), false);
    }
    hide() {
        Utils.hide(this.block);
        Utils.hide(this.overlay);
    }
    show() {
        Utils.show(this.block);
        Utils.show(this.overlay);
    }
}

class Area {
    constructor(coords, type) {
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
    testCoords() {
        throw new Error('This is abstract method');
    }
    setCoords(params) {
        throw new Error('This is abstract method');
    }
    redraw(params) {
        throw new Error('This is abstract method');
    }
    remove() {
        Area.app.removeNodeFromSvg(this._groupEl);
    }
    select() {
        this._el.classList.add(Area.CLASS_NAMES.SELECTED);
        return this;
    }
    deselect() {
        this._el.classList.remove(Area.CLASS_NAMES.SELECTED);
        return this;
    }
    with_href() {
        this._el.classList.add(Area.CLASS_NAMES.WITH_HREF);
        return this;
    }
    without_href() {
        this._el.classList.remove(Area.CLASS_NAMES.WITH_HREF);
        return this;
    }
    setInfoAttributes(params) {
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
    toJSON() {
        return {
            // type: this._type,//?????
            coords: this._params,
            attributes: this.attributes
        };
    }
}
Area.SVG_NS = 'http://www.w3.org/2000/svg';
Area.HTML = 'http://www.w3.org/1999/xhtml';
Area.CLASS_NAMES = {
    SELECTED: 'selected',
    WITH_HREF: 'with_href'
};

/**
 * The constructor of helpers points
 *
 * @constructor
 * @param node {parentNode} - a node for inserting helper
 * @param x {number} - x - coordinate
 * @param y {number} - y - coordinate
 * @param action {string} - an action by click of this helper
 */
class Helper {
    constructor(node, x, y, action) {
        if (action == 'number') {
            this._el = document.createElementNS(Area.SVG_NS, 'text');
        }
        else {
            this._el = document.createElementNS(Area.SVG_NS, 'rect');
        }
        this._el.classList.add(Helper.CLASS_NAME);
        if (action == 'number') {
            //this._el.textContent = 'Test';
            this._el.setAttribute('height', Helper.SIZENum);
            this._el.setAttribute('width', Helper.SIZENum);
            this._el.setAttribute('x', x + Helper.OFFSET);
            this._el.setAttribute('y', y + Helper.OFFSET);
        }
        else {
            this._el.setAttribute('height', Helper.SIZE);
            this._el.setAttribute('width', Helper.SIZE);
            this._el.setAttribute('x', x + Helper.OFFSET);
            this._el.setAttribute('y', y + Helper.OFFSET);
        }
        node.appendChild(this._el);
        this._el.action = action;
        this._el.classList.add(Helper.ACTIONS_TO_CURSORS[action]);
    }
    setCoords(x, y) {
        this._el.setAttribute('x', x + Helper.OFFSET);
        this._el.setAttribute('y', y + Helper.OFFSET);
        return this;
    }
    setNumber(id) {
        this._el.textContent = id + 1;
    }
    setId(id) {
        this._el.n = id;
        return this;
    }
}
Helper.SIZE = 5;
Helper.SIZENum = 15;
Helper.OFFSET = -Math.ceil(Helper.SIZE / 2);
Helper.CLASS_NAME = 'helper';
Helper.ACTIONS_TO_CURSORS = {
    'move': 'move',
    'editLeft': 'e-resize',
    'editRight': 'w-resize',
    'editTop': 'n-resize',
    'editBottom': 's-resize',
    'editTopLeft': 'nw-resize',
    'editTopRight': 'ne-resize',
    'editBottomLeft': 'sw-resize',
    'editBottomRight': 'se-resize',
    'pointMove': 'pointer',
    'number': 'default'
};

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
class Rectangle extends Area {
    constructor(coords, type) {
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
        var x = coords.x - this._params.width / 2, y = coords.y - this._params.height / 2;
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
    setSVGAttributes(params) {
        this._el.setAttribute('x', params.x);
        this._el.setAttribute('y', params.y);
        this._el.setAttribute('width', params.width);
        this._el.setAttribute('height', params.height);
        var top = params.y, center_y = params.y + params.height / 2, bottom = params.y + params.height, left = params.x, center_x = params.x + params.width / 2, right = params.x + params.width;
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
    redraw(params) {
        this.setSVGAttributes(params ? params : this._params);
        return this;
    }
    setParams(params) {
        this._params.x = params.x;
        this._params.y = params.y;
        this._params.width = params.width;
        this._params.height = params.height;
        return this;
    }
    getNormalizedCoords() {
    }
    dynamicDraw(x1, y1, isSquare) {
        var x0 = this._params.x, y0 = this._params.y, new_x, new_y, new_width, new_height, delta, temp_params;
        new_width = Math.abs(x1 - x0);
        new_height = Math.abs(y1 - y0);
        if (isSquare) {
            delta = new_width - new_height;
            if (delta > 0) {
                new_width = new_height;
            }
            else {
                new_height = new_width;
            }
        }
        if (x0 > x1) {
            new_x = x1;
            if (isSquare && delta > 0) {
                new_x = x1 + Math.abs(delta);
            }
        }
        else {
            new_x = x0;
        }
        if (y0 > y1) {
            new_y = y1;
            if (isSquare && delta < 0) {
                new_y = y1 + Math.abs(delta);
            }
        }
        else {
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
    onProcessDrawing(e) {
        var coords = Utils.getRightCoords(e.pageX, e.pageY);
        this.dynamicDraw(coords.x, coords.y, e.shiftKey);
    }
    onStopDrawing(e) {
        var coords = Utils.getRightCoords(e.pageX, e.pageY);
        this.setParams(this.dynamicDraw(coords.x, coords.y, e.shiftKey)).deselect();
        Area.app.removeAllEvents()
            .setIsDraw(false)
            .resetNewArea();
    }
    move(dx, dy) {
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
    edit(editingType, dx, dy) {
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
    dynamicEdit(temp_params, saveProportions) {
        if (temp_params.width < 0) {
            temp_params.width = Math.abs(temp_params.width);
            temp_params.x -= temp_params.width;
        }
        if (temp_params.height < 0) {
            temp_params.height = Math.abs(temp_params.height);
            temp_params.y -= temp_params.height;
        }
        if (saveProportions) {
            var proportions = this._params.width / this._params.height, new_proportions = temp_params.width / temp_params.height, delta = new_proportions - proportions, x0 = this._params.x, y0 = this._params.y, x1 = temp_params.x, y1 = temp_params.y;
            if (delta > 0) {
                temp_params.width = Math.round(temp_params.height * proportions);
            }
            else {
                temp_params.height = Math.round(temp_params.width / proportions);
            }
        }
        this.setSVGAttributes(temp_params);
        return temp_params;
    }
    onProcessEditing(e) {
        return this.dynamicEdit(this.edit(Area.app.getEditType(), e.pageX - this.delta.x, e.pageY - this.delta.y), e.shiftKey);
    }
    onStopEditing(e) {
        this.setParams(this.onProcessEditing(e));
        Area.app.removeAllEvents()
            .setIsDraw(false)
            .resetNewArea();
    }
    toString() {
        var x2 = this._params.x + this._params.width, y2 = this._params.y + this._params.height;
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
    }
    toJSON() {
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
     * Returns true if coords array is valid for rectangles and false otherwise
     *
     * @static
     * @param coords {Array} - coords for new rectangle as array
     * @return {boolean}
     */
    static testCoords(coords) {
        return coords.length === 4;
    }
    static createFromSaved(params) {
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
    /**
     * Creates new rectangle and add drawing handlers for DOM-elements
     *
     * @param coords {Object} coords
     * @returns created rectangle
     */
    static createAndStartDrawing(coords) {
        coords.n = Area.app.getAreas().length;
        var newArea = new Rectangle(coords);
        Area.app.addEvent(Area.app.domElements.container, 'mousemove', newArea.onProcessDrawing.bind(newArea))
            .addEvent(Area.app.domElements.container, 'click', newArea.onStopDrawing.bind(newArea));
        return newArea;
    }
}

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
class Circle extends Area {
    constructor(coords, type) {
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
        this._helpers = {
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
    setSVGAttributes(params) {
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
    }
    setParams(params) {
        this._params.cx = params.cx;
        this._params.cy = params.cy;
        this._params.radius = params.radius;
        return this;
    }
    dynamicDraw(x1, y1) {
        var x0 = this._params.cx, y0 = this._params.cy, dx, dy, radius, temp_params;
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
    }
    onProcessDrawing(e) {
        var coords = Utils.getRightCoords(e.pageX, e.pageY);
        this.dynamicDraw(coords.x, coords.y);
    }
    onStopDrawing(e) {
        var coords = Utils.getRightCoords(e.pageX, e.pageY);
        this.setParams(this.dynamicDraw(coords.x, coords.y)).deselect();
        Area.app.removeAllEvents()
            .setIsDraw(false)
            .resetNewArea();
    }
    edit(editingType, dx, dy) {
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
    }
    move(dx, dy) {
        var temp_params = Object.create(this._params);
        temp_params.cx += dx;
        temp_params.cy += dy;
        return temp_params;
    }
    dynamicEdit(temp_params) {
        if (temp_params.radius < 0) {
            temp_params.radius = Math.abs(temp_params.radius);
        }
        this.setSVGAttributes(temp_params);
        return temp_params;
    }
    onProcessEditing(e) {
        var editType = Area.app.getEditType();
        this.dynamicEdit(this.edit(editType, e.pageX - this.delta.x, e.pageY - this.delta.y));
    }
    onStopEditing(e) {
        var editType = Area.app.getEditType();
        this.setParams(this.dynamicEdit(this.edit(editType, e.pageX - this.delta.x, e.pageY - this.delta.y)));
        Area.app.removeAllEvents();
    }
    toString() {
        return '<area shape="circle" coords="'
            + this._params.cx + ', '
            + this._params.cy + ', '
            + this._params.radius
            + '"'
            + (this.href ? ' href="' + this.href + '"' : '')
            + (this.alt ? ' alt="' + this.alt + '"' : '')
            + (this.title ? ' title="' + this.title + '"' : '')
            + ' />';
    }
    /**
     * Returns true if coords array is valid for circles and false otherwise
     *
     * @static
     * @param coords {Array} - coords for new circle as array
     * @return {boolean}
     */
    static testCoords(coords) {
        return coords.length === 3;
    }
    static createFromSaved(params) {
        if (!this.testCoords(params.coords)) {
            return;
        }
        Area.app.setIsDraw(true);
        var area = new Circle({
            x: params.coords[0],
            y: params.coords[1],
            n: params.number
        });
        area.setParams(area.dynamicDraw(params.coords[0], params.coords[1] + params.coords[2])).deselect();
        Area.app.setIsDraw(false)
            .resetNewArea();
        area.setInfoAttributes(params);
    }
    toJSON() {
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
    }
    redraw(params) {
        this.setSVGAttributes(params ? params : this._params);
        return this;
    }
    /**
     * Creates new circle and add drawing handlers for DOM-elements
     *
     * @param coords {Object} coords
     * @returns created circle
     */
    static createAndStartDrawing(coords) {
        coords.n = Area.app.getAreas().length;
        var newArea = new Circle(coords);
        Area.app.addEvent(Area.app.domElements.container, 'mousemove', newArea.onProcessDrawing.bind(newArea))
            .addEvent(Area.app.domElements.container, 'click', newArea.onStopDrawing.bind(newArea));
        return newArea;
    }
}

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
class Polygon extends Area {
    constructor(coords, type) {
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
        this._helpers = [
            new Helper(this._groupEl, this._params.points[0], this._params.points[1], 'number'),
            (new Helper(this._groupEl, this._params.points[0], this._params.points[1], 'pointMove')).setId(1)
        ];
        this._helpers[0].setNumber(coords.n);
        this.selected_point = -1;
        this.select().redraw();
        Area.app.addObject(this); //add this object to array of all objects
    }
    setCoords(params) {
        var coords_values = params.points.join(' ');
        this._el.setAttribute('points', coords_values);
        Utils.foreach(this._helpers, function (x, i) {
            if (x._el.action == 'number') {
                x.setCoords(params.points[0], params.points[1]);
            }
            else {
                i = i - 1;
                x.setCoords(params.points[2 * i], params.points[2 * i + 1]);
            }
            //x.setCoords(params.points[2 * i], params.points[2 * i + 1]);
        });
        return this;
    }
    setSVGAttributes(params) {
        var coords_values = params.points.join(' ');
        this._el.setAttribute('points', coords_values);
        Utils.foreach(this._helpers, function (helper, i) {
            if (helper._el.action == 'number') {
                helper.setCoords(params.points[0], params.points[1]);
            }
            else {
                i = i - 1;
                helper.setCoords(params.points[2 * i], params.points[2 * i + 1]);
            }
        });
        return this;
    }
    setParams(arr) {
        if (arr.isArray) {
            this._params.points = Array.prototype.slice.call(arr);
        }
        else {
            this._params.points = Array.prototype.slice.call(arr.points);
        }
        return this;
    }
    addPoint(x, y) {
        var helper = new Helper(this._groupEl, x, y, 'pointMove');
        helper.setId(this._helpers.length);
        this._helpers.push(helper);
        this._params.points.push(x, y);
        this.redraw();
        return this;
    }
    right_angle(x, y) {
        var old_x = this._params.points[this._params.points.length - 2], old_y = this._params.points[this._params.points.length - 1], dx = x - old_x, dy = -(y - old_y), tan = dy / dx; //tangens
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
    }
    dynamicDraw(x, y, right_angle) {
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
    }
    onProcessDrawing(e) {
        var coords = Utils.getRightCoords(e.pageX, e.pageY);
        this.dynamicDraw(coords.x, coords.y, e.shiftKey);
    }
    onAddPointDrawing(e) {
        var coords = Utils.getRightCoords(e.pageX, e.pageY);
        if (e.shiftKey) {
            coords = this.right_angle(coords.x, coords.y);
        }
        this.addPoint(coords.x, coords.y);
    }
    onStopDrawing(e) {
        if (e.type == 'click' || (e.type == 'keydown' && e.keyCode == 13)) {
            if (this._params.points.length >= 6) { //>= 3 points for polygon
                this._polyline = this._el;
                this._el = document.createElementNS(Area.SVG_NS, 'polygon');
                this._groupEl.replaceChild(this._el, this._polyline);
                this.redraw(this._params).deselect();
                delete (this._polyline);
                Area.app.removeAllEvents()
                    .setIsDraw(false)
                    .resetNewArea();
            }
        }
        e.stopPropagation();
    }
    redraw(params) {
        this.setSVGAttributes(params ? params : this._params);
        return this;
    }
    move(x, y) {
        //var temp_params = Object.create(this._params);
        var temp_params = this._params;
        for (var i = 0, count = this._params.points.length; i < count; i++) {
            this._params.points[i] += (i % 2 ? y : x);
        }
        return temp_params;
    }
    pointMove(x, y) {
        if (this.selected_point == 1) {
            this._params.points[0] += x;
            this._params.points[1] += y;
        }
        else {
            this._params.points[2 * this.selected_point - 2] += x;
            this._params.points[2 * this.selected_point - 1] += y;
        }
        return this._params;
    }
    dynamicEdit(temp_params) {
        this.setCoords(temp_params);
        return temp_params;
    }
    onProcessEditing(e) {
        var editType = Area.app.getEditType();
        if (typeof this[editType] === 'function') {
            this.dynamicEdit(this[editType](e.pageX - this.delta.x, e.pageY - this.delta.y));
            this.delta.x = e.pageX;
            this.delta.y = e.pageY;
        }
    }
    onStopEditing(e) {
        var editType = Area.app.getEditType();
        this.setParams(this.dynamicEdit(this[editType](e.pageX - this.delta.x, e.pageY - this.delta.y)));
        Area.app.removeAllEvents();
    }
    toString() {
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
    }
    /**
     * Returns true if coords array is valid for polygons and false otherwise
     *
     * @static
     * @param coords {Array} - coords for new polygon as array
     * @return {boolean}
     */
    static testCoords(coords) {
        return coords.length >= 6 && coords.length % 2 === 0;
    }
    static createFromSaved(params) {
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
        delete (area._polyline);
        Area.app.setIsDraw(false)
            .resetNewArea();
        area.setInfoAttributes(params);
    }
    /**
     * Creates new polygon and add drawing handlers for DOM-elements
     *
     * @param coords {Object} coords
     * @returns created polygon
     */
    static createAndStartDrawing(coords) {
        coords.n = Area.app.getAreas().length;
        var newArea = new Polygon(coords);
        Area.app.addEvent(Area.app.domElements.container, 'mousemove', newArea.onProcessDrawing.bind(newArea))
            .addEvent(Area.app.domElements.container, 'click', newArea.onAddPointDrawing.bind(newArea))
            .addEvent(document, 'keydown', newArea.onStopDrawing.bind(newArea))
            .addEvent(newArea._helpers[0]._el, 'click', newArea.onStopDrawing.bind(newArea));
        return newArea;
    }
    toJSON() {
        return {
            type: 'polygon',
            coords: this._params.points,
            href: this.attributes.href,
            alt: this.attributes.alt,
            title: this.attributes.title
        };
    }
}

class AreaFactory {
}
AreaFactory.CONSTRUCTORS = {
    rectangle: Rectangle,
    circle: Circle,
    polygon: Polygon
};

class AppEvent {
    constructor(target, eventType, func) {
        this.target = target;
        this.eventType = eventType;
        this.func = func;
        target.addEventListener(eventType, func, false);
    }
    remove() {
        this.target.removeEventListener(this.eventType, this.func, false);
    }
}

/* Buttons and actions */
class Buttons {
    constructor(app) {
        this.app = app;
        this.all = Utils.id('nav').getElementsByTagName('li');
        this.rectangle = Utils.id('rectangle');
        this.circle = Utils.id('circle');
        this.polygon = Utils.id('polygon');
        this.edit = Utils.id('edit');
        this.clear = Utils.id('clear');
        this.to_html = Utils.id('to_html');
        this.show_help = Utils.id('show_help');
        this.rectangle.addEventListener('click', this.onShapeButtonClick.bind(this), false);
        this.circle.addEventListener('click', this.onShapeButtonClick.bind(this), false);
        this.polygon.addEventListener('click', this.onShapeButtonClick.bind(this), false);
        this.clear.addEventListener('click', this.onClearButtonClick.bind(this), false);
        this.to_html.addEventListener('click', this.onToHtmlButtonClick.bind(this), false);
        this.edit.addEventListener('click', this.onEditButtonClick.bind(this), false);
        this.show_help.addEventListener('click', this.onShowHelpButtonClick.bind(this), false);
    }
    deselectAll() {
        Utils.foreach(this.all, function (x) {
            x.classList.remove(Area.CLASS_NAMES.SELECTED);
        });
    }
    selectOne(button) {
        this.deselectAll();
        button.classList.add(Area.CLASS_NAMES.SELECTED);
    }
    onShapeButtonClick(e) {
        e.preventDefault();
        var target = e.target.id ? e.target : e.target.parentNode;
        // console.log('onShapeButtonClick', e, this, target, target.id);
        this.onSetInvalid();
        this.app.setMode('drawing')
            .setDrawClass()
            .setShape(target.id)
            .deselectAll()
            .hidePreview();
        // this.app.info.unload();
        this.selectOne(target);
    }
    onClearButtonClick(e) {
        e.preventDefault();
        // console.log('onClearButtonClick', e, this);
        // Clear all
        if (confirm('Clear all?')) {
            this.onSetInvalid();
            this.app.setMode(null)
                .setDefaultClass()
                .setShape(null)
                .clear()
                .hidePreview();
            this.deselectAll();
        }
    }
    onToHtmlButtonClick(e) {
        var answers = this.app.getAreas();
        var scale = 1;
        if (this.app.state.image.width > this.app.domElements.img.clientWidth) {
            scale = Number((this.app.state.image.width / this.app.domElements.img.clientWidth).toFixed(3));
        }
        else {
            scale = 1;
        }
        var resultsAnswers = [];
        answers.forEach(function (item, i, arr) {
            var imgMapData = item.toJSON();
            imgMapData.coords.forEach(function (item, i, arr) {
                imgMapData.coords[i] = Math.round(item * scale);
            });
            resultsAnswers.push({
                body: item.attributes.title,
                is_right: (item.attributes.alt == '1') ? true : false,
                img_map: JSON.stringify(imgMapData)
            });
        });
        this.onData(resultsAnswers, this.app.getAreasJSON(scale));
        // Generate html code only
        e.preventDefault();
    }
    onEditButtonClick(e) {
        e.preventDefault();
        this.onSetInvalid();
        if (this.app.getMode() === 'editing') {
            this.app.setMode(null)
                .setDefaultClass()
                .deselectAll();
            this.deselectAll();
            Utils.show(this.app.domElements.svg);
        }
        else {
            this.app.setShape(null)
                .setMode('editing')
                .setEditClass();
            this.selectOne(this.edit);
        }
        this.app.hidePreview();
    }
    onData(answers, areas) {
    }
    onSetInvalid() {
    }
    onShowHelpButtonClick(e) {
        this.app.help.show();
        e.preventDefault();
    }
}

class CursorPositionInfo {
    constructor() {
        this._coords_info = Utils.id('coords');
    }
    set(coords) {
        this._coords_info.innerHTML = 'x: ' + coords.x + ', ' + 'y: ' + coords.y;
    }
    empty() {
        this._coords_info.innerHTML = '';
    }
}
class EditorApp {
    constructor() {
        this.domElements = {
            wrapper: Utils.id('wrapper'),
            svg: Utils.id('svg'),
            img: Utils.id('img'),
            container: Utils.id('image'),
            map: null,
            editor: Utils.id('editor')
        };
        this.img = Utils.id('img');
        this.state = {
            offset: {
                x: 0,
                y: 0
            },
            appMode: null,
            currentType: null,
            editType: null,
            newArea: null,
            selectedArea: null,
            areas: [],
            events: [],
            isDraw: false,
            image: {
                src: null,
                filename: null,
                width: 0,
                height: 0
            }
        };
        // public info: Info = new Info();
        // public code: Code = new Code();
        this.help = new Help();
        this.filename = null;
        /* Get offset value */
        window.addEventListener('resize', this.recalcOffsetValues.bind(this), false);
        /* Disable selection */
        this.domElements.container.addEventListener('mousedown', (e) => {
            e.preventDefault();
        }, false);
        /* Disable image dragging */
        this.domElements.img.addEventListener('dragstart', (e) => {
            e.preventDefault();
        }, false);
        this.cursor_position_info = new CursorPositionInfo();
        this.domElements.container.addEventListener('mousemove', (e) => {
            this.cursor_position_info.set(Utils.getRightCoords(e.pageX, e.pageY));
        }, false);
        this.domElements.container.addEventListener('mouseleave', () => {
            this.cursor_position_info.empty();
        }, false);
        this.domElements.container.addEventListener('mousedown', this.onSvgMousedown.bind(this), false);
        this.domElements.container.addEventListener('click', this.onSvgClick.bind(this), false);
        this.domElements.container.addEventListener('dblclick', this.onAreaDblClick.bind(this), false);
        this.domElements.editor.addEventListener('keydown', this.onDocumentKeyDown.bind(this), false);
        this.buttons = new Buttons(this);
    }
    recalcOffsetValues() {
        this.state.offset = Utils.getOffset(this.domElements.container);
    }
    /* Add mousedown event for svg */
    onSvgMousedown(e) {
        if (this.state.appMode === 'editing') {
            if (e.target.parentNode.tagName === 'g') {
                // this.info.unload();
                this.state.selectedArea = e.target.parentNode.obj;
                this.deselectAll();
                this.state.selectedArea.select();
                this.state.selectedArea.delta = {
                    'x': e.pageX,
                    'y': e.pageY
                };
                if (e.target.classList.contains('helper')) {
                    var helper = e.target;
                    this.state.editType = helper.action;
                    if (helper.n >= 0) { // if typeof selected_area == polygon
                        this.state.selectedArea.selected_point = helper.n;
                    }
                    this.addEvent(this.domElements.container, 'mousemove', this.state.selectedArea.onProcessEditing.bind(this.state.selectedArea))
                        .addEvent(this.domElements.container, 'mouseup', this.state.selectedArea.onStopEditing.bind(this.state.selectedArea));
                }
                else if (e.target.tagName === 'rect' || e.target.tagName === 'circle' || e.target.tagName === 'polygon') {
                    this.state.editType = 'move';
                    this.addEvent(this.domElements.container, 'mousemove', this.state.selectedArea.onProcessEditing.bind(this.state.selectedArea))
                        .addEvent(this.domElements.container, 'mouseup', this.state.selectedArea.onStopEditing.bind(this.state.selectedArea));
                }
            }
            else {
                this.deselectAll();
                // this.info.unload();
            }
        }
    }
    /* Add click event for svg */
    onSvgClick(e) {
        if (this.state.appMode === 'drawing' && !this.state.isDraw && this.state.currentType) {
            // this.code.hide();
            this.setIsDraw(true);
            this.state.newArea = AreaFactory.CONSTRUCTORS[this.state.currentType].createAndStartDrawing(Utils.getRightCoords(e.pageX, e.pageY));
        }
    }
    /* Add dblclick event for svg */
    onAreaDblClick(e) {
        if (this.state.appMode === 'editing') {
            if (e.target.tagName === 'rect' || e.target.tagName === 'circle' || e.target.tagName === 'polygon') {
                this.state.selectedArea = e.target.parentNode.obj;
                // this.info.load(this.state.selectedArea, e.pageX, e.pageY);
            }
        }
    }
    /* Add keydown event for document */
    onDocumentKeyDown(e) {
        var ctrlDown = e.ctrlKey || e.metaKey; // PC || Mac
        switch (e.keyCode) {
            case EditorApp.KEYS.F1:
                this.help.show();
                e.preventDefault();
                break;
            case EditorApp.KEYS.ESC:
                this.help.hide();
                if (this.state.isDraw) {
                    this.state.isDraw = false;
                    this.state.newArea.remove();
                    this.state.areas.pop();
                    this.removeAllEvents();
                }
                else if (this.state.appMode === 'editing') {
                    this.state.selectedArea.redraw();
                    this.removeAllEvents();
                }
                break;
            case EditorApp.KEYS.TOP:
                if (this.state.appMode === 'editing' && this.state.selectedArea) {
                    this.state.selectedArea.setParams(this.state.selectedArea.dynamicEdit(this.state.selectedArea.move(0, -1)));
                    e.preventDefault();
                }
                break;
            case EditorApp.KEYS.BOTTOM:
                if (this.state.appMode === 'editing' && this.state.selectedArea) {
                    this.state.selectedArea.setParams(this.state.selectedArea.dynamicEdit(this.state.selectedArea.move(0, 1)));
                    e.preventDefault();
                }
                break;
            case EditorApp.KEYS.LEFT:
                if (this.state.appMode === 'editing' && this.state.selectedArea) {
                    this.state.selectedArea.setParams(this.state.selectedArea.dynamicEdit(this.state.selectedArea.move(-1, 0)));
                    e.preventDefault();
                }
                break;
            case EditorApp.KEYS.RIGHT:
                if (this.state.appMode === 'editing' && this.state.selectedArea) {
                    this.state.selectedArea.setParams(this.state.selectedArea.dynamicEdit(this.state.selectedArea.move(1, 0)));
                    e.preventDefault();
                }
                break;
            case EditorApp.KEYS.DELETE:
                if (this.state.appMode === 'editing' && this.state.selectedArea) {
                    this.removeObject(this.state.selectedArea);
                    this.state.selectedArea = null;
                    // this.info.unload();
                }
                break;
            case EditorApp.KEYS.I:
                if (this.state.appMode === 'editing' && this.state.selectedArea) {
                    var params = this.state.selectedArea.params, x = params.x || params.cx || params[0], y = params.y || params.cy || params[1];
                    // this.info.load(this.state.selectedArea, x + this.getOffset('x'), y + this.getOffset('y'));
                }
                break;
            case EditorApp.KEYS.C:
                if (this.state.appMode === 'editing' && this.state.selectedArea && ctrlDown) {
                    var Constructor = AreaFactory.CONSTRUCTORS[area_params.type], area_params = this.state.selectedArea.toJSON();
                    if (Constructor) {
                        Constructor.createFromSaved(area_params);
                        this.state.selectedArea.setParams(this.state.selectedArea.move(10, 10));
                        this.state.selectedArea.redraw();
                    }
                }
                break;
        }
    }
    hide() {
        Utils.hide(this.domElements.container);
        return this;
    }
    show() {
        Utils.show(this.domElements.container);
        return this;
    }
    setDimensions(width, height) {
        this.domElements.svg.setAttribute('width', width);
        this.domElements.svg.setAttribute('height', height);
        this.domElements.container.style.width = width + 'px';
        this.domElements.container.style.height = height + 'px';
        return this;
    }
    onImageLoaded(state) {
    }
    loadImage(url, width) {
        this.domElements.img.src = url;
        this.state.image.src = url;
        this.state.image.width = width;
        var tmp_arr = url.split('/');
        this.filename = tmp_arr[tmp_arr.length - 1];
        this.domElements.img.onload = () => {
            this.show()
                .setDimensions(this.domElements.img.width, this.domElements.img.height)
                .recalcOffsetValues();
            this.onImageLoaded(this.state);
        };
        this.setFilename(this.filename);
        this.preview();
        return this;
    }
    preview() {
        this.domElements.img.setAttribute('usemap', '#map');
        this.domElements.map = document.createElement('map');
        this.domElements.map.setAttribute('name', 'map');
        this.domElements.container.appendChild(this.domElements.map);
        // Utils.hide(this.domElements.svg);
        // this.map.innerHTML = this.app.getHTMLCode();
        //     return function () {
        //         info.unload();
        //         app.onEditingProcesshape(null);
        //         Utils.hide(domElements.svg);
        //         map.innerHTML = app.getHTMLCode();
        //         code.print();
        //         return this;
        //     };
    }
    hidePreview() {
        Utils.show(this.domElements.svg);
        this.domElements.map.innerHTML = '';
        return this;
    }
    addNodeToSvg(node) {
        this.domElements.svg.appendChild(node);
        return this;
    }
    removeNodeFromSvg(node) {
        this.domElements.svg.removeChild(node);
        return this;
    }
    getOffset(arg) {
        switch (arg) {
            case 'x':
            case 'y':
                return this.state.offset[arg];
        }
    }
    clear() {
        //remove all areas
        this.state.areas.length = 0;
        while (this.domElements.svg.childNodes[0]) {
            this.domElements.svg.removeChild(this.domElements.svg.childNodes[0]);
        }
        // this.code.hide();
        // this.info.unload();
        return this;
    }
    removeObject(obj) {
        Utils.foreach(this.state.areas, (x, i) => {
            if (x === obj) {
                this.state.areas.splice(i, 1);
            }
        });
        obj.remove();
        this.state.areas.forEach(function (x, i) {
            switch (x.type) {
                case 'rectangle':
                    x._helpers.number.setNumber(i);
                    break;
                case 'polygon':
                    x._helpers[0].setNumber(i);
                    break;
                case 'circle':
                    x._helpers.number.setNumber(i);
                    break;
            }
        });
        return this;
    }
    deselectAll() {
        Utils.foreach(this.state.areas, function (x) {
            x.deselect();
        });
        return this;
    }
    getIsDraw() {
        return this.state.isDraw;
    }
    setIsDraw(arg) {
        this.state.isDraw = arg;
        return this;
    }
    setMode(arg) {
        this.onSetMode(arg);
        this.state.appMode = arg;
        return this;
    }
    getMode() {
        return this.state.appMode;
    }
    onSetMode(mode) {
    }
    onCurrentType(type) {
    }
    setShape(arg) {
        this.state.currentType = arg;
        this.onCurrentType(arg);
        return this;
    }
    getShape() {
        return this.state.currentType;
    }
    addObject(object) {
        this.state.areas.push(object);
        return this;
    }
    getNewArea() {
        return this.state.newArea;
    }
    resetNewArea() {
        this.state.newArea = null;
        return this;
    }
    getSelectedArea() {
        return this.state.selectedArea;
    }
    setSelectedArea(obj) {
        this.state.selectedArea = obj;
        return this;
    }
    getEditType() {
        return this.state.editType;
    }
    setFilename(str) {
        this.state.image.filename = str;
        return this;
    }
    setEditClass() {
        this.domElements.container.classList.remove('draw');
        this.domElements.container.classList.add('edit');
        return this;
    }
    setDrawClass() {
        this.domElements.container.classList.remove('edit');
        this.domElements.container.classList.add('draw');
        return this;
    }
    setDefaultClass() {
        this.domElements.container.classList.remove('edit');
        this.domElements.container.classList.remove('draw');
        return this;
    }
    addEvent(target, eventType, func) {
        this.state.events.push(new AppEvent(target, eventType, func));
        return this;
    }
    removeAllEvents() {
        Utils.foreach(this.state.events, function (x) {
            x.remove();
        });
        this.state.events.length = 0;
        return this;
    }
    // public loadJSON(str, width) {
    //     var obj = JSON.parse(str);
    //     this.loadImage(obj.img, width);
    //     return
    // }
    getAreas() {
        return this.state.areas;
    }
    getAreasJSON(scale) {
        if (scale === undefined) {
            scale = 1;
        }
        var obj = {
            areas: [],
            img: this.state.image.src
        };
        Utils.foreach(this.state.areas, function (x) {
            var data = x.toJSON();
            if (data.type != 'polygon') {
                data.coords.forEach(function (item, i, arr) {
                    data.coords[i] = (Math.round(item * scale));
                });
            }
            obj.areas.push(data);
        });
        return JSON.stringify(obj);
    }
    getHTMLCode(arg) {
        var html_code = '';
        if (arg) {
            if (!this.state.areas.length) {
                return '0 objects';
            }
            html_code += Utils.encode('<img src="' + this.state.image.filename + '" alt="" usemap="#map" />') +
                '<br />' + Utils.encode('<map name="map">') + '<br />';
            Utils.foreachReverse(this.state.areas, function (x) {
                html_code += '&nbsp;&nbsp;&nbsp;&nbsp;' + Utils.encode(x.toString()) + '<br />';
            });
            html_code += Utils.encode('</map>');
        }
        else {
            Utils.foreachReverse(this.state.areas, function (x) {
                html_code += x.toString();
            });
        }
        return html_code;
    }
}
EditorApp.KEYS = {
    F1: 112,
    ESC: 27,
    TOP: 38,
    BOTTOM: 40,
    LEFT: 37,
    RIGHT: 39,
    DELETE: 46,
    I: 73,
    S: 83,
    C: 67
};

const _c0 = ["ng2-image-map-editor", ""];
class Ng2ImageMapEditorDirective {
    constructor() {
        this.answers = [];
        this.valid = true;
        this.isEditMode = false;
        this.currentType = '';
        this.icons = {
            rectangle: '/src/assets/img/test/rec.svg',
            circle: '/src/assets/img/test/cir.svg',
            polygon: '/src/assets/img/test/pol.svg'
        };
        this.labels = {};
        this._loadedImage = '';
        this.onAnswersUpdated = new EventEmitter();
        this.propagateChange = (_) => {
        };
    }
    validate(c) {
        if (this.valid) {
            return null;
        }
        return {
            required: true
        };
    }
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    registerOnTouched() {
        // console.log('registerOnTouched');
    }
    writeValue(value) {
        this._value = value;
        if (this._value) {
            this._parsedValue = JSON.parse(this._value);
        }
        if (this._value && this.mainImageWidth && this.app) {
            if (this._loadedImage != this._parsedValue.img) {
                this._loadedImage = this._parsedValue.img;
                this.app.loadImage(this._parsedValue.img, this.mainImageWidth);
                // console.log('writeValue loadImage', this._parsedValue.img, this.mainImageWidth);
            }
        }
    }
    ngOnInit() {
        this.labels = Ng2ImageMapEditorDirective.globalLabels;
        this.app = new EditorApp();
        Utils.app = this.app;
        Area.app = this.app;
        this.app.buttons.onSetInvalid = () => {
            this.valid = false;
            this.propagateChange([]);
        };
        this.app.buttons.onData = (answers, areas) => {
            this.valid = true;
            this.propagateChange(areas);
            this.answers = answers;
            this.onAnswersUpdated.emit(answers);
        };
        this.app.onCurrentType = (type) => {
            this.currentType = type;
        };
        this.app.onSetMode = (mode) => {
            this.isEditMode = mode == 'editing';
        };
        this.app.onImageLoaded = (state) => {
            // console.log('onImageLoaded');
            if (this._value) {
                var scale = 1;
                if (state.image.width > this.app.domElements.img.clientWidth) {
                    scale = Number((state.image.width / this.app.domElements.img.clientWidth).toFixed(3));
                }
                else {
                    scale = 1;
                }
                // console.log('onImageLoaded', this._parsedValue, this.app.img.width, this.app.domElements.img.clientWidth);
                // console.log('scale', scale );
                // console.log('this.answers', this.answers);
                if (this._parsedValue && this._parsedValue.areas) {
                    this._parsedValue.areas.forEach((x, i) => {
                        if (x.type in AreaFactory.CONSTRUCTORS) {
                            //adaptation coordinates in screen resolution
                            x.coords.forEach((item, i, arr) => {
                                x.coords[i] = Math.round(item / scale);
                            });
                            AreaFactory.CONSTRUCTORS[x.type].createFromSaved({
                                coords: x.coords,
                                href: x.href,
                                alt: (this.answers[i] != undefined && this.answers[i].is_right) ? '1' : '0',
                                title: (this.answers[i] != undefined) ? this.answers[i].body : x.title,
                                number: i
                            });
                        }
                    });
                }
            }
        };
        if (this.mainImageSrc && this.mainImageWidth && this._loadedImage != this.mainImageSrc) {
            this._loadedImage = this.mainImageSrc;
            this.app.loadImage(this.mainImageSrc, this.mainImageWidth);
            // console.log('ngOnInit loadImage', this.mainImageSrc, this.mainImageWidth);
        }
    }
    ngOnChanges(changes) {
        if (this.mainImageSrc && this.mainImageWidth && this.app && this._loadedImage != this.mainImageSrc) {
            this._loadedImage = this.mainImageSrc;
            this.app.loadImage(this.mainImageSrc, this.mainImageWidth);
            // console.log('ngOnChanges loadImage', this.mainImageSrc, this.mainImageWidth);
        }
    }
}
Ng2ImageMapEditorDirective.globalLabels = {
    save_answers: 'Save answers',
    edit: 'Edit',
    clear: 'Clear',
    drawing_mode: 'Drawing mode (rectangle / circle / polygon)',
    drawing_mode_enter: 'stop polygon drawing (or click on first helper)',
    drawing_mode_esc: 'cancel drawing of a new area',
    drawing_mode_shift: 'square drawing in case of a rectangle and right angle drawing in case of a polygon',
    editing_mode: 'Editing mode',
    editing_mode_delete: 'remove a selected area',
    editing_mode_esc: 'cancel editing of a selected area',
    editing_mode_shift: 'edit and save proportions for rectangle',
    editing_mode_up: 'move a selected area up',
    editing_mode_down: 'move a selected area down',
    editing_mode_left: 'move a selected area to the left',
    editing_mode_right: 'move a selected area to the right'
};
Ng2ImageMapEditorDirective.ɵfac = function Ng2ImageMapEditorDirective_Factory(t) { return new (t || Ng2ImageMapEditorDirective)(); };
Ng2ImageMapEditorDirective.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: Ng2ImageMapEditorDirective, selectors: [["", "ng2-image-map-editor", ""]], inputs: { answers: "answers", mainImageSrc: ["src", "mainImageSrc"], mainImageWidth: ["width", "mainImageWidth"] }, outputs: { onAnswersUpdated: "onAnswersUpdated" }, features: [i0.ɵɵProvidersFeature([
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => Ng2ImageMapEditorDirective),
                multi: true
            },
            {
                provide: NG_VALIDATORS,
                useExisting: forwardRef(() => Ng2ImageMapEditorDirective),
                multi: true
            }
        ]), i0.ɵɵNgOnChangesFeature], attrs: _c0, decls: 114, vars: 36, consts: [["id", "wrapper"], ["id", "header"], ["id", "nav", 1, "clearfix"], [1, "float-left"], ["id", "to_html"], ["href", "#", 1, "btn-round-sm-default", 3, "title"], ["xmlns", "http://www.w3.org/2000/svg", "viewBox", "0 0 512 512"], ["d", "M305,148c11.046,0,20-8.954,20-20V90c0-11.046-8.954-20-20-20c-11.046,0-20,8.954-20,20v38\n                                                    C285,139.046,293.954,148,305,148z"], ["d", "M492,352c11.046,0,20-8.954,20-20V102c0-5.304-2.107-10.392-5.858-14.142l-82-82C420.392,2.107,415.304,0,410,0H80\n                                                    C35.888,0,0,35.888,0,80v352c0,44.112,35.888,80,80,80h352c44.112,0,80-35.888,80-80c0-11.046-8.954-20-20-20\n                                                    c-11.046,0-20,8.954-20,20c0,22.056-17.944,40-40,40V312c0-11.046-8.954-20-20-20H100c-11.046,0-20,8.954-20,20v160\n                                                    c-22.056,0-40-17.944-40-40V80c0-22.056,17.944-40,40-40v118c0,33.084,26.916,60,60,60h201c33.084,0,60-26.916,60-60V40h0.716\n                                                    L472,110.284V332C472,343.046,480.954,352,492,352z M120,332h272v140H120V332z M361,158c0,11.028-8.972,20-20,20H140\n                                                    c-11.028,0-20-8.972-20-20V40h241V158z"], ["id", "rectangle", "href", "#"], [3, "src"], ["href", "#", "id", "circle"], ["href", "#", "id", "polygon"], [1, "float-right"], ["id", "edit", 1, "btn"], ["href", "#", 3, "title"], ["d", "M481.996,30.006C462.647,10.656,436.922,0,409.559,0c-27.363,0-53.089,10.656-72.438,30.005L50.826,316.301\n                                            c-2.436,2.436-4.201,5.46-5.125,8.779L0.733,486.637c-1.939,6.968,0.034,14.441,5.163,19.542c3.8,3.78,8.892,5.821,14.106,5.821\n                                            c1.822,0,3.66-0.25,5.463-0.762l161.557-45.891c6.816-1.936,12.1-7.335,13.888-14.192c1.788-6.857-0.186-14.148-5.189-19.167\n                                            L93.869,329.827L331.184,92.511l88.258,88.258L237.768,361.948c-7.821,7.8-7.838,20.463-0.038,28.284\n                                            c7.799,7.822,20.464,7.838,28.284,0.039l215.98-215.392C501.344,155.53,512,129.805,512,102.442\n                                            C512,75.079,501.344,49.354,481.996,30.006z M143.395,436.158L48.827,463.02l26.485-95.152L143.395,436.158z M453.73,146.575\n                                            l-5.965,5.949l-88.296-88.297l5.938-5.938C377.2,46.495,392.88,40,409.559,40c16.679,0,32.358,6.495,44.152,18.29\n                                            C465.505,70.083,472,85.763,472,102.442C472,119.121,465.505,134.801,453.73,146.575z"], ["id", "clear", 1, "btn-round-sm-default"], ["d", "M472,83H351V60c0-33.084-26.916-60-60-60h-70c-33.084,0-60,26.916-60,60v23H40c-11.046,0-20,8.954-20,20s8.954,20,20,20\n                                                h20.712l24.374,315.987c0.007,0.092,0.015,0.185,0.023,0.278c1.816,19.924,10.954,38.326,25.73,51.816\n                                                C125.615,504.571,144.771,512,164.778,512h182.444c41.667,0,75.917-31.032,79.669-72.183\n                                                c1.003-11.001-7.101-20.731-18.101-21.734c-11.011-1.003-20.731,7.101-21.734,18.101C385.195,456.603,368.07,472,347.222,472\n                                                H164.778c-20.777,0-37.875-15.571-39.823-36.242L100.831,123h310.338l-17.082,221.462c-0.849,11.013,7.39,20.629,18.403,21.479\n                                                c0.524,0.04,1.043,0.06,1.56,0.06c10.347,0,19.11-7.974,19.919-18.463L451.288,123H472c11.046,0,20-8.954,20-20\n                                                S483.046,83,472,83z M311,83H201V60c0-11.028,8.972-20,20-20h70c11.028,0,20,8.972,20,20V83z"], ["d", "M165.127,163.019c-11.035,0.482-19.59,9.818-19.108,20.854l10,228.933c0.469,10.738,9.322,19.128,19.966,19.128\n                                                c0.294,0,0.591-0.006,0.888-0.02c11.035-0.482,19.59-9.818,19.108-20.854l-10-228.934\n                                                C185.499,171.092,176.145,162.523,165.127,163.019z"], ["d", "M326.019,182.127l-10,228.934c-0.482,11.035,8.073,20.372,19.108,20.854c0.297,0.013,0.593,0.02,0.888,0.02\n                                                c10.643,0,19.497-8.39,19.966-19.128l10-228.933c0.482-11.035-8.073-20.372-19.108-20.854\n                                                C335.856,162.527,326.501,171.092,326.019,182.127z"], ["d", "M236,183v228.933c0,11.046,8.954,20,20,20c11.046,0,20-8.954,20-20V183c0-11.046-8.954-20-20-20S236,171.954,236,183z"], ["id", "show_help"], ["href", "#", 1, "btn-round-sm-default"], ["version", "1.1", "id", "Capa_1", "xmlns", "http://www.w3.org/2000/svg", "x", "0px", "y", "0px", "viewBox", "0 0 512 512", 0, "xml", "space", "preserve", 2, "enable-background", "new 0 0 512 512"], ["cx", "256", "cy", "127", "r", "20"], ["d", "M437.02,74.98C388.667,26.629,324.38,0,256,0S123.333,26.629,74.98,74.98C26.629,123.333,0,187.62,0,256\n                                    s26.629,132.667,74.98,181.02C123.333,485.371,187.62,512,256,512c46.813,0,92.618-12.758,132.461-36.893\n                                    c9.448-5.724,12.467-18.022,6.744-27.469c-5.723-9.448-18.021-12.467-27.468-6.744C334.144,461.244,295.506,472,256,472\n                                    c-119.103,0-216-96.897-216-216S136.897,40,256,40s216,96.897,216,216c0,42.589-12.665,84.044-36.627,119.884\n                                    c-6.139,9.182-3.672,21.603,5.511,27.742c9.183,6.138,21.603,3.673,27.742-5.51C497.001,355.674,512,306.53,512,256\n                                    C512,187.62,485.371,123.333,437.02,74.98z"], ["d", "M256,187c-11.046,0-20,8.954-20,20v178c0,11.046,8.954,20,20,20s20-8.954,20-20V207C276,195.954,267.046,187,256,187z"], ["id", "coords"], ["id", "debug"], ["id", "image_wrapper"], ["id", "image"], ["src", "", "alt", "#", "id", "img"], ["xmlns", "http://www.w3.org/2000/svg", "version", "1.2", "baseProfile", "tiny", "id", "svg"], ["id", "from_html_wrapper"], ["id", "from_html_form"], ["title", "close", 1, "close_button"], ["for", "code_input"], ["id", "code_input"], ["id", "load_code_button"], ["id", "overlay"], ["id", "help"], [1, "txt"], [1, "key"]], template: function Ng2ImageMapEditorDirective_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "div", 0);
        i0.ɵɵelementStart(1, "header", 1);
        i0.ɵɵelementStart(2, "nav", 2);
        i0.ɵɵelementStart(3, "ul", 3);
        i0.ɵɵelementStart(4, "li", 4);
        i0.ɵɵelementStart(5, "a", 5);
        i0.ɵɵnamespaceSVG();
        i0.ɵɵelementStart(6, "svg", 6);
        i0.ɵɵelementStart(7, "g");
        i0.ɵɵelementStart(8, "g");
        i0.ɵɵelementStart(9, "g");
        i0.ɵɵelement(10, "path", 7);
        i0.ɵɵelement(11, "path", 8);
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵnamespaceHTML();
        i0.ɵɵelementStart(12, "li");
        i0.ɵɵelementStart(13, "a", 9);
        i0.ɵɵelement(14, "img", 10);
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(15, "li");
        i0.ɵɵelementStart(16, "a", 11);
        i0.ɵɵelement(17, "img", 10);
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(18, "li");
        i0.ɵɵelementStart(19, "a", 12);
        i0.ɵɵelement(20, "img", 10);
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(21, "ul", 13);
        i0.ɵɵelementStart(22, "li", 14);
        i0.ɵɵelementStart(23, "a", 15);
        i0.ɵɵnamespaceSVG();
        i0.ɵɵelementStart(24, "svg", 6);
        i0.ɵɵelementStart(25, "g");
        i0.ɵɵelementStart(26, "g");
        i0.ɵɵelement(27, "path", 16);
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵnamespaceHTML();
        i0.ɵɵelementStart(28, "li", 17);
        i0.ɵɵelementStart(29, "a", 5);
        i0.ɵɵnamespaceSVG();
        i0.ɵɵelementStart(30, "svg", 6);
        i0.ɵɵelementStart(31, "g");
        i0.ɵɵelementStart(32, "g");
        i0.ɵɵelementStart(33, "g");
        i0.ɵɵelement(34, "path", 18);
        i0.ɵɵelement(35, "path", 19);
        i0.ɵɵelement(36, "path", 20);
        i0.ɵɵelement(37, "path", 21);
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵnamespaceHTML();
        i0.ɵɵelementStart(38, "li", 22);
        i0.ɵɵelementStart(39, "a", 23);
        i0.ɵɵnamespaceSVG();
        i0.ɵɵelementStart(40, "svg", 24);
        i0.ɵɵelementStart(41, "g");
        i0.ɵɵelementStart(42, "g");
        i0.ɵɵelementStart(43, "g");
        i0.ɵɵelement(44, "circle", 25);
        i0.ɵɵelement(45, "path", 26);
        i0.ɵɵelement(46, "path", 27);
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵnamespaceHTML();
        i0.ɵɵelement(47, "div", 28);
        i0.ɵɵelement(48, "div", 29);
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(49, "div", 30);
        i0.ɵɵelementStart(50, "div", 31);
        i0.ɵɵelement(51, "img", 32);
        i0.ɵɵnamespaceSVG();
        i0.ɵɵelement(52, "svg", 33);
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵnamespaceHTML();
        i0.ɵɵelementStart(53, "div", 34);
        i0.ɵɵelementStart(54, "form", 35);
        i0.ɵɵelementStart(55, "h5");
        i0.ɵɵtext(56, "Loading areas");
        i0.ɵɵelementEnd();
        i0.ɵɵelement(57, "span", 36);
        i0.ɵɵelementStart(58, "p");
        i0.ɵɵelementStart(59, "label", 37);
        i0.ɵɵtext(60, "Enter your html code:");
        i0.ɵɵelementEnd();
        i0.ɵɵelement(61, "textarea", 38);
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(62, "button", 39);
        i0.ɵɵtext(63, "Load");
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelement(64, "div", 40);
        i0.ɵɵelementStart(65, "div", 41);
        i0.ɵɵelement(66, "span", 36);
        i0.ɵɵelementStart(67, "div", 42);
        i0.ɵɵelementStart(68, "section");
        i0.ɵɵelementStart(69, "h2");
        i0.ɵɵtext(70);
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(71, "p");
        i0.ɵɵelementStart(72, "span", 43);
        i0.ɵɵtext(73, "ENTER");
        i0.ɵɵelementEnd();
        i0.ɵɵtext(74);
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(75, "p");
        i0.ɵɵelementStart(76, "span", 43);
        i0.ɵɵtext(77, "ESC");
        i0.ɵɵelementEnd();
        i0.ɵɵtext(78);
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(79, "p");
        i0.ɵɵelementStart(80, "span", 43);
        i0.ɵɵtext(81, "SHIFT");
        i0.ɵɵelementEnd();
        i0.ɵɵtext(82);
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(83, "section");
        i0.ɵɵelementStart(84, "h2");
        i0.ɵɵtext(85);
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(86, "p");
        i0.ɵɵelementStart(87, "span", 43);
        i0.ɵɵtext(88, "DELETE");
        i0.ɵɵelementEnd();
        i0.ɵɵtext(89);
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(90, "p");
        i0.ɵɵelementStart(91, "span", 43);
        i0.ɵɵtext(92, "ESC");
        i0.ɵɵelementEnd();
        i0.ɵɵtext(93);
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(94, "p");
        i0.ɵɵelementStart(95, "span", 43);
        i0.ɵɵtext(96, "SHIFT");
        i0.ɵɵelementEnd();
        i0.ɵɵtext(97);
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(98, "p");
        i0.ɵɵelementStart(99, "span", 43);
        i0.ɵɵtext(100, "\u2191");
        i0.ɵɵelementEnd();
        i0.ɵɵtext(101);
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(102, "p");
        i0.ɵɵelementStart(103, "span", 43);
        i0.ɵɵtext(104, "\u2193");
        i0.ɵɵelementEnd();
        i0.ɵɵtext(105);
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(106, "p");
        i0.ɵɵelementStart(107, "span", 43);
        i0.ɵɵtext(108, "\u2190");
        i0.ɵɵelementEnd();
        i0.ɵɵtext(109);
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(110, "p");
        i0.ɵɵelementStart(111, "span", 43);
        i0.ɵɵtext(112, "\u2192");
        i0.ɵɵelementEnd();
        i0.ɵɵtext(113);
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵadvance(5);
        i0.ɵɵclassProp("btn-round-sm-primary", !ctx.valid);
        i0.ɵɵpropertyInterpolate("title", ctx.labels.save_answers);
        i0.ɵɵadvance(8);
        i0.ɵɵclassProp("btn-round-sm-default", ctx.currentType != "rectangle")("btn-round-sm-primary", ctx.currentType == "rectangle");
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("src", ctx.icons.rectangle, i0.ɵɵsanitizeUrl);
        i0.ɵɵadvance(2);
        i0.ɵɵclassProp("btn-round-sm-default", ctx.currentType != "circle")("btn-round-sm-primary", ctx.currentType == "circle");
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("src", ctx.icons.circle, i0.ɵɵsanitizeUrl);
        i0.ɵɵadvance(2);
        i0.ɵɵclassProp("btn-round-sm-default", ctx.currentType != "polygon")("btn-round-sm-primary", ctx.currentType == "polygon");
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("src", ctx.icons.polygon, i0.ɵɵsanitizeUrl);
        i0.ɵɵadvance(3);
        i0.ɵɵclassProp("btn-round-sm-default", !ctx.isEditMode)("btn-round-sm-primary", ctx.isEditMode);
        i0.ɵɵpropertyInterpolate("title", ctx.labels.edit);
        i0.ɵɵadvance(6);
        i0.ɵɵpropertyInterpolate("title", ctx.labels.clear);
        i0.ɵɵadvance(41);
        i0.ɵɵtextInterpolate(ctx.labels.drawing_mode);
        i0.ɵɵadvance(4);
        i0.ɵɵtextInterpolate1(" \u2014 ", ctx.labels.drawing_mode_enter, "");
        i0.ɵɵadvance(4);
        i0.ɵɵtextInterpolate1(" \u2014 ", ctx.labels.drawing_mode_esc, "");
        i0.ɵɵadvance(4);
        i0.ɵɵtextInterpolate1(" \u2014 ", ctx.labels.drawing_mode_shift, "");
        i0.ɵɵadvance(3);
        i0.ɵɵtextInterpolate(ctx.labels.editing_mode);
        i0.ɵɵadvance(4);
        i0.ɵɵtextInterpolate1(" \u2014 ", ctx.labels.editing_mode_delete, "");
        i0.ɵɵadvance(4);
        i0.ɵɵtextInterpolate1(" \u2014 ", ctx.labels.editing_mode_esc, "");
        i0.ɵɵadvance(4);
        i0.ɵɵtextInterpolate1(" \u2014 ", ctx.labels.editing_mode_shift, "");
        i0.ɵɵadvance(4);
        i0.ɵɵtextInterpolate1(" \u2014 ", ctx.labels.editing_mode_up, "");
        i0.ɵɵadvance(4);
        i0.ɵɵtextInterpolate1(" \u2014 ", ctx.labels.editing_mode_down, "");
        i0.ɵɵadvance(4);
        i0.ɵɵtextInterpolate1(" \u2014 ", ctx.labels.editing_mode_left, "");
        i0.ɵɵadvance(4);
        i0.ɵɵtextInterpolate1(" \u2014 ", ctx.labels.editing_mode_right, "");
    } }, encapsulation: 2 });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(Ng2ImageMapEditorDirective, [{
        type: Component,
        args: [{
                selector: '[ng2-image-map-editor]',
                template: `
        <div id="wrapper">
            <header id="header">
                <nav id="nav" class="clearfix">
                    <ul class="float-left">
                        <li id="to_html">
                            <a [class.btn-round-sm-primary]="!valid" class="btn-round-sm-default" href="#"
                               title="{{labels.save_answers}}">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <g>
                                        <g>
                                            <g>
                                                <path d="M305,148c11.046,0,20-8.954,20-20V90c0-11.046-8.954-20-20-20c-11.046,0-20,8.954-20,20v38
                                                    C285,139.046,293.954,148,305,148z"/>
                                                <path d="M492,352c11.046,0,20-8.954,20-20V102c0-5.304-2.107-10.392-5.858-14.142l-82-82C420.392,2.107,415.304,0,410,0H80
                                                    C35.888,0,0,35.888,0,80v352c0,44.112,35.888,80,80,80h352c44.112,0,80-35.888,80-80c0-11.046-8.954-20-20-20
                                                    c-11.046,0-20,8.954-20,20c0,22.056-17.944,40-40,40V312c0-11.046-8.954-20-20-20H100c-11.046,0-20,8.954-20,20v160
                                                    c-22.056,0-40-17.944-40-40V80c0-22.056,17.944-40,40-40v118c0,33.084,26.916,60,60,60h201c33.084,0,60-26.916,60-60V40h0.716
                                                    L472,110.284V332C472,343.046,480.954,352,492,352z M120,332h272v140H120V332z M361,158c0,11.028-8.972,20-20,20H140
                                                    c-11.028,0-20-8.972-20-20V40h241V158z"/>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </a>
                        </li>
                        <li><a [class.btn-round-sm-default]="currentType != 'rectangle'"
                               [class.btn-round-sm-primary]="currentType == 'rectangle'" id="rectangle" href="#"><img
                                [src]="icons.rectangle"></a></li>
                        <li><a [class.btn-round-sm-default]="currentType != 'circle'"
                               [class.btn-round-sm-primary]="currentType == 'circle'" href="#" id="circle"><img
                                [src]="icons.circle"></a></li>
                        <li><a [class.btn-round-sm-default]="currentType != 'polygon'"
                               [class.btn-round-sm-primary]="currentType == 'polygon'" href="#" id="polygon"><img
                                [src]="icons.polygon"></a></li>
                    </ul>
                    <ul class="float-right">
                        <li class="btn" id="edit">
                            <a [class.btn-round-sm-default]="!isEditMode" title="{{labels.edit}}"
                               [class.btn-round-sm-primary]="isEditMode" href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <g>
                                        <g>
                                            <path d="M481.996,30.006C462.647,10.656,436.922,0,409.559,0c-27.363,0-53.089,10.656-72.438,30.005L50.826,316.301
                                            c-2.436,2.436-4.201,5.46-5.125,8.779L0.733,486.637c-1.939,6.968,0.034,14.441,5.163,19.542c3.8,3.78,8.892,5.821,14.106,5.821
                                            c1.822,0,3.66-0.25,5.463-0.762l161.557-45.891c6.816-1.936,12.1-7.335,13.888-14.192c1.788-6.857-0.186-14.148-5.189-19.167
                                            L93.869,329.827L331.184,92.511l88.258,88.258L237.768,361.948c-7.821,7.8-7.838,20.463-0.038,28.284
                                            c7.799,7.822,20.464,7.838,28.284,0.039l215.98-215.392C501.344,155.53,512,129.805,512,102.442
                                            C512,75.079,501.344,49.354,481.996,30.006z M143.395,436.158L48.827,463.02l26.485-95.152L143.395,436.158z M453.73,146.575
                                            l-5.965,5.949l-88.296-88.297l5.938-5.938C377.2,46.495,392.88,40,409.559,40c16.679,0,32.358,6.495,44.152,18.29
                                            C465.505,70.083,472,85.763,472,102.442C472,119.121,465.505,134.801,453.73,146.575z"/>
                                        </g>
                                    </g>
                                </svg>
                            </a>
                        </li>
                        <li class="btn-round-sm-default" id="clear">
                            <a class="btn-round-sm-default" href="#" title="{{labels.clear}}">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <g>
                                        <g>
                                            <g>
                                                <path d="M472,83H351V60c0-33.084-26.916-60-60-60h-70c-33.084,0-60,26.916-60,60v23H40c-11.046,0-20,8.954-20,20s8.954,20,20,20
                                                h20.712l24.374,315.987c0.007,0.092,0.015,0.185,0.023,0.278c1.816,19.924,10.954,38.326,25.73,51.816
                                                C125.615,504.571,144.771,512,164.778,512h182.444c41.667,0,75.917-31.032,79.669-72.183
                                                c1.003-11.001-7.101-20.731-18.101-21.734c-11.011-1.003-20.731,7.101-21.734,18.101C385.195,456.603,368.07,472,347.222,472
                                                H164.778c-20.777,0-37.875-15.571-39.823-36.242L100.831,123h310.338l-17.082,221.462c-0.849,11.013,7.39,20.629,18.403,21.479
                                                c0.524,0.04,1.043,0.06,1.56,0.06c10.347,0,19.11-7.974,19.919-18.463L451.288,123H472c11.046,0,20-8.954,20-20
                                                S483.046,83,472,83z M311,83H201V60c0-11.028,8.972-20,20-20h70c11.028,0,20,8.972,20,20V83z"/>
                                                <path d="M165.127,163.019c-11.035,0.482-19.59,9.818-19.108,20.854l10,228.933c0.469,10.738,9.322,19.128,19.966,19.128
                                                c0.294,0,0.591-0.006,0.888-0.02c11.035-0.482,19.59-9.818,19.108-20.854l-10-228.934
                                                C185.499,171.092,176.145,162.523,165.127,163.019z"/>
                                                <path d="M326.019,182.127l-10,228.934c-0.482,11.035,8.073,20.372,19.108,20.854c0.297,0.013,0.593,0.02,0.888,0.02
                                                c10.643,0,19.497-8.39,19.966-19.128l10-228.933c0.482-11.035-8.073-20.372-19.108-20.854
                                                C335.856,162.527,326.501,171.092,326.019,182.127z"/>
                                                <path d="M236,183v228.933c0,11.046,8.954,20,20,20c11.046,0,20-8.954,20-20V183c0-11.046-8.954-20-20-20S236,171.954,236,183z"/>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </a>
                        </li>
                        <li id="show_help">
                            <a class="btn-round-sm-default" href="#">
                                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                     viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;"
                                     xml:space="preserve">
                        <g>
                            <g>
                                <g>
                                    <circle cx="256" cy="127" r="20"/>
                                    <path d="M437.02,74.98C388.667,26.629,324.38,0,256,0S123.333,26.629,74.98,74.98C26.629,123.333,0,187.62,0,256
                                    s26.629,132.667,74.98,181.02C123.333,485.371,187.62,512,256,512c46.813,0,92.618-12.758,132.461-36.893
                                    c9.448-5.724,12.467-18.022,6.744-27.469c-5.723-9.448-18.021-12.467-27.468-6.744C334.144,461.244,295.506,472,256,472
                                    c-119.103,0-216-96.897-216-216S136.897,40,256,40s216,96.897,216,216c0,42.589-12.665,84.044-36.627,119.884
                                    c-6.139,9.182-3.672,21.603,5.511,27.742c9.183,6.138,21.603,3.673,27.742-5.51C497.001,355.674,512,306.53,512,256
                                    C512,187.62,485.371,123.333,437.02,74.98z"/>
                                    <path d="M256,187c-11.046,0-20,8.954-20,20v178c0,11.046,8.954,20,20,20s20-8.954,20-20V207C276,195.954,267.046,187,256,187z"/>
                                </g>
                            </g>
                        </g>
                    </svg>
                            </a>
                        </li>
                    </ul>
                </nav>
                <div id="coords"></div>
                <div id="debug"></div>
            </header>
            <div id="image_wrapper">
                <div id="image">
                    <img src="" alt="#" id="img"/>
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny" id="svg"></svg>
                </div>
            </div>
        </div>

        <!-- From html block -->
        <div id="from_html_wrapper">
            <form id="from_html_form">
                <h5>Loading areas</h5>
                <span class="close_button" title="close"></span>
                <p>
                    <label for="code_input">Enter your html code:</label>
                    <textarea id="code_input"></textarea>
                </p>
                <button id="load_code_button">Load</button>
            </form>
        </div>
        <!-- Get image form -->

        <!-- Help block    {{''|translate}} -->
        <div id="overlay"></div>
        <div id="help">
            <span class="close_button" title="close"></span>
            <div class="txt">
                <section>
                    <h2>{{labels.drawing_mode}}</h2>
                    <p><span class="key">ENTER</span> &mdash; {{labels.drawing_mode_enter}}</p>
                    <p><span class="key">ESC</span> &mdash; {{labels.drawing_mode_esc}}</p>
                    <p><span class="key">SHIFT</span> &mdash; {{labels.drawing_mode_shift}}</p>
                </section>
                <section>
                    <h2>{{labels.editing_mode}}</h2>
                    <p><span class="key">DELETE</span> &mdash; {{labels.editing_mode_delete}}</p>
                    <p><span class="key">ESC</span> &mdash; {{labels.editing_mode_esc}}</p>
                    <p><span class="key">SHIFT</span> &mdash; {{labels.editing_mode_shift}}</p>
                    <p><span class="key">&uarr;</span> &mdash; {{labels.editing_mode_up}}</p>
                    <p><span class="key">&darr;</span> &mdash; {{labels.editing_mode_down}}</p>
                    <p><span class="key">&larr;</span> &mdash; {{labels.editing_mode_left}}</p>
                    <p><span class="key">&rarr;</span> &mdash; {{labels.editing_mode_right}}</p>
                </section>
            </div>
        </div>`,
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => Ng2ImageMapEditorDirective),
                        multi: true
                    },
                    {
                        provide: NG_VALIDATORS,
                        useExisting: forwardRef(() => Ng2ImageMapEditorDirective),
                        multi: true
                    }
                ]
            }]
    }], function () { return []; }, { answers: [{
            type: Input,
            args: ['answers']
        }], mainImageSrc: [{
            type: Input,
            args: ['src']
        }], mainImageWidth: [{
            type: Input,
            args: ['width']
        }], onAnswersUpdated: [{
            type: Output
        }] }); })();

class Ng2ImageMapEditorModule {
}
Ng2ImageMapEditorModule.ɵfac = function Ng2ImageMapEditorModule_Factory(t) { return new (t || Ng2ImageMapEditorModule)(); };
Ng2ImageMapEditorModule.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: Ng2ImageMapEditorModule });
Ng2ImageMapEditorModule.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [[]] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(Ng2ImageMapEditorModule, [{
        type: NgModule,
        args: [{
                imports: [],
                declarations: [
                    Ng2ImageMapEditorDirective
                ],
                exports: [
                    Ng2ImageMapEditorDirective
                ]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(Ng2ImageMapEditorModule, { declarations: [Ng2ImageMapEditorDirective], exports: [Ng2ImageMapEditorDirective] }); })();

/**
 * Generated bundle index. Do not edit.
 */

export { Ng2ImageMapEditorDirective, Ng2ImageMapEditorModule };
//# sourceMappingURL=ng2-image-map-editor.js.map
