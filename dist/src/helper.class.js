"use strict";
var area_class_1 = require('./area.class');
var Helper = (function () {
    function Helper(node, x, y, action) {
        if (action == 'number') {
            this._el = document.createElementNS(area_class_1.Area.SVG_NS, 'text');
        }
        else {
            this._el = document.createElementNS(area_class_1.Area.SVG_NS, 'rect');
        }
        this._el.classList.add(Helper.CLASS_NAME);
        if (action == 'number') {
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
    Helper.prototype.setCoords = function (x, y) {
        this._el.setAttribute('x', x + Helper.OFFSET);
        this._el.setAttribute('y', y + Helper.OFFSET);
        return this;
    };
    Helper.prototype.setNumber = function (id) {
        this._el.textContent = id + 1;
    };
    Helper.prototype.setId = function (id) {
        this._el.n = id;
        return this;
    };
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
    return Helper;
}());
exports.Helper = Helper;
//# sourceMappingURL=helper.class.js.map