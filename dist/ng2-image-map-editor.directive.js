"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var editor_app_class_1 = require('./editor-app.class');
var utils_class_1 = require('./utils.class');
var area_class_1 = require('./area.class');
var area_factory_class_1 = require('./area-factory.class');
var Ng2ImageMapEditorDirective = (function () {
    function Ng2ImageMapEditorDirective() {
        this.answers = [];
        this.valid = true;
        this.isEditMode = false;
        this.currentType = '';
        this.icons = {
            rectangle: '/themes/default/assets/img/test/rec.png',
            circle: '/themes/default/assets/img/test/cir.png',
            polygon: '/themes/default/assets/img/test/pol.png'
        };
        this.labels = {};
        this._loadedImage = '';
        this.onAnswersUpdated = new core_1.EventEmitter();
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
            }
        }
    };
    Ng2ImageMapEditorDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.labels = Ng2ImageMapEditorDirective.globalLabels;
        this.app = new editor_app_class_1.EditorApp();
        utils_class_1.Utils.app = this.app;
        area_class_1.Area.app = this.app;
        this.app.buttons.onSetInvalid = function () {
            _this.valid = false;
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
            if (_this._value) {
                var scale = 1;
                if (state.image.width > _this.app.domElements.img.clientWidth) {
                    scale = Number((state.image.width / _this.app.domElements.img.clientWidth).toFixed(3)) + 0.03;
                }
                else {
                    scale = 1.03;
                }
                utils_class_1.Utils.foreach(_this._parsedValue.areas, function (x, i, arr) {
                    if (x.type in area_factory_class_1.AreaFactory.CONSTRUCTORS) {
                        x.coords.forEach(function (item, i, arr) {
                            x.coords[i] = Math.round(item / scale);
                        });
                        area_factory_class_1.AreaFactory.CONSTRUCTORS[x.type].createFromSaved({
                            coords: x.coords,
                            href: x.href,
                            alt: (_this.answers[i] != undefined && _this.answers[i].is_right) ? '1' : '0',
                            title: (_this.answers[i] != undefined) ? _this.answers[i].body : x.title,
                            number: i
                        });
                    }
                });
            }
        };
        if (this.mainImageSrc && this.mainImageWidth && this._loadedImage != this.mainImageSrc) {
            this._loadedImage = this.mainImageSrc;
            this.app.loadImage(this.mainImageSrc, this.mainImageWidth);
        }
    };
    Ng2ImageMapEditorDirective.prototype.ngOnChanges = function (changes) {
        if (this.mainImageSrc && this.mainImageWidth && this.app && this._loadedImage != this.mainImageSrc) {
            this._loadedImage = this.mainImageSrc;
            this.app.loadImage(this.mainImageSrc, this.mainImageWidth);
        }
    };
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
    __decorate([
        core_1.Input('answers'), 
        __metadata('design:type', Array)
    ], Ng2ImageMapEditorDirective.prototype, "answers", void 0);
    __decorate([
        core_1.Input('src'), 
        __metadata('design:type', String)
    ], Ng2ImageMapEditorDirective.prototype, "mainImageSrc", void 0);
    __decorate([
        core_1.Input('width'), 
        __metadata('design:type', Number)
    ], Ng2ImageMapEditorDirective.prototype, "mainImageWidth", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], Ng2ImageMapEditorDirective.prototype, "onAnswersUpdated", void 0);
    Ng2ImageMapEditorDirective = __decorate([
        core_1.Component({
            selector: '[ng2-image-map-editor]',
            template: "<div id=\"wrapper\">\n    <header id=\"header\">\n        <nav id=\"nav\" class=\"clearfix\">\n            <ul class=\"float-left\">\n                <li id=\"to_html\"><a [class.btn-success]=\"!valid\" class=\"btn-success btn\" href=\"#\">{{labels.save_answers}}</a></li>\n                <li><a [class.btn-default]=\"currentType == 'rectangle'\" [class.btn]=\"currentType != 'rectangle'\" id=\"rectangle\" href=\"#\"><img [src]=\"icons.rectangle\"></a></li>\n                <li><a [class.btn-default]=\"currentType == 'circle'\" [class.btn]=\"currentType != 'circle'\" href=\"#\" id=\"circle\"><img [src]=\"icons.circle\"></a></li>\n                <li><a [class.btn-default]=\"currentType == 'polygon'\" [class.btn]=\"currentType != 'polygon'\" href=\"#\" id=\"polygon\"><img [src]=\"icons.polygon\"></a></li>\n            </ul>\n            <ul class=\"float-right\">\n                <li class=\"btn\" id=\"edit\">\n                    <a [class.btn-primary]=\"isEditMode\" [class.btn-default]=\"!isEditMode\" class=\"btn\" href=\"#\">\n                    <i [class.fa-toggle-on]=\"isEditMode\" [class.fa-toggle-off]=\"!isEditMode\" class=\"fa\" aria-hidden=\"true\"></i> {{labels.edit}}</a>\n                </li>\n                <li class=\"btn\" id=\"clear\"><a class=\"btn btn-default\" href=\"#\"><i class=\"fa fa-eraser\" aria-hidden=\"true\"></i> {{labels.clear}}</a></li>\n                <li class=\"btn\" id=\"show_help\"><a href=\"#\"><i class=\"fa fa-question-circle\" aria-hidden=\"true\"></i></a></li>\n            </ul>\n        </nav>\n        <div id=\"coords\"></div>\n        <div id=\"debug\"></div>\n    </header>\n    <div id=\"image_wrapper\">\n        <div id=\"image\">\n            <img src=\"\" alt=\"#\" id=\"img\" />\n            <svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.2\" baseProfile=\"tiny\" id=\"svg\"></svg>\n        </div>\n    </div>\n</div>\n\n<!-- From html block -->\n<div id=\"from_html_wrapper\">\n    <form id=\"from_html_form\">\n        <h5>Loading areas</h5>\n        <span class=\"close_button\" title=\"close\"></span>\n        <p>\n            <label for=\"code_input\">Enter your html code:</label>\n            <textarea id=\"code_input\"></textarea>\n        </p>\n        <button id=\"load_code_button\">Load</button>\n    </form>\n</div>\n<!-- Get image form -->\n\n<!-- Help block    {{''|translate}} -->\n<div id=\"overlay\"></div>\n<div id=\"help\">\n    <span class=\"close_button\" title=\"close\"></span>\n    <div class=\"txt\">\n        <section>\n            <h2>{{labels.drawing_mode}}</h2>\n            <p><span class=\"key\">ENTER</span> &mdash; {{labels.drawing_mode_enter}}</p>\n            <p><span class=\"key\">ESC</span> &mdash; {{labels.drawing_mode_esc}}</p>\n            <p><span class=\"key\">SHIFT</span> &mdash; {{labels.drawing_mode_shift}}</p>\n        </section>\n        <section>\n            <h2>{{labels.editing_mode}}</h2>\n            <p><span class=\"key\">DELETE</span> &mdash; {{labels.editing_mode_delete}}</p>\n            <p><span class=\"key\">ESC</span> &mdash; {{labels.editing_mode_esc}}</p>\n            <p><span class=\"key\">SHIFT</span> &mdash; {{labels.editing_mode_shift}}</p>\n            <p><span class=\"key\">&uarr;</span> &mdash; {{labels.editing_mode_up}}</p>\n            <p><span class=\"key\">&darr;</span> &mdash; {{labels.editing_mode_down}}</p>\n            <p><span class=\"key\">&larr;</span> &mdash; {{labels.editing_mode_left}}</p>\n            <p><span class=\"key\">&rarr;</span> &mdash; {{labels.editing_mode_right}}</p>\n        </section>\n    </div>\n</div>",
            providers: [
                {
                    provide: forms_1.NG_VALUE_ACCESSOR,
                    useExisting: core_1.forwardRef(function () { return Ng2ImageMapEditorDirective; }),
                    multi: true
                },
                {
                    provide: forms_1.NG_VALIDATORS,
                    useExisting: core_1.forwardRef(function () { return Ng2ImageMapEditorDirective; }),
                    multi: true
                }
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], Ng2ImageMapEditorDirective);
    return Ng2ImageMapEditorDirective;
}());
exports.Ng2ImageMapEditorDirective = Ng2ImageMapEditorDirective;
//# sourceMappingURL=ng2-image-map-editor.directive.js.map