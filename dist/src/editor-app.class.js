"use strict";
var utils_class_1 = require('./utils.class');
var help_class_1 = require('./help.class');
var area_factory_class_1 = require('./area-factory.class');
var app_event_class_1 = require('./app-event.class');
var buttons_class_1 = require('./buttons.class');
var CursorPositionInfo = (function () {
    function CursorPositionInfo() {
        this._coords_info = utils_class_1.Utils.id('coords');
    }
    CursorPositionInfo.prototype.set = function (coords) {
        this._coords_info.innerHTML = 'x: ' + coords.x + ', ' + 'y: ' + coords.y;
    };
    CursorPositionInfo.prototype.empty = function () {
        this._coords_info.innerHTML = '';
    };
    return CursorPositionInfo;
}());
exports.CursorPositionInfo = CursorPositionInfo;
var EditorApp = (function () {
    function EditorApp() {
        var _this = this;
        this.domElements = {
            wrapper: utils_class_1.Utils.id('wrapper'),
            svg: utils_class_1.Utils.id('svg'),
            img: utils_class_1.Utils.id('img'),
            container: utils_class_1.Utils.id('image'),
            map: null,
            editor: utils_class_1.Utils.id('editor')
        };
        this.img = utils_class_1.Utils.id('img');
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
        this.help = new help_class_1.Help();
        this.filename = null;
        window.addEventListener('resize', this.recalcOffsetValues, false);
        this.domElements.container.addEventListener('mousedown', function (e) {
            e.preventDefault();
        }, false);
        this.domElements.img.addEventListener('dragstart', function (e) {
            e.preventDefault();
        }, false);
        this.cursor_position_info = new CursorPositionInfo();
        this.domElements.container.addEventListener('mousemove', function (e) {
            _this.cursor_position_info.set(utils_class_1.Utils.getRightCoords(e.pageX, e.pageY));
        }, false);
        this.domElements.container.addEventListener('mouseleave', function () {
            _this.cursor_position_info.empty();
        }, false);
        this.domElements.container.addEventListener('mousedown', this.onSvgMousedown.bind(this), false);
        this.domElements.container.addEventListener('click', this.onSvgClick.bind(this), false);
        this.domElements.container.addEventListener('dblclick', this.onAreaDblClick.bind(this), false);
        this.domElements.editor.addEventListener('keydown', this.onDocumentKeyDown.bind(this), false);
        this.buttons = new buttons_class_1.Buttons(this);
    }
    EditorApp.prototype.recalcOffsetValues = function () {
        this.state.offset = utils_class_1.Utils.getOffset(this.domElements.container);
    };
    EditorApp.prototype.onSvgMousedown = function (e) {
        if (this.state.appMode === 'editing') {
            if (e.target.parentNode.tagName === 'g') {
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
                    if (helper.n >= 0) {
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
            }
        }
    };
    EditorApp.prototype.onSvgClick = function (e) {
        if (this.state.appMode === 'drawing' && !this.state.isDraw && this.state.currentType) {
            this.setIsDraw(true);
            this.state.newArea = area_factory_class_1.AreaFactory.CONSTRUCTORS[this.state.currentType].createAndStartDrawing(utils_class_1.Utils.getRightCoords(e.pageX, e.pageY));
        }
    };
    EditorApp.prototype.onAreaDblClick = function (e) {
        if (this.state.appMode === 'editing') {
            if (e.target.tagName === 'rect' || e.target.tagName === 'circle' || e.target.tagName === 'polygon') {
                this.state.selectedArea = e.target.parentNode.obj;
            }
        }
    };
    EditorApp.prototype.onDocumentKeyDown = function (e) {
        var ctrlDown = e.ctrlKey || e.metaKey;
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
                }
                break;
            case EditorApp.KEYS.I:
                if (this.state.appMode === 'editing' && this.state.selectedArea) {
                    var params = this.state.selectedArea.params, x = params.x || params.cx || params[0], y = params.y || params.cy || params[1];
                }
                break;
            case EditorApp.KEYS.C:
                if (this.state.appMode === 'editing' && this.state.selectedArea && ctrlDown) {
                    var Constructor = area_factory_class_1.AreaFactory.CONSTRUCTORS[area_params.type], area_params = this.state.selectedArea.toJSON();
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
        utils_class_1.Utils.hide(this.domElements.container);
        return this;
    };
    EditorApp.prototype.show = function () {
        utils_class_1.Utils.show(this.domElements.container);
        return this;
    };
    EditorApp.prototype.setDimensions = function (width, height) {
        this.domElements.svg.setAttribute('width', width);
        this.domElements.svg.setAttribute('height', height);
        this.domElements.container.style.width = width + 'px';
        this.domElements.container.style.height = height + 'px';
        return this;
    };
    EditorApp.prototype.onImageLoaded = function () {
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
            _this.onImageLoaded();
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
    };
    EditorApp.prototype.hidePreview = function () {
        utils_class_1.Utils.show(this.domElements.svg);
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
        this.state.areas.length = 0;
        while (this.domElements.svg.childNodes[0]) {
            this.domElements.svg.removeChild(this.domElements.svg.childNodes[0]);
        }
        return this;
    };
    EditorApp.prototype.removeObject = function (obj) {
        utils_class_1.Utils.foreach(this.state.areas, function (x, i) {
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
                    x.helpers.number.setNumber(i);
                    break;
            }
        });
        return this;
    };
    EditorApp.prototype.deselectAll = function () {
        utils_class_1.Utils.foreach(this.state.areas, function (x) {
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
        this.state.events.push(new app_event_class_1.AppEvent(target, eventType, func));
        return this;
    };
    EditorApp.prototype.removeAllEvents = function () {
        utils_class_1.Utils.foreach(this.state.events, function (x) {
            x.remove();
        });
        this.state.events.length = 0;
        return this;
    };
    EditorApp.prototype.loadJSON = function (str, width) {
        var obj = JSON.parse(str);
        this.loadImage(obj.img, width);
        return;
    };
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
        utils_class_1.Utils.foreach(this.state.areas, function (x) {
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
            html_code += utils_class_1.Utils.encode('<img src="' + this.state.image.filename + '" alt="" usemap="#map" />') +
                '<br />' + utils_class_1.Utils.encode('<map name="map">') + '<br />';
            utils_class_1.Utils.foreachReverse(this.state.areas, function (x) {
                html_code += '&nbsp;&nbsp;&nbsp;&nbsp;' + utils_class_1.Utils.encode(x.toString()) + '<br />';
            });
            html_code += utils_class_1.Utils.encode('</map>');
        }
        else {
            utils_class_1.Utils.foreachReverse(this.state.areas, function (x) {
                html_code += x.toString();
            });
        }
        return html_code;
    };
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
    return EditorApp;
}());
exports.EditorApp = EditorApp;
//# sourceMappingURL=editor-app.class.js.map