(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/forms')) :
    typeof define === 'function' && define.amd ? define('ng2-image-map-editor', ['exports', '@angular/core', '@angular/forms'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['ng2-image-map-editor'] = {}, global.ng.core, global.ng.forms));
}(this, (function (exports, i0, forms) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                }
            });
        }
        n['default'] = e;
        return Object.freeze(n);
    }

    var i0__namespace = /*#__PURE__*/_interopNamespace(i0);

    var Utils = /** @class */ (function () {
        function Utils() {
        }
        /**
         * Returns offset from html page top-left corner for some element
         *
         * @param node {HTMLElement} - html element
         * @returns {Object} - object with offsets, e.g. {x: 100, y: 200}
         */
        Utils.getOffset = function (node) {
            var boxCoords = node.getBoundingClientRect();
            return {
                x: Math.round(boxCoords.left + window.pageXOffset),
                y: Math.round(boxCoords.top + window.pageYOffset)
            };
        };
        /**
         * Returns correct coordinates (incl. offsets)
         *
         * @param x {number} - x-coordinate
         * @param y {number} - y-coordinate
         * @returns {Object} - object with recalculated coordinates, e.g. {x: 100, y: 200}
         */
        Utils.getRightCoords = function (x, y) {
            return {
                x: x - Utils.app.getOffset('x'),
                y: y - Utils.app.getOffset('y')
            };
        };
        /**
         * TODO: will use same method of app.js
         * @deprecated
         */
        Utils.id = function (str) {
            return document.getElementById(str);
        };
        /**
         * TODO: will use same method of app.js
         * @deprecated
         */
        Utils.hide = function (node) {
            node.style.display = 'none';
            return this;
        };
        /**
         * TODO: will use same method of app.js
         * @deprecated
         */
        Utils.show = function (node) {
            node.style.display = 'block';
            return this;
        };
        /**
         * Escape < and > (for code output)
         *
         * @param str {string} - a string with < and >
         * @returns {string} - a string with escaped < and >
         */
        Utils.encode = function (str) {
            return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        };
        /**
         * TODO: will use same method of app.js
         * @deprecated
         */
        Utils.foreach = function (arr, func) {
            for (var i = 0, count = arr.length; i < count; i++) {
                func(arr[i], i);
            }
        };
        /**
         * TODO: will use same method of app.js
         * @deprecated
         */
        Utils.foreachReverse = function (arr, func) {
            for (var i = arr.length - 1; i >= 0; i--) {
                func(arr[i], i);
            }
        };
        /**
         * TODO: will use same method of app.js
         * @deprecated
         */
        Utils.stopEvent = function (e) {
            e.stopPropagation();
            e.preventDefault();
            return this;
        };
        return Utils;
    }());

    var Help = /** @class */ (function () {
        function Help() {
            this.block = Utils.id('help');
            // console.log('this.block', this.block);
            this.overlay = Utils.id('overlay');
            this.close_button = this.block.querySelector('.close_button');
            this.overlay.addEventListener('click', this.hide.bind(this), false);
            this.close_button.addEventListener('click', this.hide.bind(this), false);
        }
        Help.prototype.hide = function () {
            Utils.hide(this.block);
            Utils.hide(this.overlay);
        };
        Help.prototype.show = function () {
            Utils.show(this.block);
            Utils.show(this.overlay);
        };
        return Help;
    }());

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2)
            for (var i = 0, l = from.length, ar; i < l; i++) {
                if (ar || !(i in from)) {
                    if (!ar)
                        ar = Array.prototype.slice.call(from, 0, i);
                    ar[i] = from[i];
                }
            }
        return to.concat(ar || from);
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m")
            throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    var Area = /** @class */ (function () {
        function Area(coords, type) {
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
                // type: this._type,//?????
                coords: this._params,
                attributes: this.attributes
            };
        };
        return Area;
    }());
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
    var Helper = /** @class */ (function () {
        function Helper(node, x, y, action) {
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
        return Helper;
    }());
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
    var Rectangle = /** @class */ (function (_super) {
        __extends(Rectangle, _super);
        function Rectangle(coords, type) {
            var _this = _super.call(this, coords, 'rectangle') || this;
            /**
             * @namespace
             * @property {number} x - Distance from the left edge of the image to the left side of the rectangle
             * @property {number} y - Distance from the top edge of the image to the top side of the rectangle
             * @property {number} width - Width of rectangle
             * @property {number} height - Height of rectangle
             */
            _this._params = {
                x: coords.x,
                y: coords.y,
                width: 0,
                height: 0
            };
            _this._el = document.createElementNS(Area.SVG_NS, 'rect');
            _this._groupEl.appendChild(_this._el);
            var x = coords.x - _this._params.width / 2, y = coords.y - _this._params.height / 2;
            _this._helpers = {
                number: new Helper(_this._groupEl, x, y, 'number'),
                center: new Helper(_this._groupEl, x, y, 'move'),
                top: new Helper(_this._groupEl, x, y, 'editTop'),
                bottom: new Helper(_this._groupEl, x, y, 'editBottom'),
                left: new Helper(_this._groupEl, x, y, 'editLeft'),
                right: new Helper(_this._groupEl, x, y, 'editRight'),
                topLeft: new Helper(_this._groupEl, x, y, 'editTopLeft'),
                topRight: new Helper(_this._groupEl, x, y, 'editTopRight'),
                bottomLeft: new Helper(_this._groupEl, x, y, 'editBottomLeft'),
                bottomRight: new Helper(_this._groupEl, x, y, 'editBottomRight')
            };
            _this._helpers.number.setNumber(coords.n);
            _this.select().redraw();
            /* Add this object to array of all objects */
            Area.app.addObject(_this);
            return _this;
        }
        /**
         * Set attributes for svg-elements of area by new parameters
         * -----top-----
         * |           |
         * ---center_y--
         * |           |
         * ---bottom----
         */
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
        /**
         * Changes area parameters by editing type and offsets
         *
         * @param {String} editingType - A type of editing
         * @returns {Object} - Object with changed parameters of area
         */
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
        Rectangle.prototype.toString = function () {
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
        /**
         * Returns true if coords array is valid for rectangles and false otherwise
         *
         * @static
         * @param coords {Array} - coords for new rectangle as array
         * @return {boolean}
         */
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
        /**
         * Creates new rectangle and add drawing handlers for DOM-elements
         *
         * @param coords {Object} coords
         * @returns created rectangle
         */
        Rectangle.createAndStartDrawing = function (coords) {
            coords.n = Area.app.getAreas().length;
            var newArea = new Rectangle(coords);
            Area.app.addEvent(Area.app.domElements.container, 'mousemove', newArea.onProcessDrawing.bind(newArea))
                .addEvent(Area.app.domElements.container, 'click', newArea.onStopDrawing.bind(newArea));
            return newArea;
        };
        return Rectangle;
    }(Area));

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
    var Circle = /** @class */ (function (_super) {
        __extends(Circle, _super);
        function Circle(coords, type) {
            var _this = _super.call(this, coords, 'circle') || this;
            /**
             * @namespace
             * @property {number} cx - Distance from the left edge of the image to the center of the circle
             * @property {number} cy - Distance from the top edge of the image to the center of the circle
             * @property {number} radius - Radius of the circle
             */
            _this._params = {
                cx: coords.x,
                cy: coords.y,
                radius: 0
            };
            _this._el = document.createElementNS(Area.SVG_NS, 'circle');
            _this._groupEl.appendChild(_this._el);
            _this._helpers = {
                number: new Helper(_this._groupEl, coords.x, coords.y, 'number'),
                center: new Helper(_this._groupEl, coords.x, coords.y, 'move'),
                top: new Helper(_this._groupEl, coords.x, coords.y, 'editTop'),
                bottom: new Helper(_this._groupEl, coords.x, coords.y, 'editBottom'),
                left: new Helper(_this._groupEl, coords.x, coords.y, 'editLeft'),
                right: new Helper(_this._groupEl, coords.x, coords.y, 'editRight')
            };
            _this._helpers.number.setNumber(coords.n);
            _this.select().redraw();
            Area.app.addObject(_this); //add this object to array of all objects
            return _this;
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
                /* params */
                cx: x0,
                cy: y0,
                radius: radius
            };
            this.setSVGAttributes(temp_params);
            return temp_params;
        };
        Circle.prototype.onProcessDrawing = function (e) {
            var coords = Utils.getRightCoords(e.pageX, e.pageY);
            this.dynamicDraw(coords.x, coords.y);
        };
        Circle.prototype.onStopDrawing = function (e) {
            var coords = Utils.getRightCoords(e.pageX, e.pageY);
            this.setParams(this.dynamicDraw(coords.x, coords.y)).deselect();
            Area.app.removeAllEvents()
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
            var editType = Area.app.getEditType();
            this.dynamicEdit(this.edit(editType, e.pageX - this.delta.x, e.pageY - this.delta.y));
        };
        Circle.prototype.onStopEditing = function (e) {
            var editType = Area.app.getEditType();
            this.setParams(this.dynamicEdit(this.edit(editType, e.pageX - this.delta.x, e.pageY - this.delta.y)));
            Area.app.removeAllEvents();
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
        /**
         * Returns true if coords array is valid for circles and false otherwise
         *
         * @static
         * @param coords {Array} - coords for new circle as array
         * @return {boolean}
         */
        Circle.testCoords = function (coords) {
            return coords.length === 3;
        };
        Circle.createFromSaved = function (params) {
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
        /**
         * Creates new circle and add drawing handlers for DOM-elements
         *
         * @param coords {Object} coords
         * @returns created circle
         */
        Circle.createAndStartDrawing = function (coords) {
            coords.n = Area.app.getAreas().length;
            var newArea = new Circle(coords);
            Area.app.addEvent(Area.app.domElements.container, 'mousemove', newArea.onProcessDrawing.bind(newArea))
                .addEvent(Area.app.domElements.container, 'click', newArea.onStopDrawing.bind(newArea));
            return newArea;
        };
        return Circle;
    }(Area));

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
    var Polygon = /** @class */ (function (_super) {
        __extends(Polygon, _super);
        function Polygon(coords, type) {
            var _this = _super.call(this, coords, 'polygon') || this;
            /**
             * @namespace
             * @property {array} points - Array of coordinates of polygon points
             */
            _this._params = {
                points: [coords.x, coords.y]
            };
            _this._el = document.createElementNS(Area.SVG_NS, 'polyline');
            _this._groupEl.appendChild(_this._el);
            _this._helpers = [
                new Helper(_this._groupEl, _this._params.points[0], _this._params.points[1], 'number'),
                (new Helper(_this._groupEl, _this._params.points[0], _this._params.points[1], 'pointMove')).setId(1)
            ];
            _this._helpers[0].setNumber(coords.n);
            _this.selected_point = -1;
            _this.select().redraw();
            Area.app.addObject(_this); //add this object to array of all objects
            return _this;
        }
        Polygon.prototype.setCoords = function (params) {
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
        };
        Polygon.prototype.setSVGAttributes = function (params) {
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
            var helper = new Helper(this._groupEl, x, y, 'pointMove');
            helper.setId(this._helpers.length);
            this._helpers.push(helper);
            this._params.points.push(x, y);
            this.redraw();
            return this;
        };
        Polygon.prototype.right_angle = function (x, y) {
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
            var coords = Utils.getRightCoords(e.pageX, e.pageY);
            this.dynamicDraw(coords.x, coords.y, e.shiftKey);
        };
        Polygon.prototype.onAddPointDrawing = function (e) {
            var coords = Utils.getRightCoords(e.pageX, e.pageY);
            if (e.shiftKey) {
                coords = this.right_angle(coords.x, coords.y);
            }
            this.addPoint(coords.x, coords.y);
        };
        Polygon.prototype.onStopDrawing = function (e) {
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
        };
        Polygon.prototype.redraw = function (params) {
            this.setSVGAttributes(params ? params : this._params);
            return this;
        };
        Polygon.prototype.move = function (x, y) {
            //var temp_params = Object.create(this._params);
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
            var editType = Area.app.getEditType();
            if (typeof this[editType] === 'function') {
                this.dynamicEdit(this[editType](e.pageX - this.delta.x, e.pageY - this.delta.y));
                this.delta.x = e.pageX;
                this.delta.y = e.pageY;
            }
        };
        Polygon.prototype.onStopEditing = function (e) {
            var editType = Area.app.getEditType();
            this.setParams(this.dynamicEdit(this[editType](e.pageX - this.delta.x, e.pageY - this.delta.y)));
            Area.app.removeAllEvents();
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
        /**
         * Returns true if coords array is valid for polygons and false otherwise
         *
         * @static
         * @param coords {Array} - coords for new polygon as array
         * @return {boolean}
         */
        Polygon.testCoords = function (coords) {
            return coords.length >= 6 && coords.length % 2 === 0;
        };
        Polygon.createFromSaved = function (params) {
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
        };
        /**
         * Creates new polygon and add drawing handlers for DOM-elements
         *
         * @param coords {Object} coords
         * @returns created polygon
         */
        Polygon.createAndStartDrawing = function (coords) {
            coords.n = Area.app.getAreas().length;
            var newArea = new Polygon(coords);
            Area.app.addEvent(Area.app.domElements.container, 'mousemove', newArea.onProcessDrawing.bind(newArea))
                .addEvent(Area.app.domElements.container, 'click', newArea.onAddPointDrawing.bind(newArea))
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
    }(Area));

    var AreaFactory = /** @class */ (function () {
        function AreaFactory() {
        }
        return AreaFactory;
    }());
    AreaFactory.CONSTRUCTORS = {
        rectangle: Rectangle,
        circle: Circle,
        polygon: Polygon
    };

    var AppEvent = /** @class */ (function () {
        function AppEvent(target, eventType, func) {
            this.target = target;
            this.eventType = eventType;
            this.func = func;
            target.addEventListener(eventType, func, false);
        }
        AppEvent.prototype.remove = function () {
            this.target.removeEventListener(this.eventType, this.func, false);
        };
        return AppEvent;
    }());

    /* Buttons and actions */
    var Buttons = /** @class */ (function () {
        function Buttons(app) {
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
        Buttons.prototype.deselectAll = function () {
            Utils.foreach(this.all, function (x) {
                x.classList.remove(Area.CLASS_NAMES.SELECTED);
            });
        };
        Buttons.prototype.selectOne = function (button) {
            this.deselectAll();
            button.classList.add(Area.CLASS_NAMES.SELECTED);
        };
        Buttons.prototype.onShapeButtonClick = function (e) {
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
        };
        Buttons.prototype.onClearButtonClick = function (e) {
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
        };
        Buttons.prototype.onToHtmlButtonClick = function (e) {
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
        };
        Buttons.prototype.onEditButtonClick = function (e) {
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
        };
        Buttons.prototype.onData = function (answers, areas) {
        };
        Buttons.prototype.onSetInvalid = function () {
        };
        Buttons.prototype.onShowHelpButtonClick = function (e) {
            this.app.help.show();
            e.preventDefault();
        };
        return Buttons;
    }());

    var CursorPositionInfo = /** @class */ (function () {
        function CursorPositionInfo() {
            this._coords_info = Utils.id('coords');
        }
        CursorPositionInfo.prototype.set = function (coords) {
            this._coords_info.innerHTML = 'x: ' + coords.x + ', ' + 'y: ' + coords.y;
        };
        CursorPositionInfo.prototype.empty = function () {
            this._coords_info.innerHTML = '';
        };
        return CursorPositionInfo;
    }());
    var EditorApp = /** @class */ (function () {
        function EditorApp() {
            var _this = this;
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
            this.domElements.container.addEventListener('mousedown', function (e) {
                e.preventDefault();
            }, false);
            /* Disable image dragging */
            this.domElements.img.addEventListener('dragstart', function (e) {
                e.preventDefault();
            }, false);
            this.cursor_position_info = new CursorPositionInfo();
            this.domElements.container.addEventListener('mousemove', function (e) {
                _this.cursor_position_info.set(Utils.getRightCoords(e.pageX, e.pageY));
            }, false);
            this.domElements.container.addEventListener('mouseleave', function () {
                _this.cursor_position_info.empty();
            }, false);
            this.domElements.container.addEventListener('mousedown', this.onSvgMousedown.bind(this), false);
            this.domElements.container.addEventListener('click', this.onSvgClick.bind(this), false);
            this.domElements.container.addEventListener('dblclick', this.onAreaDblClick.bind(this), false);
            this.domElements.editor.addEventListener('keydown', this.onDocumentKeyDown.bind(this), false);
            this.buttons = new Buttons(this);
        }
        EditorApp.prototype.recalcOffsetValues = function () {
            this.state.offset = Utils.getOffset(this.domElements.container);
        };
        /* Add mousedown event for svg */
        EditorApp.prototype.onSvgMousedown = function (e) {
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
        };
        /* Add click event for svg */
        EditorApp.prototype.onSvgClick = function (e) {
            if (this.state.appMode === 'drawing' && !this.state.isDraw && this.state.currentType) {
                // this.code.hide();
                this.setIsDraw(true);
                this.state.newArea = AreaFactory.CONSTRUCTORS[this.state.currentType].createAndStartDrawing(Utils.getRightCoords(e.pageX, e.pageY));
            }
        };
        /* Add dblclick event for svg */
        EditorApp.prototype.onAreaDblClick = function (e) {
            if (this.state.appMode === 'editing') {
                if (e.target.tagName === 'rect' || e.target.tagName === 'circle' || e.target.tagName === 'polygon') {
                    this.state.selectedArea = e.target.parentNode.obj;
                    // this.info.load(this.state.selectedArea, e.pageX, e.pageY);
                }
            }
        };
        /* Add keydown event for document */
        EditorApp.prototype.onDocumentKeyDown = function (e) {
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
        };
        EditorApp.prototype.hide = function () {
            Utils.hide(this.domElements.container);
            return this;
        };
        EditorApp.prototype.show = function () {
            Utils.show(this.domElements.container);
            return this;
        };
        EditorApp.prototype.setDimensions = function (width, height) {
            this.domElements.svg.setAttribute('width', width);
            this.domElements.svg.setAttribute('height', height);
            this.domElements.container.style.width = width + 'px';
            this.domElements.container.style.height = height + 'px';
            return this;
        };
        EditorApp.prototype.onImageLoaded = function (state) {
        };
        EditorApp.prototype.loadImage = function (url, width) {
            var _this = this;
            this.domElements.img.src = url;
            this.state.image.src = url;
            this.state.image.width = width;
            var tmp_arr = url.split('/');
            this.filename = tmp_arr[tmp_arr.length - 1];
            this.domElements.img.onload = function () {
                _this.show()
                    .setDimensions(_this.domElements.img.width, _this.domElements.img.height)
                    .recalcOffsetValues();
                _this.onImageLoaded(_this.state);
            };
            this.setFilename(this.filename);
            this.preview();
            return this;
        };
        EditorApp.prototype.preview = function () {
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
        };
        EditorApp.prototype.hidePreview = function () {
            Utils.show(this.domElements.svg);
            this.domElements.map.innerHTML = '';
            return this;
        };
        EditorApp.prototype.addNodeToSvg = function (node) {
            this.domElements.svg.appendChild(node);
            return this;
        };
        EditorApp.prototype.removeNodeFromSvg = function (node) {
            this.domElements.svg.removeChild(node);
            return this;
        };
        EditorApp.prototype.getOffset = function (arg) {
            switch (arg) {
                case 'x':
                case 'y':
                    return this.state.offset[arg];
            }
        };
        EditorApp.prototype.clear = function () {
            //remove all areas
            this.state.areas.length = 0;
            while (this.domElements.svg.childNodes[0]) {
                this.domElements.svg.removeChild(this.domElements.svg.childNodes[0]);
            }
            // this.code.hide();
            // this.info.unload();
            return this;
        };
        EditorApp.prototype.removeObject = function (obj) {
            var _this = this;
            Utils.foreach(this.state.areas, function (x, i) {
                if (x === obj) {
                    _this.state.areas.splice(i, 1);
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
        };
        EditorApp.prototype.deselectAll = function () {
            Utils.foreach(this.state.areas, function (x) {
                x.deselect();
            });
            return this;
        };
        EditorApp.prototype.getIsDraw = function () {
            return this.state.isDraw;
        };
        EditorApp.prototype.setIsDraw = function (arg) {
            this.state.isDraw = arg;
            return this;
        };
        EditorApp.prototype.setMode = function (arg) {
            this.onSetMode(arg);
            this.state.appMode = arg;
            return this;
        };
        EditorApp.prototype.getMode = function () {
            return this.state.appMode;
        };
        EditorApp.prototype.onSetMode = function (mode) {
        };
        EditorApp.prototype.onCurrentType = function (type) {
        };
        EditorApp.prototype.setShape = function (arg) {
            this.state.currentType = arg;
            this.onCurrentType(arg);
            return this;
        };
        EditorApp.prototype.getShape = function () {
            return this.state.currentType;
        };
        EditorApp.prototype.addObject = function (object) {
            this.state.areas.push(object);
            return this;
        };
        EditorApp.prototype.getNewArea = function () {
            return this.state.newArea;
        };
        EditorApp.prototype.resetNewArea = function () {
            this.state.newArea = null;
            return this;
        };
        EditorApp.prototype.getSelectedArea = function () {
            return this.state.selectedArea;
        };
        EditorApp.prototype.setSelectedArea = function (obj) {
            this.state.selectedArea = obj;
            return this;
        };
        EditorApp.prototype.getEditType = function () {
            return this.state.editType;
        };
        EditorApp.prototype.setFilename = function (str) {
            this.state.image.filename = str;
            return this;
        };
        EditorApp.prototype.setEditClass = function () {
            this.domElements.container.classList.remove('draw');
            this.domElements.container.classList.add('edit');
            return this;
        };
        EditorApp.prototype.setDrawClass = function () {
            this.domElements.container.classList.remove('edit');
            this.domElements.container.classList.add('draw');
            return this;
        };
        EditorApp.prototype.setDefaultClass = function () {
            this.domElements.container.classList.remove('edit');
            this.domElements.container.classList.remove('draw');
            return this;
        };
        EditorApp.prototype.addEvent = function (target, eventType, func) {
            this.state.events.push(new AppEvent(target, eventType, func));
            return this;
        };
        EditorApp.prototype.removeAllEvents = function () {
            Utils.foreach(this.state.events, function (x) {
                x.remove();
            });
            this.state.events.length = 0;
            return this;
        };
        // public loadJSON(str, width) {
        //     var obj = JSON.parse(str);
        //     this.loadImage(obj.img, width);
        //     return
        // }
        EditorApp.prototype.getAreas = function () {
            return this.state.areas;
        };
        EditorApp.prototype.getAreasJSON = function (scale) {
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
        };
        EditorApp.prototype.getHTMLCode = function (arg) {
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
        };
        return EditorApp;
    }());
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

    var _c0 = ["ng2-image-map-editor", ""];
    var Ng2ImageMapEditorDirective = /** @class */ (function () {
        function Ng2ImageMapEditorDirective() {
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
            this.onAnswersUpdated = new i0.EventEmitter();
            this.propagateChange = function (_) {
            };
        }
        Ng2ImageMapEditorDirective.prototype.validate = function (c) {
            if (this.valid) {
                return null;
            }
            return {
                required: true
            };
        };
        Ng2ImageMapEditorDirective.prototype.registerOnChange = function (fn) {
            this.propagateChange = fn;
        };
        Ng2ImageMapEditorDirective.prototype.registerOnTouched = function () {
            // console.log('registerOnTouched');
        };
        Ng2ImageMapEditorDirective.prototype.writeValue = function (value) {
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
        };
        Ng2ImageMapEditorDirective.prototype.ngOnInit = function () {
            var _this = this;
            this.labels = Ng2ImageMapEditorDirective.globalLabels;
            this.app = new EditorApp();
            Utils.app = this.app;
            Area.app = this.app;
            this.app.buttons.onSetInvalid = function () {
                _this.valid = false;
                _this.propagateChange([]);
            };
            this.app.buttons.onData = function (answers, areas) {
                _this.valid = true;
                _this.propagateChange(areas);
                _this.answers = answers;
                _this.onAnswersUpdated.emit(answers);
            };
            this.app.onCurrentType = function (type) {
                _this.currentType = type;
            };
            this.app.onSetMode = function (mode) {
                _this.isEditMode = mode == 'editing';
            };
            this.app.onImageLoaded = function (state) {
                // console.log('onImageLoaded');
                if (_this._value) {
                    var scale = 1;
                    if (state.image.width > _this.app.domElements.img.clientWidth) {
                        scale = Number((state.image.width / _this.app.domElements.img.clientWidth).toFixed(3));
                    }
                    else {
                        scale = 1;
                    }
                    // console.log('onImageLoaded', this._parsedValue, this.app.img.width, this.app.domElements.img.clientWidth);
                    // console.log('scale', scale );
                    // console.log('this.answers', this.answers);
                    if (_this._parsedValue && _this._parsedValue.areas) {
                        _this._parsedValue.areas.forEach(function (x, i) {
                            if (x.type in AreaFactory.CONSTRUCTORS) {
                                //adaptation coordinates in screen resolution
                                x.coords.forEach(function (item, i, arr) {
                                    x.coords[i] = Math.round(item / scale);
                                });
                                AreaFactory.CONSTRUCTORS[x.type].createFromSaved({
                                    coords: x.coords,
                                    href: x.href,
                                    alt: (_this.answers[i] != undefined && _this.answers[i].is_right) ? '1' : '0',
                                    title: (_this.answers[i] != undefined) ? _this.answers[i].body : x.title,
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
        };
        Ng2ImageMapEditorDirective.prototype.ngOnChanges = function (changes) {
            if (this.mainImageSrc && this.mainImageWidth && this.app && this._loadedImage != this.mainImageSrc) {
                this._loadedImage = this.mainImageSrc;
                this.app.loadImage(this.mainImageSrc, this.mainImageWidth);
                // console.log('ngOnChanges loadImage', this.mainImageSrc, this.mainImageWidth);
            }
        };
        return Ng2ImageMapEditorDirective;
    }());
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
    Ng2ImageMapEditorDirective.ɵcmp = /*@__PURE__*/ i0__namespace.ɵɵdefineComponent({ type: Ng2ImageMapEditorDirective, selectors: [["", "ng2-image-map-editor", ""]], inputs: { answers: "answers", mainImageSrc: ["src", "mainImageSrc"], mainImageWidth: ["width", "mainImageWidth"] }, outputs: { onAnswersUpdated: "onAnswersUpdated" }, features: [i0__namespace.ɵɵProvidersFeature([
                {
                    provide: forms.NG_VALUE_ACCESSOR,
                    useExisting: i0.forwardRef(function () { return Ng2ImageMapEditorDirective; }),
                    multi: true
                },
                {
                    provide: forms.NG_VALIDATORS,
                    useExisting: i0.forwardRef(function () { return Ng2ImageMapEditorDirective; }),
                    multi: true
                }
            ]), i0__namespace.ɵɵNgOnChangesFeature], attrs: _c0, decls: 114, vars: 36, consts: [["id", "wrapper"], ["id", "header"], ["id", "nav", 1, "clearfix"], [1, "float-left"], ["id", "to_html"], ["href", "#", 1, "btn-round-sm-default", 3, "title"], ["xmlns", "http://www.w3.org/2000/svg", "viewBox", "0 0 512 512"], ["d", "M305,148c11.046,0,20-8.954,20-20V90c0-11.046-8.954-20-20-20c-11.046,0-20,8.954-20,20v38\n                                                    C285,139.046,293.954,148,305,148z"], ["d", "M492,352c11.046,0,20-8.954,20-20V102c0-5.304-2.107-10.392-5.858-14.142l-82-82C420.392,2.107,415.304,0,410,0H80\n                                                    C35.888,0,0,35.888,0,80v352c0,44.112,35.888,80,80,80h352c44.112,0,80-35.888,80-80c0-11.046-8.954-20-20-20\n                                                    c-11.046,0-20,8.954-20,20c0,22.056-17.944,40-40,40V312c0-11.046-8.954-20-20-20H100c-11.046,0-20,8.954-20,20v160\n                                                    c-22.056,0-40-17.944-40-40V80c0-22.056,17.944-40,40-40v118c0,33.084,26.916,60,60,60h201c33.084,0,60-26.916,60-60V40h0.716\n                                                    L472,110.284V332C472,343.046,480.954,352,492,352z M120,332h272v140H120V332z M361,158c0,11.028-8.972,20-20,20H140\n                                                    c-11.028,0-20-8.972-20-20V40h241V158z"], ["id", "rectangle", "href", "#"], [3, "src"], ["href", "#", "id", "circle"], ["href", "#", "id", "polygon"], [1, "float-right"], ["id", "edit", 1, "btn"], ["href", "#", 3, "title"], ["d", "M481.996,30.006C462.647,10.656,436.922,0,409.559,0c-27.363,0-53.089,10.656-72.438,30.005L50.826,316.301\n                                            c-2.436,2.436-4.201,5.46-5.125,8.779L0.733,486.637c-1.939,6.968,0.034,14.441,5.163,19.542c3.8,3.78,8.892,5.821,14.106,5.821\n                                            c1.822,0,3.66-0.25,5.463-0.762l161.557-45.891c6.816-1.936,12.1-7.335,13.888-14.192c1.788-6.857-0.186-14.148-5.189-19.167\n                                            L93.869,329.827L331.184,92.511l88.258,88.258L237.768,361.948c-7.821,7.8-7.838,20.463-0.038,28.284\n                                            c7.799,7.822,20.464,7.838,28.284,0.039l215.98-215.392C501.344,155.53,512,129.805,512,102.442\n                                            C512,75.079,501.344,49.354,481.996,30.006z M143.395,436.158L48.827,463.02l26.485-95.152L143.395,436.158z M453.73,146.575\n                                            l-5.965,5.949l-88.296-88.297l5.938-5.938C377.2,46.495,392.88,40,409.559,40c16.679,0,32.358,6.495,44.152,18.29\n                                            C465.505,70.083,472,85.763,472,102.442C472,119.121,465.505,134.801,453.73,146.575z"], ["id", "clear", 1, "btn-round-sm-default"], ["d", "M472,83H351V60c0-33.084-26.916-60-60-60h-70c-33.084,0-60,26.916-60,60v23H40c-11.046,0-20,8.954-20,20s8.954,20,20,20\n                                                h20.712l24.374,315.987c0.007,0.092,0.015,0.185,0.023,0.278c1.816,19.924,10.954,38.326,25.73,51.816\n                                                C125.615,504.571,144.771,512,164.778,512h182.444c41.667,0,75.917-31.032,79.669-72.183\n                                                c1.003-11.001-7.101-20.731-18.101-21.734c-11.011-1.003-20.731,7.101-21.734,18.101C385.195,456.603,368.07,472,347.222,472\n                                                H164.778c-20.777,0-37.875-15.571-39.823-36.242L100.831,123h310.338l-17.082,221.462c-0.849,11.013,7.39,20.629,18.403,21.479\n                                                c0.524,0.04,1.043,0.06,1.56,0.06c10.347,0,19.11-7.974,19.919-18.463L451.288,123H472c11.046,0,20-8.954,20-20\n                                                S483.046,83,472,83z M311,83H201V60c0-11.028,8.972-20,20-20h70c11.028,0,20,8.972,20,20V83z"], ["d", "M165.127,163.019c-11.035,0.482-19.59,9.818-19.108,20.854l10,228.933c0.469,10.738,9.322,19.128,19.966,19.128\n                                                c0.294,0,0.591-0.006,0.888-0.02c11.035-0.482,19.59-9.818,19.108-20.854l-10-228.934\n                                                C185.499,171.092,176.145,162.523,165.127,163.019z"], ["d", "M326.019,182.127l-10,228.934c-0.482,11.035,8.073,20.372,19.108,20.854c0.297,0.013,0.593,0.02,0.888,0.02\n                                                c10.643,0,19.497-8.39,19.966-19.128l10-228.933c0.482-11.035-8.073-20.372-19.108-20.854\n                                                C335.856,162.527,326.501,171.092,326.019,182.127z"], ["d", "M236,183v228.933c0,11.046,8.954,20,20,20c11.046,0,20-8.954,20-20V183c0-11.046-8.954-20-20-20S236,171.954,236,183z"], ["id", "show_help"], ["href", "#", 1, "btn-round-sm-default"], ["version", "1.1", "id", "Capa_1", "xmlns", "http://www.w3.org/2000/svg", "x", "0px", "y", "0px", "viewBox", "0 0 512 512", 0, "xml", "space", "preserve", 2, "enable-background", "new 0 0 512 512"], ["cx", "256", "cy", "127", "r", "20"], ["d", "M437.02,74.98C388.667,26.629,324.38,0,256,0S123.333,26.629,74.98,74.98C26.629,123.333,0,187.62,0,256\n                                    s26.629,132.667,74.98,181.02C123.333,485.371,187.62,512,256,512c46.813,0,92.618-12.758,132.461-36.893\n                                    c9.448-5.724,12.467-18.022,6.744-27.469c-5.723-9.448-18.021-12.467-27.468-6.744C334.144,461.244,295.506,472,256,472\n                                    c-119.103,0-216-96.897-216-216S136.897,40,256,40s216,96.897,216,216c0,42.589-12.665,84.044-36.627,119.884\n                                    c-6.139,9.182-3.672,21.603,5.511,27.742c9.183,6.138,21.603,3.673,27.742-5.51C497.001,355.674,512,306.53,512,256\n                                    C512,187.62,485.371,123.333,437.02,74.98z"], ["d", "M256,187c-11.046,0-20,8.954-20,20v178c0,11.046,8.954,20,20,20s20-8.954,20-20V207C276,195.954,267.046,187,256,187z"], ["id", "coords"], ["id", "debug"], ["id", "image_wrapper"], ["id", "image"], ["src", "", "alt", "#", "id", "img"], ["xmlns", "http://www.w3.org/2000/svg", "version", "1.2", "baseProfile", "tiny", "id", "svg"], ["id", "from_html_wrapper"], ["id", "from_html_form"], ["title", "close", 1, "close_button"], ["for", "code_input"], ["id", "code_input"], ["id", "load_code_button"], ["id", "overlay"], ["id", "help"], [1, "txt"], [1, "key"]], template: function Ng2ImageMapEditorDirective_Template(rf, ctx) {
            if (rf & 1) {
                i0__namespace.ɵɵelementStart(0, "div", 0);
                i0__namespace.ɵɵelementStart(1, "header", 1);
                i0__namespace.ɵɵelementStart(2, "nav", 2);
                i0__namespace.ɵɵelementStart(3, "ul", 3);
                i0__namespace.ɵɵelementStart(4, "li", 4);
                i0__namespace.ɵɵelementStart(5, "a", 5);
                i0__namespace.ɵɵnamespaceSVG();
                i0__namespace.ɵɵelementStart(6, "svg", 6);
                i0__namespace.ɵɵelementStart(7, "g");
                i0__namespace.ɵɵelementStart(8, "g");
                i0__namespace.ɵɵelementStart(9, "g");
                i0__namespace.ɵɵelement(10, "path", 7);
                i0__namespace.ɵɵelement(11, "path", 8);
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵnamespaceHTML();
                i0__namespace.ɵɵelementStart(12, "li");
                i0__namespace.ɵɵelementStart(13, "a", 9);
                i0__namespace.ɵɵelement(14, "img", 10);
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementStart(15, "li");
                i0__namespace.ɵɵelementStart(16, "a", 11);
                i0__namespace.ɵɵelement(17, "img", 10);
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementStart(18, "li");
                i0__namespace.ɵɵelementStart(19, "a", 12);
                i0__namespace.ɵɵelement(20, "img", 10);
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementStart(21, "ul", 13);
                i0__namespace.ɵɵelementStart(22, "li", 14);
                i0__namespace.ɵɵelementStart(23, "a", 15);
                i0__namespace.ɵɵnamespaceSVG();
                i0__namespace.ɵɵelementStart(24, "svg", 6);
                i0__namespace.ɵɵelementStart(25, "g");
                i0__namespace.ɵɵelementStart(26, "g");
                i0__namespace.ɵɵelement(27, "path", 16);
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵnamespaceHTML();
                i0__namespace.ɵɵelementStart(28, "li", 17);
                i0__namespace.ɵɵelementStart(29, "a", 5);
                i0__namespace.ɵɵnamespaceSVG();
                i0__namespace.ɵɵelementStart(30, "svg", 6);
                i0__namespace.ɵɵelementStart(31, "g");
                i0__namespace.ɵɵelementStart(32, "g");
                i0__namespace.ɵɵelementStart(33, "g");
                i0__namespace.ɵɵelement(34, "path", 18);
                i0__namespace.ɵɵelement(35, "path", 19);
                i0__namespace.ɵɵelement(36, "path", 20);
                i0__namespace.ɵɵelement(37, "path", 21);
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵnamespaceHTML();
                i0__namespace.ɵɵelementStart(38, "li", 22);
                i0__namespace.ɵɵelementStart(39, "a", 23);
                i0__namespace.ɵɵnamespaceSVG();
                i0__namespace.ɵɵelementStart(40, "svg", 24);
                i0__namespace.ɵɵelementStart(41, "g");
                i0__namespace.ɵɵelementStart(42, "g");
                i0__namespace.ɵɵelementStart(43, "g");
                i0__namespace.ɵɵelement(44, "circle", 25);
                i0__namespace.ɵɵelement(45, "path", 26);
                i0__namespace.ɵɵelement(46, "path", 27);
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵnamespaceHTML();
                i0__namespace.ɵɵelement(47, "div", 28);
                i0__namespace.ɵɵelement(48, "div", 29);
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementStart(49, "div", 30);
                i0__namespace.ɵɵelementStart(50, "div", 31);
                i0__namespace.ɵɵelement(51, "img", 32);
                i0__namespace.ɵɵnamespaceSVG();
                i0__namespace.ɵɵelement(52, "svg", 33);
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵnamespaceHTML();
                i0__namespace.ɵɵelementStart(53, "div", 34);
                i0__namespace.ɵɵelementStart(54, "form", 35);
                i0__namespace.ɵɵelementStart(55, "h5");
                i0__namespace.ɵɵtext(56, "Loading areas");
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelement(57, "span", 36);
                i0__namespace.ɵɵelementStart(58, "p");
                i0__namespace.ɵɵelementStart(59, "label", 37);
                i0__namespace.ɵɵtext(60, "Enter your html code:");
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelement(61, "textarea", 38);
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementStart(62, "button", 39);
                i0__namespace.ɵɵtext(63, "Load");
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelement(64, "div", 40);
                i0__namespace.ɵɵelementStart(65, "div", 41);
                i0__namespace.ɵɵelement(66, "span", 36);
                i0__namespace.ɵɵelementStart(67, "div", 42);
                i0__namespace.ɵɵelementStart(68, "section");
                i0__namespace.ɵɵelementStart(69, "h2");
                i0__namespace.ɵɵtext(70);
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementStart(71, "p");
                i0__namespace.ɵɵelementStart(72, "span", 43);
                i0__namespace.ɵɵtext(73, "ENTER");
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵtext(74);
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementStart(75, "p");
                i0__namespace.ɵɵelementStart(76, "span", 43);
                i0__namespace.ɵɵtext(77, "ESC");
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵtext(78);
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementStart(79, "p");
                i0__namespace.ɵɵelementStart(80, "span", 43);
                i0__namespace.ɵɵtext(81, "SHIFT");
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵtext(82);
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementStart(83, "section");
                i0__namespace.ɵɵelementStart(84, "h2");
                i0__namespace.ɵɵtext(85);
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementStart(86, "p");
                i0__namespace.ɵɵelementStart(87, "span", 43);
                i0__namespace.ɵɵtext(88, "DELETE");
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵtext(89);
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementStart(90, "p");
                i0__namespace.ɵɵelementStart(91, "span", 43);
                i0__namespace.ɵɵtext(92, "ESC");
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵtext(93);
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementStart(94, "p");
                i0__namespace.ɵɵelementStart(95, "span", 43);
                i0__namespace.ɵɵtext(96, "SHIFT");
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵtext(97);
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementStart(98, "p");
                i0__namespace.ɵɵelementStart(99, "span", 43);
                i0__namespace.ɵɵtext(100, "\u2191");
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵtext(101);
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementStart(102, "p");
                i0__namespace.ɵɵelementStart(103, "span", 43);
                i0__namespace.ɵɵtext(104, "\u2193");
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵtext(105);
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementStart(106, "p");
                i0__namespace.ɵɵelementStart(107, "span", 43);
                i0__namespace.ɵɵtext(108, "\u2190");
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵtext(109);
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementStart(110, "p");
                i0__namespace.ɵɵelementStart(111, "span", 43);
                i0__namespace.ɵɵtext(112, "\u2192");
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵtext(113);
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
                i0__namespace.ɵɵelementEnd();
            }
            if (rf & 2) {
                i0__namespace.ɵɵadvance(5);
                i0__namespace.ɵɵclassProp("btn-round-sm-primary", !ctx.valid);
                i0__namespace.ɵɵpropertyInterpolate("title", ctx.labels.save_answers);
                i0__namespace.ɵɵadvance(8);
                i0__namespace.ɵɵclassProp("btn-round-sm-default", ctx.currentType != "rectangle")("btn-round-sm-primary", ctx.currentType == "rectangle");
                i0__namespace.ɵɵadvance(1);
                i0__namespace.ɵɵproperty("src", ctx.icons.rectangle, i0__namespace.ɵɵsanitizeUrl);
                i0__namespace.ɵɵadvance(2);
                i0__namespace.ɵɵclassProp("btn-round-sm-default", ctx.currentType != "circle")("btn-round-sm-primary", ctx.currentType == "circle");
                i0__namespace.ɵɵadvance(1);
                i0__namespace.ɵɵproperty("src", ctx.icons.circle, i0__namespace.ɵɵsanitizeUrl);
                i0__namespace.ɵɵadvance(2);
                i0__namespace.ɵɵclassProp("btn-round-sm-default", ctx.currentType != "polygon")("btn-round-sm-primary", ctx.currentType == "polygon");
                i0__namespace.ɵɵadvance(1);
                i0__namespace.ɵɵproperty("src", ctx.icons.polygon, i0__namespace.ɵɵsanitizeUrl);
                i0__namespace.ɵɵadvance(3);
                i0__namespace.ɵɵclassProp("btn-round-sm-default", !ctx.isEditMode)("btn-round-sm-primary", ctx.isEditMode);
                i0__namespace.ɵɵpropertyInterpolate("title", ctx.labels.edit);
                i0__namespace.ɵɵadvance(6);
                i0__namespace.ɵɵpropertyInterpolate("title", ctx.labels.clear);
                i0__namespace.ɵɵadvance(41);
                i0__namespace.ɵɵtextInterpolate(ctx.labels.drawing_mode);
                i0__namespace.ɵɵadvance(4);
                i0__namespace.ɵɵtextInterpolate1(" \u2014 ", ctx.labels.drawing_mode_enter, "");
                i0__namespace.ɵɵadvance(4);
                i0__namespace.ɵɵtextInterpolate1(" \u2014 ", ctx.labels.drawing_mode_esc, "");
                i0__namespace.ɵɵadvance(4);
                i0__namespace.ɵɵtextInterpolate1(" \u2014 ", ctx.labels.drawing_mode_shift, "");
                i0__namespace.ɵɵadvance(3);
                i0__namespace.ɵɵtextInterpolate(ctx.labels.editing_mode);
                i0__namespace.ɵɵadvance(4);
                i0__namespace.ɵɵtextInterpolate1(" \u2014 ", ctx.labels.editing_mode_delete, "");
                i0__namespace.ɵɵadvance(4);
                i0__namespace.ɵɵtextInterpolate1(" \u2014 ", ctx.labels.editing_mode_esc, "");
                i0__namespace.ɵɵadvance(4);
                i0__namespace.ɵɵtextInterpolate1(" \u2014 ", ctx.labels.editing_mode_shift, "");
                i0__namespace.ɵɵadvance(4);
                i0__namespace.ɵɵtextInterpolate1(" \u2014 ", ctx.labels.editing_mode_up, "");
                i0__namespace.ɵɵadvance(4);
                i0__namespace.ɵɵtextInterpolate1(" \u2014 ", ctx.labels.editing_mode_down, "");
                i0__namespace.ɵɵadvance(4);
                i0__namespace.ɵɵtextInterpolate1(" \u2014 ", ctx.labels.editing_mode_left, "");
                i0__namespace.ɵɵadvance(4);
                i0__namespace.ɵɵtextInterpolate1(" \u2014 ", ctx.labels.editing_mode_right, "");
            }
        }, encapsulation: 2 });
    (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && i0__namespace.ɵsetClassMetadata(Ng2ImageMapEditorDirective, [{
                type: i0.Component,
                args: [{
                        selector: '[ng2-image-map-editor]',
                        template: "\n        <div id=\"wrapper\">\n            <header id=\"header\">\n                <nav id=\"nav\" class=\"clearfix\">\n                    <ul class=\"float-left\">\n                        <li id=\"to_html\">\n                            <a [class.btn-round-sm-primary]=\"!valid\" class=\"btn-round-sm-default\" href=\"#\"\n                               title=\"{{labels.save_answers}}\">\n                                <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\">\n                                    <g>\n                                        <g>\n                                            <g>\n                                                <path d=\"M305,148c11.046,0,20-8.954,20-20V90c0-11.046-8.954-20-20-20c-11.046,0-20,8.954-20,20v38\n                                                    C285,139.046,293.954,148,305,148z\"/>\n                                                <path d=\"M492,352c11.046,0,20-8.954,20-20V102c0-5.304-2.107-10.392-5.858-14.142l-82-82C420.392,2.107,415.304,0,410,0H80\n                                                    C35.888,0,0,35.888,0,80v352c0,44.112,35.888,80,80,80h352c44.112,0,80-35.888,80-80c0-11.046-8.954-20-20-20\n                                                    c-11.046,0-20,8.954-20,20c0,22.056-17.944,40-40,40V312c0-11.046-8.954-20-20-20H100c-11.046,0-20,8.954-20,20v160\n                                                    c-22.056,0-40-17.944-40-40V80c0-22.056,17.944-40,40-40v118c0,33.084,26.916,60,60,60h201c33.084,0,60-26.916,60-60V40h0.716\n                                                    L472,110.284V332C472,343.046,480.954,352,492,352z M120,332h272v140H120V332z M361,158c0,11.028-8.972,20-20,20H140\n                                                    c-11.028,0-20-8.972-20-20V40h241V158z\"/>\n                                            </g>\n                                        </g>\n                                    </g>\n                                </svg>\n                            </a>\n                        </li>\n                        <li><a [class.btn-round-sm-default]=\"currentType != 'rectangle'\"\n                               [class.btn-round-sm-primary]=\"currentType == 'rectangle'\" id=\"rectangle\" href=\"#\"><img\n                                [src]=\"icons.rectangle\"></a></li>\n                        <li><a [class.btn-round-sm-default]=\"currentType != 'circle'\"\n                               [class.btn-round-sm-primary]=\"currentType == 'circle'\" href=\"#\" id=\"circle\"><img\n                                [src]=\"icons.circle\"></a></li>\n                        <li><a [class.btn-round-sm-default]=\"currentType != 'polygon'\"\n                               [class.btn-round-sm-primary]=\"currentType == 'polygon'\" href=\"#\" id=\"polygon\"><img\n                                [src]=\"icons.polygon\"></a></li>\n                    </ul>\n                    <ul class=\"float-right\">\n                        <li class=\"btn\" id=\"edit\">\n                            <a [class.btn-round-sm-default]=\"!isEditMode\" title=\"{{labels.edit}}\"\n                               [class.btn-round-sm-primary]=\"isEditMode\" href=\"#\">\n                                <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\">\n                                    <g>\n                                        <g>\n                                            <path d=\"M481.996,30.006C462.647,10.656,436.922,0,409.559,0c-27.363,0-53.089,10.656-72.438,30.005L50.826,316.301\n                                            c-2.436,2.436-4.201,5.46-5.125,8.779L0.733,486.637c-1.939,6.968,0.034,14.441,5.163,19.542c3.8,3.78,8.892,5.821,14.106,5.821\n                                            c1.822,0,3.66-0.25,5.463-0.762l161.557-45.891c6.816-1.936,12.1-7.335,13.888-14.192c1.788-6.857-0.186-14.148-5.189-19.167\n                                            L93.869,329.827L331.184,92.511l88.258,88.258L237.768,361.948c-7.821,7.8-7.838,20.463-0.038,28.284\n                                            c7.799,7.822,20.464,7.838,28.284,0.039l215.98-215.392C501.344,155.53,512,129.805,512,102.442\n                                            C512,75.079,501.344,49.354,481.996,30.006z M143.395,436.158L48.827,463.02l26.485-95.152L143.395,436.158z M453.73,146.575\n                                            l-5.965,5.949l-88.296-88.297l5.938-5.938C377.2,46.495,392.88,40,409.559,40c16.679,0,32.358,6.495,44.152,18.29\n                                            C465.505,70.083,472,85.763,472,102.442C472,119.121,465.505,134.801,453.73,146.575z\"/>\n                                        </g>\n                                    </g>\n                                </svg>\n                            </a>\n                        </li>\n                        <li class=\"btn-round-sm-default\" id=\"clear\">\n                            <a class=\"btn-round-sm-default\" href=\"#\" title=\"{{labels.clear}}\">\n                                <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\">\n                                    <g>\n                                        <g>\n                                            <g>\n                                                <path d=\"M472,83H351V60c0-33.084-26.916-60-60-60h-70c-33.084,0-60,26.916-60,60v23H40c-11.046,0-20,8.954-20,20s8.954,20,20,20\n                                                h20.712l24.374,315.987c0.007,0.092,0.015,0.185,0.023,0.278c1.816,19.924,10.954,38.326,25.73,51.816\n                                                C125.615,504.571,144.771,512,164.778,512h182.444c41.667,0,75.917-31.032,79.669-72.183\n                                                c1.003-11.001-7.101-20.731-18.101-21.734c-11.011-1.003-20.731,7.101-21.734,18.101C385.195,456.603,368.07,472,347.222,472\n                                                H164.778c-20.777,0-37.875-15.571-39.823-36.242L100.831,123h310.338l-17.082,221.462c-0.849,11.013,7.39,20.629,18.403,21.479\n                                                c0.524,0.04,1.043,0.06,1.56,0.06c10.347,0,19.11-7.974,19.919-18.463L451.288,123H472c11.046,0,20-8.954,20-20\n                                                S483.046,83,472,83z M311,83H201V60c0-11.028,8.972-20,20-20h70c11.028,0,20,8.972,20,20V83z\"/>\n                                                <path d=\"M165.127,163.019c-11.035,0.482-19.59,9.818-19.108,20.854l10,228.933c0.469,10.738,9.322,19.128,19.966,19.128\n                                                c0.294,0,0.591-0.006,0.888-0.02c11.035-0.482,19.59-9.818,19.108-20.854l-10-228.934\n                                                C185.499,171.092,176.145,162.523,165.127,163.019z\"/>\n                                                <path d=\"M326.019,182.127l-10,228.934c-0.482,11.035,8.073,20.372,19.108,20.854c0.297,0.013,0.593,0.02,0.888,0.02\n                                                c10.643,0,19.497-8.39,19.966-19.128l10-228.933c0.482-11.035-8.073-20.372-19.108-20.854\n                                                C335.856,162.527,326.501,171.092,326.019,182.127z\"/>\n                                                <path d=\"M236,183v228.933c0,11.046,8.954,20,20,20c11.046,0,20-8.954,20-20V183c0-11.046-8.954-20-20-20S236,171.954,236,183z\"/>\n                                            </g>\n                                        </g>\n                                    </g>\n                                </svg>\n                            </a>\n                        </li>\n                        <li id=\"show_help\">\n                            <a class=\"btn-round-sm-default\" href=\"#\">\n                                <svg version=\"1.1\" id=\"Capa_1\" xmlns=\"http://www.w3.org/2000/svg\" x=\"0px\" y=\"0px\"\n                                     viewBox=\"0 0 512 512\" style=\"enable-background:new 0 0 512 512;\"\n                                     xml:space=\"preserve\">\n                        <g>\n                            <g>\n                                <g>\n                                    <circle cx=\"256\" cy=\"127\" r=\"20\"/>\n                                    <path d=\"M437.02,74.98C388.667,26.629,324.38,0,256,0S123.333,26.629,74.98,74.98C26.629,123.333,0,187.62,0,256\n                                    s26.629,132.667,74.98,181.02C123.333,485.371,187.62,512,256,512c46.813,0,92.618-12.758,132.461-36.893\n                                    c9.448-5.724,12.467-18.022,6.744-27.469c-5.723-9.448-18.021-12.467-27.468-6.744C334.144,461.244,295.506,472,256,472\n                                    c-119.103,0-216-96.897-216-216S136.897,40,256,40s216,96.897,216,216c0,42.589-12.665,84.044-36.627,119.884\n                                    c-6.139,9.182-3.672,21.603,5.511,27.742c9.183,6.138,21.603,3.673,27.742-5.51C497.001,355.674,512,306.53,512,256\n                                    C512,187.62,485.371,123.333,437.02,74.98z\"/>\n                                    <path d=\"M256,187c-11.046,0-20,8.954-20,20v178c0,11.046,8.954,20,20,20s20-8.954,20-20V207C276,195.954,267.046,187,256,187z\"/>\n                                </g>\n                            </g>\n                        </g>\n                    </svg>\n                            </a>\n                        </li>\n                    </ul>\n                </nav>\n                <div id=\"coords\"></div>\n                <div id=\"debug\"></div>\n            </header>\n            <div id=\"image_wrapper\">\n                <div id=\"image\">\n                    <img src=\"\" alt=\"#\" id=\"img\"/>\n                    <svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.2\" baseProfile=\"tiny\" id=\"svg\"></svg>\n                </div>\n            </div>\n        </div>\n\n        <!-- From html block -->\n        <div id=\"from_html_wrapper\">\n            <form id=\"from_html_form\">\n                <h5>Loading areas</h5>\n                <span class=\"close_button\" title=\"close\"></span>\n                <p>\n                    <label for=\"code_input\">Enter your html code:</label>\n                    <textarea id=\"code_input\"></textarea>\n                </p>\n                <button id=\"load_code_button\">Load</button>\n            </form>\n        </div>\n        <!-- Get image form -->\n\n        <!-- Help block    {{''|translate}} -->\n        <div id=\"overlay\"></div>\n        <div id=\"help\">\n            <span class=\"close_button\" title=\"close\"></span>\n            <div class=\"txt\">\n                <section>\n                    <h2>{{labels.drawing_mode}}</h2>\n                    <p><span class=\"key\">ENTER</span> &mdash; {{labels.drawing_mode_enter}}</p>\n                    <p><span class=\"key\">ESC</span> &mdash; {{labels.drawing_mode_esc}}</p>\n                    <p><span class=\"key\">SHIFT</span> &mdash; {{labels.drawing_mode_shift}}</p>\n                </section>\n                <section>\n                    <h2>{{labels.editing_mode}}</h2>\n                    <p><span class=\"key\">DELETE</span> &mdash; {{labels.editing_mode_delete}}</p>\n                    <p><span class=\"key\">ESC</span> &mdash; {{labels.editing_mode_esc}}</p>\n                    <p><span class=\"key\">SHIFT</span> &mdash; {{labels.editing_mode_shift}}</p>\n                    <p><span class=\"key\">&uarr;</span> &mdash; {{labels.editing_mode_up}}</p>\n                    <p><span class=\"key\">&darr;</span> &mdash; {{labels.editing_mode_down}}</p>\n                    <p><span class=\"key\">&larr;</span> &mdash; {{labels.editing_mode_left}}</p>\n                    <p><span class=\"key\">&rarr;</span> &mdash; {{labels.editing_mode_right}}</p>\n                </section>\n            </div>\n        </div>",
                        providers: [
                            {
                                provide: forms.NG_VALUE_ACCESSOR,
                                useExisting: i0.forwardRef(function () { return Ng2ImageMapEditorDirective; }),
                                multi: true
                            },
                            {
                                provide: forms.NG_VALIDATORS,
                                useExisting: i0.forwardRef(function () { return Ng2ImageMapEditorDirective; }),
                                multi: true
                            }
                        ]
                    }]
            }], function () { return []; }, { answers: [{
                    type: i0.Input,
                    args: ['answers']
                }], mainImageSrc: [{
                    type: i0.Input,
                    args: ['src']
                }], mainImageWidth: [{
                    type: i0.Input,
                    args: ['width']
                }], onAnswersUpdated: [{
                    type: i0.Output
                }] });
    })();

    var Ng2ImageMapEditorModule = /** @class */ (function () {
        function Ng2ImageMapEditorModule() {
        }
        return Ng2ImageMapEditorModule;
    }());
    Ng2ImageMapEditorModule.ɵfac = function Ng2ImageMapEditorModule_Factory(t) { return new (t || Ng2ImageMapEditorModule)(); };
    Ng2ImageMapEditorModule.ɵmod = /*@__PURE__*/ i0__namespace.ɵɵdefineNgModule({ type: Ng2ImageMapEditorModule });
    Ng2ImageMapEditorModule.ɵinj = /*@__PURE__*/ i0__namespace.ɵɵdefineInjector({ imports: [[]] });
    (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && i0__namespace.ɵsetClassMetadata(Ng2ImageMapEditorModule, [{
                type: i0.NgModule,
                args: [{
                        imports: [],
                        declarations: [
                            Ng2ImageMapEditorDirective
                        ],
                        exports: [
                            Ng2ImageMapEditorDirective
                        ]
                    }]
            }], null, null);
    })();
    (function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0__namespace.ɵɵsetNgModuleScope(Ng2ImageMapEditorModule, { declarations: [Ng2ImageMapEditorDirective], exports: [Ng2ImageMapEditorDirective] }); })();

    /**
     * Generated bundle index. Do not edit.
     */

    exports.Ng2ImageMapEditorDirective = Ng2ImageMapEditorDirective;
    exports.Ng2ImageMapEditorModule = Ng2ImageMapEditorModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ng2-image-map-editor.umd.js.map
