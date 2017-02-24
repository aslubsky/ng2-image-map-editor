var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Area } from './area.class';
import { Helper } from './helper.class';
import { Utils } from './utils.class';
export var Rectangle = (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(coords, type) {
        _super.call(this, coords, 'rectangle');
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
        Area.app.addObject(this);
    }
    Rectangle.prototype.setSVGAttributes = function (params) {
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
    };
    Rectangle.prototype.redraw = function (params) {
        this.setSVGAttributes(params ? params : this._params);
        return this;
    };
    Rectangle.prototype.setParams = function (params) {
        this._params.x = params.x;
        this._params.y = params.y;
        this._params.width = params.width;
        this._params.height = params.height;
        return this;
    };
    Rectangle.prototype.getNormalizedCoords = function () {
    };
    Rectangle.prototype.dynamicDraw = function (x1, y1, isSquare) {
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
    };
    Rectangle.prototype.onProcessDrawing = function (e) {
        var coords = Utils.getRightCoords(e.pageX, e.pageY);
        this.dynamicDraw(coords.x, coords.y, e.shiftKey);
    };
    Rectangle.prototype.onStopDrawing = function (e) {
        var coords = Utils.getRightCoords(e.pageX, e.pageY);
        this.setParams(this.dynamicDraw(coords.x, coords.y, e.shiftKey)).deselect();
        Area.app.removeAllEvents()
            .setIsDraw(false)
            .resetNewArea();
    };
    Rectangle.prototype.move = function (dx, dy) {
        var temp_params = Object.create(this._params);
        temp_params.x += dx;
        temp_params.y += dy;
        return temp_params;
    };
    Rectangle.prototype.edit = function (editingType, dx, dy) {
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
    };
    Rectangle.prototype.dynamicEdit = function (temp_params, saveProportions) {
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
    };
    Rectangle.prototype.onProcessEditing = function (e) {
        return this.dynamicEdit(this.edit(Area.app.getEditType(), e.pageX - this.delta.x, e.pageY - this.delta.y), e.shiftKey);
    };
    Rectangle.prototype.onStopEditing = function (e) {
        this.setParams(this.onProcessEditing(e));
        Area.app.removeAllEvents()
            .setIsDraw(false)
            .resetNewArea();
    };
    ;
    Rectangle.prototype.toString = function () {
        var x2 = this._params.x + this._params.width, y2 = this._params.y + this._params.height;
        return '<area shape="rect" coords="'
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
    ;
    Rectangle.testCoords = function (coords) {
        return coords.length === 4;
    };
    Rectangle.createFromSaved = function (params) {
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
    };
    Rectangle.prototype.toJSON = function () {
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
    };
    Rectangle.createAndStartDrawing = function (coords) {
        coords.n = Area.app.getAreas().length;
        var newArea = new Rectangle(coords);
        Area.app.addEvent(Area.app.domElements.container, 'mousemove', newArea.onProcessDrawing.bind(newArea))
            .addEvent(Area.app.domElements.container, 'click', newArea.onStopDrawing.bind(newArea));
        return newArea;
    };
    return Rectangle;
}(Area));
//# sourceMappingURL=rectangle.class.js.map