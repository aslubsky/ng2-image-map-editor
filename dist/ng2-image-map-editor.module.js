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
var ng2_image_map_editor_directive_1 = require('./ng2-image-map-editor.directive');
var Ng2ImageMapEditorModule = (function () {
    function Ng2ImageMapEditorModule() {
    }
    Ng2ImageMapEditorModule = __decorate([
        core_1.NgModule({
            imports: [],
            declarations: [
                ng2_image_map_editor_directive_1.Ng2ImageMapEditorDirective
            ],
            exports: [
                ng2_image_map_editor_directive_1.Ng2ImageMapEditorDirective
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], Ng2ImageMapEditorModule);
    return Ng2ImageMapEditorModule;
}());
exports.Ng2ImageMapEditorModule = Ng2ImageMapEditorModule;
//# sourceMappingURL=ng2-image-map-editor.module.js.map