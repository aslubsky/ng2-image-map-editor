import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { EditorApp } from './editor-app.class';
import { Utils } from './utils.class';
import { Area } from './area.class';
import { AreaFactory } from './area-factory.class';
import * as i0 from "@angular/core";
const _c0 = ["ng2-image-map-editor", ""];
export class Ng2ImageMapEditorDirective {
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
                Utils.foreach(this._parsedValue.areas, (x, i, arr) => {
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
Ng2ImageMapEditorDirective.ɵcmp = i0.ɵɵdefineComponent({ type: Ng2ImageMapEditorDirective, selectors: [["", "ng2-image-map-editor", ""]], inputs: { answers: "answers", mainImageSrc: ["src", "mainImageSrc"], mainImageWidth: ["width", "mainImageWidth"] }, outputs: { onAnswersUpdated: "onAnswersUpdated" }, features: [i0.ɵɵProvidersFeature([
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
        ]), i0.ɵɵNgOnChangesFeature], attrs: _c0, decls: 114, vars: 36, consts: [["id", "wrapper"], ["id", "header"], ["id", "nav", 1, "clearfix"], [1, "float-left"], ["id", "to_html"], ["href", "#", 1, "btn-round-sm-default", 3, "title"], ["xmlns", "http://www.w3.org/2000/svg", "viewBox", "0 0 512 512"], ["d", "M305,148c11.046,0,20-8.954,20-20V90c0-11.046-8.954-20-20-20c-11.046,0-20,8.954-20,20v38\n                                                    C285,139.046,293.954,148,305,148z"], ["d", "M492,352c11.046,0,20-8.954,20-20V102c0-5.304-2.107-10.392-5.858-14.142l-82-82C420.392,2.107,415.304,0,410,0H80\n                                                    C35.888,0,0,35.888,0,80v352c0,44.112,35.888,80,80,80h352c44.112,0,80-35.888,80-80c0-11.046-8.954-20-20-20\n                                                    c-11.046,0-20,8.954-20,20c0,22.056-17.944,40-40,40V312c0-11.046-8.954-20-20-20H100c-11.046,0-20,8.954-20,20v160\n                                                    c-22.056,0-40-17.944-40-40V80c0-22.056,17.944-40,40-40v118c0,33.084,26.916,60,60,60h201c33.084,0,60-26.916,60-60V40h0.716\n                                                    L472,110.284V332C472,343.046,480.954,352,492,352z M120,332h272v140H120V332z M361,158c0,11.028-8.972,20-20,20H140\n                                                    c-11.028,0-20-8.972-20-20V40h241V158z"], ["id", "rectangle", "href", "#"], [3, "src"], ["href", "#", "id", "circle"], ["href", "#", "id", "polygon"], [1, "float-right"], ["id", "edit", 1, "btn"], ["d", "M481.996,30.006C462.647,10.656,436.922,0,409.559,0c-27.363,0-53.089,10.656-72.438,30.005L50.826,316.301\n                                            c-2.436,2.436-4.201,5.46-5.125,8.779L0.733,486.637c-1.939,6.968,0.034,14.441,5.163,19.542c3.8,3.78,8.892,5.821,14.106,5.821\n                                            c1.822,0,3.66-0.25,5.463-0.762l161.557-45.891c6.816-1.936,12.1-7.335,13.888-14.192c1.788-6.857-0.186-14.148-5.189-19.167\n                                            L93.869,329.827L331.184,92.511l88.258,88.258L237.768,361.948c-7.821,7.8-7.838,20.463-0.038,28.284\n                                            c7.799,7.822,20.464,7.838,28.284,0.039l215.98-215.392C501.344,155.53,512,129.805,512,102.442\n                                            C512,75.079,501.344,49.354,481.996,30.006z M143.395,436.158L48.827,463.02l26.485-95.152L143.395,436.158z M453.73,146.575\n                                            l-5.965,5.949l-88.296-88.297l5.938-5.938C377.2,46.495,392.88,40,409.559,40c16.679,0,32.358,6.495,44.152,18.29\n                                            C465.505,70.083,472,85.763,472,102.442C472,119.121,465.505,134.801,453.73,146.575z"], ["id", "clear", 1, "btn-round-sm-default"], ["d", "M472,83H351V60c0-33.084-26.916-60-60-60h-70c-33.084,0-60,26.916-60,60v23H40c-11.046,0-20,8.954-20,20s8.954,20,20,20\n                                                h20.712l24.374,315.987c0.007,0.092,0.015,0.185,0.023,0.278c1.816,19.924,10.954,38.326,25.73,51.816\n                                                C125.615,504.571,144.771,512,164.778,512h182.444c41.667,0,75.917-31.032,79.669-72.183\n                                                c1.003-11.001-7.101-20.731-18.101-21.734c-11.011-1.003-20.731,7.101-21.734,18.101C385.195,456.603,368.07,472,347.222,472\n                                                H164.778c-20.777,0-37.875-15.571-39.823-36.242L100.831,123h310.338l-17.082,221.462c-0.849,11.013,7.39,20.629,18.403,21.479\n                                                c0.524,0.04,1.043,0.06,1.56,0.06c10.347,0,19.11-7.974,19.919-18.463L451.288,123H472c11.046,0,20-8.954,20-20\n                                                S483.046,83,472,83z M311,83H201V60c0-11.028,8.972-20,20-20h70c11.028,0,20,8.972,20,20V83z"], ["d", "M165.127,163.019c-11.035,0.482-19.59,9.818-19.108,20.854l10,228.933c0.469,10.738,9.322,19.128,19.966,19.128\n                                                c0.294,0,0.591-0.006,0.888-0.02c11.035-0.482,19.59-9.818,19.108-20.854l-10-228.934\n                                                C185.499,171.092,176.145,162.523,165.127,163.019z"], ["d", "M326.019,182.127l-10,228.934c-0.482,11.035,8.073,20.372,19.108,20.854c0.297,0.013,0.593,0.02,0.888,0.02\n                                                c10.643,0,19.497-8.39,19.966-19.128l10-228.933c0.482-11.035-8.073-20.372-19.108-20.854\n                                                C335.856,162.527,326.501,171.092,326.019,182.127z"], ["d", "M236,183v228.933c0,11.046,8.954,20,20,20c11.046,0,20-8.954,20-20V183c0-11.046-8.954-20-20-20S236,171.954,236,183z"], ["id", "show_help"], ["href", "#", 1, "btn-round-sm-default"], ["version", "1.1", "id", "Capa_1", "xmlns", "http://www.w3.org/2000/svg", "x", "0px", "y", "0px", "viewBox", "0 0 512 512", 0, "xml", "space", "preserve", 2, "enable-background", "new 0 0 512 512"], ["cx", "256", "cy", "127", "r", "20"], ["d", "M437.02,74.98C388.667,26.629,324.38,0,256,0S123.333,26.629,74.98,74.98C26.629,123.333,0,187.62,0,256\n                                    s26.629,132.667,74.98,181.02C123.333,485.371,187.62,512,256,512c46.813,0,92.618-12.758,132.461-36.893\n                                    c9.448-5.724,12.467-18.022,6.744-27.469c-5.723-9.448-18.021-12.467-27.468-6.744C334.144,461.244,295.506,472,256,472\n                                    c-119.103,0-216-96.897-216-216S136.897,40,256,40s216,96.897,216,216c0,42.589-12.665,84.044-36.627,119.884\n                                    c-6.139,9.182-3.672,21.603,5.511,27.742c9.183,6.138,21.603,3.673,27.742-5.51C497.001,355.674,512,306.53,512,256\n                                    C512,187.62,485.371,123.333,437.02,74.98z"], ["d", "M256,187c-11.046,0-20,8.954-20,20v178c0,11.046,8.954,20,20,20s20-8.954,20-20V207C276,195.954,267.046,187,256,187z"], ["id", "coords"], ["id", "debug"], ["id", "image_wrapper"], ["id", "image"], ["src", "", "alt", "#", "id", "img"], ["xmlns", "http://www.w3.org/2000/svg", "version", "1.2", "baseProfile", "tiny", "id", "svg"], ["id", "from_html_wrapper"], ["id", "from_html_form"], ["title", "close", 1, "close_button"], ["for", "code_input"], ["id", "code_input"], ["id", "load_code_button"], ["id", "overlay"], ["id", "help"], [1, "txt"], [1, "key"]], template: function Ng2ImageMapEditorDirective_Template(rf, ctx) { if (rf & 1) {
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
        i0.ɵɵelementStart(23, "a", 5);
        i0.ɵɵnamespaceSVG();
        i0.ɵɵelementStart(24, "svg", 6);
        i0.ɵɵelementStart(25, "g");
        i0.ɵɵelementStart(26, "g");
        i0.ɵɵelement(27, "path", 15);
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵnamespaceHTML();
        i0.ɵɵelementStart(28, "li", 16);
        i0.ɵɵelementStart(29, "a", 5);
        i0.ɵɵnamespaceSVG();
        i0.ɵɵelementStart(30, "svg", 6);
        i0.ɵɵelementStart(31, "g");
        i0.ɵɵelementStart(32, "g");
        i0.ɵɵelementStart(33, "g");
        i0.ɵɵelement(34, "path", 17);
        i0.ɵɵelement(35, "path", 18);
        i0.ɵɵelement(36, "path", 19);
        i0.ɵɵelement(37, "path", 20);
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵnamespaceHTML();
        i0.ɵɵelementStart(38, "li", 21);
        i0.ɵɵelementStart(39, "a", 22);
        i0.ɵɵnamespaceSVG();
        i0.ɵɵelementStart(40, "svg", 23);
        i0.ɵɵelementStart(41, "g");
        i0.ɵɵelementStart(42, "g");
        i0.ɵɵelementStart(43, "g");
        i0.ɵɵelement(44, "circle", 24);
        i0.ɵɵelement(45, "path", 25);
        i0.ɵɵelement(46, "path", 26);
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵnamespaceHTML();
        i0.ɵɵelement(47, "div", 27);
        i0.ɵɵelement(48, "div", 28);
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(49, "div", 29);
        i0.ɵɵelementStart(50, "div", 30);
        i0.ɵɵelement(51, "img", 31);
        i0.ɵɵnamespaceSVG();
        i0.ɵɵelement(52, "svg", 32);
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵnamespaceHTML();
        i0.ɵɵelementStart(53, "div", 33);
        i0.ɵɵelementStart(54, "form", 34);
        i0.ɵɵelementStart(55, "h5");
        i0.ɵɵtext(56, "Loading areas");
        i0.ɵɵelementEnd();
        i0.ɵɵelement(57, "span", 35);
        i0.ɵɵelementStart(58, "p");
        i0.ɵɵelementStart(59, "label", 36);
        i0.ɵɵtext(60, "Enter your html code:");
        i0.ɵɵelementEnd();
        i0.ɵɵelement(61, "textarea", 37);
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(62, "button", 38);
        i0.ɵɵtext(63, "Load");
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelement(64, "div", 39);
        i0.ɵɵelementStart(65, "div", 40);
        i0.ɵɵelement(66, "span", 35);
        i0.ɵɵelementStart(67, "div", 41);
        i0.ɵɵelementStart(68, "section");
        i0.ɵɵelementStart(69, "h2");
        i0.ɵɵtext(70);
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(71, "p");
        i0.ɵɵelementStart(72, "span", 42);
        i0.ɵɵtext(73, "ENTER");
        i0.ɵɵelementEnd();
        i0.ɵɵtext(74);
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(75, "p");
        i0.ɵɵelementStart(76, "span", 42);
        i0.ɵɵtext(77, "ESC");
        i0.ɵɵelementEnd();
        i0.ɵɵtext(78);
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(79, "p");
        i0.ɵɵelementStart(80, "span", 42);
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
        i0.ɵɵelementStart(87, "span", 42);
        i0.ɵɵtext(88, "DELETE");
        i0.ɵɵelementEnd();
        i0.ɵɵtext(89);
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(90, "p");
        i0.ɵɵelementStart(91, "span", 42);
        i0.ɵɵtext(92, "ESC");
        i0.ɵɵelementEnd();
        i0.ɵɵtext(93);
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(94, "p");
        i0.ɵɵelementStart(95, "span", 42);
        i0.ɵɵtext(96, "SHIFT");
        i0.ɵɵelementEnd();
        i0.ɵɵtext(97);
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(98, "p");
        i0.ɵɵelementStart(99, "span", 42);
        i0.ɵɵtext(100, "\u2191");
        i0.ɵɵelementEnd();
        i0.ɵɵtext(101);
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(102, "p");
        i0.ɵɵelementStart(103, "span", 42);
        i0.ɵɵtext(104, "\u2193");
        i0.ɵɵelementEnd();
        i0.ɵɵtext(105);
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(106, "p");
        i0.ɵɵelementStart(107, "span", 42);
        i0.ɵɵtext(108, "\u2190");
        i0.ɵɵelementEnd();
        i0.ɵɵtext(109);
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(110, "p");
        i0.ɵɵelementStart(111, "span", 42);
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
        i0.ɵɵclassProp("btn-round-sm-default", ctx.isEditMode)("btn-round-sm-primary", ctx.isEditMode);
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
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(Ng2ImageMapEditorDirective, [{
        type: Component,
        args: [{
                selector: '[ng2-image-map-editor]',
                template: `<div id="wrapper">
    <header id="header">
        <nav id="nav" class="clearfix">
            <ul class="float-left">
                <li id="to_html">
                    <a [class.btn-round-sm-primary]="!valid" class="btn-round-sm-default" href="#" title="{{labels.save_answers}}">
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
                <li><a [class.btn-round-sm-default]="currentType != 'rectangle'" [class.btn-round-sm-primary]="currentType == 'rectangle'" id="rectangle" href="#"><img [src]="icons.rectangle"></a></li>
                <li><a [class.btn-round-sm-default]="currentType != 'circle'"    [class.btn-round-sm-primary]="currentType == 'circle'" href="#" id="circle"><img [src]="icons.circle"></a></li>
                <li><a [class.btn-round-sm-default]="currentType != 'polygon'"   [class.btn-round-sm-primary]="currentType == 'polygon'" href="#" id="polygon"><img [src]="icons.polygon"></a></li>
            </ul>
            <ul class="float-right">
                <li class="btn" id="edit">
                    <a [class.btn-round-sm-default]="isEditMode" title="{{labels.edit}}" [class.btn-round-sm-primary]="isEditMode" class="btn-round-sm-default" href="#">
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
                <li class="btn-round-sm-default" id="clear"><a class="btn-round-sm-default" href="#" title="{{labels.clear}}">
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
                </a></li>
                <li  id="show_help"><a class="btn-round-sm-default" href="#">
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
                </a></li>
            </ul>
        </nav>
        <div id="coords"></div>
        <div id="debug"></div>
    </header>
    <div id="image_wrapper">
        <div id="image">
            <img src="" alt="#" id="img" />
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmcyLWltYWdlLW1hcC1lZGl0b3IuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL25nMi1pbWFnZS1tYXAtZWRpdG9yLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQTRCLFlBQVksRUFBRSxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDbkgsT0FBTyxFQUF1QixpQkFBaUIsRUFBRSxhQUFhLEVBQWMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuRyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDN0MsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNwQyxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ2xDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQzs7O0FBK0pqRCxNQUFNLE9BQU8sMEJBQTBCO0lBNENuQztRQTNDa0IsWUFBTyxHQUFVLEVBQUUsQ0FBQztRQUkvQixVQUFLLEdBQVksSUFBSSxDQUFDO1FBQ3RCLGVBQVUsR0FBWSxLQUFLLENBQUM7UUFDNUIsZ0JBQVcsR0FBVyxFQUFFLENBQUM7UUFFekIsVUFBSyxHQUFRO1lBQ2hCLFNBQVMsRUFBRSw4QkFBOEI7WUFDekMsTUFBTSxFQUFFLDhCQUE4QjtZQUN0QyxPQUFPLEVBQUUsOEJBQThCO1NBQzFDLENBQUM7UUFFSyxXQUFNLEdBQVEsRUFBRSxDQUFDO1FBeUJoQixpQkFBWSxHQUFXLEVBQUUsQ0FBQztRQUV4QixxQkFBZ0IsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBY2hELG9CQUFlLEdBQUcsQ0FBQyxDQUFNLEVBQUUsRUFBRTtRQUM3QixDQUFDLENBQUM7SUFaRixDQUFDO0lBRUQsUUFBUSxDQUFDLENBQWM7UUFDbkIsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lB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QXhCLEtBQUs7bUJBQUMsU0FBUztZQUNGLFlBQVk7a0JBQXpCLEtBQUs7bUJBQUMsS0FBSztZQUNJLGNBQWM7a0JBQTdCLEtBQUs7bUJBQUMsT0FBTztZQXVDSixnQkFBZ0I7a0JBQXpCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIEV2ZW50RW1pdHRlciwgZm9yd2FyZFJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiwgTkdfVkFMSURBVE9SUywgRm9ybUNvbnRyb2x9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7RWRpdG9yQXBwfSBmcm9tICcuL2VkaXRvci1hcHAuY2xhc3MnO1xuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscy5jbGFzcyc7XG5pbXBvcnQge0FyZWF9IGZyb20gJy4vYXJlYS5jbGFzcyc7XG5pbXBvcnQge0FyZWFGYWN0b3J5fSBmcm9tICcuL2FyZWEtZmFjdG9yeS5jbGFzcyc7XG5cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdbbmcyLWltYWdlLW1hcC1lZGl0b3JdJyxcbiAgICB0ZW1wbGF0ZTogYDxkaXYgaWQ9XCJ3cmFwcGVyXCI+XG4gICAgPGhlYWRlciBpZD1cImhlYWRlclwiPlxuICAgICAgICA8bmF2IGlkPVwibmF2XCIgY2xhc3M9XCJjbGVhcmZpeFwiPlxuICAgICAgICAgICAgPHVsIGNsYXNzPVwiZmxvYXQtbGVmdFwiPlxuICAgICAgICAgICAgICAgIDxsaSBpZD1cInRvX2h0bWxcIj5cbiAgICAgICAgICAgICAgICAgICAgPGEgW2NsYXNzLmJ0bi1yb3VuZC1zbS1wcmltYXJ5XT1cIiF2YWxpZFwiIGNsYXNzPVwiYnRuLXJvdW5kLXNtLWRlZmF1bHRcIiBocmVmPVwiI1wiIHRpdGxlPVwie3tsYWJlbHMuc2F2ZV9hbnN3ZXJzfX1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgNTEyIDUxMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMzA1LDE0OGMxMS4wNDYsMCwyMC04Ljk1NCwyMC0yMFY5MGMwLTExLjA0Ni04Ljk1NC0yMC0yMC0yMGMtMTEuMDQ2LDAtMjAsOC45NTQtMjAsMjB2MzhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDMjg1LDEzOS4wNDYsMjkzLjk1NCwxNDgsMzA1LDE0OHpcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk00OTIsMzUyYzExLjA0NiwwLDIwLTguOTU0LDIwLTIwVjEwMmMwLTUuMzA0LTIuMTA3LTEwLjM5Mi01Ljg1OC0xNC4xNDJsLTgyLTgyQzQyMC4zOTIsMi4xMDcsNDE1LjMwNCwwLDQxMCwwSDgwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQzM1Ljg4OCwwLDAsMzUuODg4LDAsODB2MzUyYzAsNDQuMTEyLDM1Ljg4OCw4MCw4MCw4MGgzNTJjNDQuMTEyLDAsODAtMzUuODg4LDgwLTgwYzAtMTEuMDQ2LTguOTU0LTIwLTIwLTIwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYy0xMS4wNDYsMC0yMCw4Ljk1NC0yMCwyMGMwLDIyLjA1Ni0xNy45NDQsNDAtNDAsNDBWMzEyYzAtMTEuMDQ2LTguOTU0LTIwLTIwLTIwSDEwMGMtMTEuMDQ2LDAtMjAsOC45NTQtMjAsMjB2MTYwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYy0yMi4wNTYsMC00MC0xNy45NDQtNDAtNDBWODBjMC0yMi4wNTYsMTcuOTQ0LTQwLDQwLTQwdjExOGMwLDMzLjA4NCwyNi45MTYsNjAsNjAsNjBoMjAxYzMzLjA4NCwwLDYwLTI2LjkxNiw2MC02MFY0MGgwLjcxNlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEw0NzIsMTEwLjI4NFYzMzJDNDcyLDM0My4wNDYsNDgwLjk1NCwzNTIsNDkyLDM1MnogTTEyMCwzMzJoMjcydjE0MEgxMjBWMzMyeiBNMzYxLDE1OGMwLDExLjAyOC04Ljk3MiwyMC0yMCwyMEgxNDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjLTExLjAyOCwwLTIwLTguOTcyLTIwLTIwVjQwaDI0MVYxNTh6XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDxsaT48YSBbY2xhc3MuYnRuLXJvdW5kLXNtLWRlZmF1bHRdPVwiY3VycmVudFR5cGUgIT0gJ3JlY3RhbmdsZSdcIiBbY2xhc3MuYnRuLXJvdW5kLXNtLXByaW1hcnldPVwiY3VycmVudFR5cGUgPT0gJ3JlY3RhbmdsZSdcIiBpZD1cInJlY3RhbmdsZVwiIGhyZWY9XCIjXCI+PGltZyBbc3JjXT1cImljb25zLnJlY3RhbmdsZVwiPjwvYT48L2xpPlxuICAgICAgICAgICAgICAgIDxsaT48YSBbY2xhc3MuYnRuLXJvdW5kLXNtLWRlZmF1bHRdPVwiY3VycmVudFR5cGUgIT0gJ2NpcmNsZSdcIiAgICBbY2xhc3MuYnRuLXJvdW5kLXNtLXByaW1hcnldPVwiY3VycmVudFR5cGUgPT0gJ2NpcmNsZSdcIiBocmVmPVwiI1wiIGlkPVwiY2lyY2xlXCI+PGltZyBbc3JjXT1cImljb25zLmNpcmNsZVwiPjwvYT48L2xpPlxuICAgICAgICAgICAgICAgIDxsaT48YSBbY2xhc3MuYnRuLXJvdW5kLXNtLWRlZmF1bHRdPVwiY3VycmVudFR5cGUgIT0gJ3BvbHlnb24nXCIgICBbY2xhc3MuYnRuLXJvdW5kLXNtLXByaW1hcnldPVwiY3VycmVudFR5cGUgPT0gJ3BvbHlnb24nXCIgaHJlZj1cIiNcIiBpZD1cInBvbHlnb25cIj48aW1nIFtzcmNdPVwiaWNvbnMucG9seWdvblwiPjwvYT48L2xpPlxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDx1bCBjbGFzcz1cImZsb2F0LXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiYnRuXCIgaWQ9XCJlZGl0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxhIFtjbGFzcy5idG4tcm91bmQtc20tZGVmYXVsdF09XCJpc0VkaXRNb2RlXCIgdGl0bGU9XCJ7e2xhYmVscy5lZGl0fX1cIiBbY2xhc3MuYnRuLXJvdW5kLXNtLXByaW1hcnldPVwiaXNFZGl0TW9kZVwiIGNsYXNzPVwiYnRuLXJvdW5kLXNtLWRlZmF1bHRcIiBocmVmPVwiI1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCA1MTIgNTEyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk00ODEuOTk2LDMwLjAwNkM0NjIuNjQ3LDEwLjY1Niw0MzYuOTIyLDAsNDA5LjU1OSwwYy0yNy4zNjMsMC01My4wODksMTAuNjU2LTcyLjQzOCwzMC4wMDVMNTAuODI2LDMxNi4zMDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYy0yLjQzNiwyLjQzNi00LjIwMSw1LjQ2LTUuMTI1LDguNzc5TDAuNzMzLDQ4Ni42MzdjLTEuOTM5LDYuOTY4LDAuMDM0LDE0LjQ0MSw1LjE2MywxOS41NDJjMy44LDMuNzgsOC44OTIsNS44MjEsMTQuMTA2LDUuODIxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMxLjgyMiwwLDMuNjYtMC4yNSw1LjQ2My0wLjc2MmwxNjEuNTU3LTQ1Ljg5MWM2LjgxNi0xLjkzNiwxMi4xLTcuMzM1LDEzLjg4OC0xNC4xOTJjMS43ODgtNi44NTctMC4xODYtMTQuMTQ4LTUuMTg5LTE5LjE2N1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBMOTMuODY5LDMyOS44MjdMMzMxLjE4NCw5Mi41MTFsODguMjU4LDg4LjI1OEwyMzcuNzY4LDM2MS45NDhjLTcuODIxLDcuOC03LjgzOCwyMC40NjMtMC4wMzgsMjguMjg0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGM3Ljc5OSw3LjgyMiwyMC40NjQsNy44MzgsMjguMjg0LDAuMDM5bDIxNS45OC0yMTUuMzkyQzUwMS4zNDQsMTU1LjUzLDUxMiwxMjkuODA1LDUxMiwxMDIuNDQyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEM1MTIsNzUuMDc5LDUwMS4zNDQsNDkuMzU0LDQ4MS45OTYsMzAuMDA2eiBNMTQzLjM5NSw0MzYuMTU4TDQ4LjgyNyw0NjMuMDJsMjYuNDg1LTk1LjE1MkwxNDMuMzk1LDQzNi4xNTh6IE00NTMuNzMsMTQ2LjU3NVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsLTUuOTY1LDUuOTQ5bC04OC4yOTYtODguMjk3bDUuOTM4LTUuOTM4QzM3Ny4yLDQ2LjQ5NSwzOTIuODgsNDAsNDA5LjU1OSw0MGMxNi42NzksMCwzMi4zNTgsNi40OTUsNDQuMTUyLDE4LjI5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEM0NjUuNTA1LDcwLjA4Myw0NzIsODUuNzYzLDQ3MiwxMDIuNDQyQzQ3MiwxMTkuMTIxLDQ2NS41MDUsMTM0LjgwMSw0NTMuNzMsMTQ2LjU3NXpcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImJ0bi1yb3VuZC1zbS1kZWZhdWx0XCIgaWQ9XCJjbGVhclwiPjxhIGNsYXNzPVwiYnRuLXJvdW5kLXNtLWRlZmF1bHRcIiBocmVmPVwiI1wiIHRpdGxlPVwie3tsYWJlbHMuY2xlYXJ9fVwiPlxuICAgICAgICAgICAgICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDUxMiA1MTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNDcyLDgzSDM1MVY2MGMwLTMzLjA4NC0yNi45MTYtNjAtNjAtNjBoLTcwYy0zMy4wODQsMC02MCwyNi45MTYtNjAsNjB2MjNINDBjLTExLjA0NiwwLTIwLDguOTU0LTIwLDIwczguOTU0LDIwLDIwLDIwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoMjAuNzEybDI0LjM3NCwzMTUuOTg3YzAuMDA3LDAuMDkyLDAuMDE1LDAuMTg1LDAuMDIzLDAuMjc4YzEuODE2LDE5LjkyNCwxMC45NTQsMzguMzI2LDI1LjczLDUxLjgxNlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQzEyNS42MTUsNTA0LjU3MSwxNDQuNzcxLDUxMiwxNjQuNzc4LDUxMmgxODIuNDQ0YzQxLjY2NywwLDc1LjkxNy0zMS4wMzIsNzkuNjY5LTcyLjE4M1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYzEuMDAzLTExLjAwMS03LjEwMS0yMC43MzEtMTguMTAxLTIxLjczNGMtMTEuMDExLTEuMDAzLTIwLjczMSw3LjEwMS0yMS43MzQsMTguMTAxQzM4NS4xOTUsNDU2LjYwMywzNjguMDcsNDcyLDM0Ny4yMjIsNDcyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBIMTY0Ljc3OGMtMjAuNzc3LDAtMzcuODc1LTE1LjU3MS0zOS44MjMtMzYuMjQyTDEwMC44MzEsMTIzaDMxMC4zMzhsLTE3LjA4MiwyMjEuNDYyYy0wLjg0OSwxMS4wMTMsNy4zOSwyMC42MjksMTguNDAzLDIxLjQ3OVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYzAuNTI0LDAuMDQsMS4wNDMsMC4wNiwxLjU2LDAuMDZjMTAuMzQ3LDAsMTkuMTEtNy45NzQsMTkuOTE5LTE4LjQ2M0w0NTEuMjg4LDEyM0g0NzJjMTEuMDQ2LDAsMjAtOC45NTQsMjAtMjBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFM0ODMuMDQ2LDgzLDQ3Miw4M3ogTTMxMSw4M0gyMDFWNjBjMC0xMS4wMjgsOC45NzItMjAsMjAtMjBoNzBjMTEuMDI4LDAsMjAsOC45NzIsMjAsMjBWODN6XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xNjUuMTI3LDE2My4wMTljLTExLjAzNSwwLjQ4Mi0xOS41OSw5LjgxOC0xOS4xMDgsMjAuODU0bDEwLDIyOC45MzNjMC40NjksMTAuNzM4LDkuMzIyLDE5LjEyOCwxOS45NjYsMTkuMTI4XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjMC4yOTQsMCwwLjU5MS0wLjAwNiwwLjg4OC0wLjAyYzExLjAzNS0wLjQ4MiwxOS41OS05LjgxOCwxOS4xMDgtMjAuODU0bC0xMC0yMjguOTM0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDMTg1LjQ5OSwxNzEuMDkyLDE3Ni4xNDUsMTYyLjUyMywxNjUuMTI3LDE2My4wMTl6XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0zMjYuMDE5LDE4Mi4xMjdsLTEwLDIyOC45MzRjLTAuNDgyLDExLjAzNSw4LjA3MywyMC4zNzIsMTkuMTA4LDIwLjg1NGMwLjI5NywwLjAxMywwLjU5MywwLjAyLDAuODg4LDAuMDJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMxMC42NDMsMCwxOS40OTctOC4zOSwxOS45NjYtMTkuMTI4bDEwLTIyOC45MzNjMC40ODItMTEuMDM1LTguMDczLTIwLjM3Mi0xOS4xMDgtMjAuODU0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDMzM1Ljg1NiwxNjIuNTI3LDMyNi41MDEsMTcxLjA5MiwzMjYuMDE5LDE4Mi4xMjd6XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0yMzYsMTgzdjIyOC45MzNjMCwxMS4wNDYsOC45NTQsMjAsMjAsMjBjMTEuMDQ2LDAsMjAtOC45NTQsMjAtMjBWMTgzYzAtMTEuMDQ2LTguOTU0LTIwLTIwLTIwUzIzNiwxNzEuOTU0LDIzNiwxODN6XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICA8L2E+PC9saT5cbiAgICAgICAgICAgICAgICA8bGkgIGlkPVwic2hvd19oZWxwXCI+PGEgY2xhc3M9XCJidG4tcm91bmQtc20tZGVmYXVsdFwiIGhyZWY9XCIjXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzdmcgdmVyc2lvbj1cIjEuMVwiIGlkPVwiQ2FwYV8xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHg9XCIwcHhcIiB5PVwiMHB4XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDUxMiA1MTJcIiBzdHlsZT1cImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMjtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Zz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGN4PVwiMjU2XCIgY3k9XCIxMjdcIiByPVwiMjBcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTQzNy4wMiw3NC45OEMzODguNjY3LDI2LjYyOSwzMjQuMzgsMCwyNTYsMFMxMjMuMzMzLDI2LjYyOSw3NC45OCw3NC45OEMyNi42MjksMTIzLjMzMywwLDE4Ny42MiwwLDI1NlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgczI2LjYyOSwxMzIuNjY3LDc0Ljk4LDE4MS4wMkMxMjMuMzMzLDQ4NS4zNzEsMTg3LjYyLDUxMiwyNTYsNTEyYzQ2LjgxMywwLDkyLjYxOC0xMi43NTgsMTMyLjQ2MS0zNi44OTNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGM5LjQ0OC01LjcyNCwxMi40NjctMTguMDIyLDYuNzQ0LTI3LjQ2OWMtNS43MjMtOS40NDgtMTguMDIxLTEyLjQ2Ny0yNy40NjgtNi43NDRDMzM0LjE0NCw0NjEuMjQ0LDI5NS41MDYsNDcyLDI1Niw0NzJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMtMTE5LjEwMywwLTIxNi05Ni44OTctMjE2LTIxNlMxMzYuODk3LDQwLDI1Niw0MHMyMTYsOTYuODk3LDIxNiwyMTZjMCw0Mi41ODktMTIuNjY1LDg0LjA0NC0zNi42MjcsMTE5Ljg4NFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYy02LjEzOSw5LjE4Mi0zLjY3MiwyMS42MDMsNS41MTEsMjcuNzQyYzkuMTgzLDYuMTM4LDIxLjYwMywzLjY3MywyNy43NDItNS41MUM0OTcuMDAxLDM1NS42NzQsNTEyLDMwNi41Myw1MTIsMjU2XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDNTEyLDE4Ny42Miw0ODUuMzcxLDEyMy4zMzMsNDM3LjAyLDc0Ljk4elwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMjU2LDE4N2MtMTEuMDQ2LDAtMjAsOC45NTQtMjAsMjB2MTc4YzAsMTEuMDQ2LDguOTU0LDIwLDIwLDIwczIwLTguOTU0LDIwLTIwVjIwN0MyNzYsMTk1Ljk1NCwyNjcuMDQ2LDE4NywyNTYsMTg3elwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgPC9hPjwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICA8L25hdj5cbiAgICAgICAgPGRpdiBpZD1cImNvb3Jkc1wiPjwvZGl2PlxuICAgICAgICA8ZGl2IGlkPVwiZGVidWdcIj48L2Rpdj5cbiAgICA8L2hlYWRlcj5cbiAgICA8ZGl2IGlkPVwiaW1hZ2Vfd3JhcHBlclwiPlxuICAgICAgICA8ZGl2IGlkPVwiaW1hZ2VcIj5cbiAgICAgICAgICAgIDxpbWcgc3JjPVwiXCIgYWx0PVwiI1wiIGlkPVwiaW1nXCIgLz5cbiAgICAgICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZlcnNpb249XCIxLjJcIiBiYXNlUHJvZmlsZT1cInRpbnlcIiBpZD1cInN2Z1wiPjwvc3ZnPlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuXG4gICAgICAgIDwhLS0gRnJvbSBodG1sIGJsb2NrIC0tPlxuICAgICAgICA8ZGl2IGlkPVwiZnJvbV9odG1sX3dyYXBwZXJcIj5cbiAgICAgICAgICAgIDxmb3JtIGlkPVwiZnJvbV9odG1sX2Zvcm1cIj5cbiAgICAgICAgICAgICAgICA8aDU+TG9hZGluZyBhcmVhczwvaDU+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjbG9zZV9idXR0b25cIiB0aXRsZT1cImNsb3NlXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiY29kZV9pbnB1dFwiPkVudGVyIHlvdXIgaHRtbCBjb2RlOjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBpZD1cImNvZGVfaW5wdXRcIj48L3RleHRhcmVhPlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwibG9hZF9jb2RlX2J1dHRvblwiPkxvYWQ8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDwhLS0gR2V0IGltYWdlIGZvcm0gLS0+XG5cbiAgICAgICAgPCEtLSBIZWxwIGJsb2NrICAgIHt7Jyd8dHJhbnNsYXRlfX0gLS0+XG4gICAgICAgIDxkaXYgaWQ9XCJvdmVybGF5XCI+PC9kaXY+XG4gICAgICAgIDxkaXYgaWQ9XCJoZWxwXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNsb3NlX2J1dHRvblwiIHRpdGxlPVwiY2xvc2VcIj48L3NwYW4+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidHh0XCI+XG4gICAgICAgICAgICAgICAgPHNlY3Rpb24+XG4gICAgICAgICAgICAgICAgICAgIDxoMj57e2xhYmVscy5kcmF3aW5nX21vZGV9fTwvaDI+XG4gICAgICAgICAgICAgICAgICAgIDxwPjxzcGFuIGNsYXNzPVwia2V5XCI+RU5URVI8L3NwYW4+ICZtZGFzaDsge3tsYWJlbHMuZHJhd2luZ19tb2RlX2VudGVyfX08L3A+XG4gICAgICAgICAgICAgICAgICAgIDxwPjxzcGFuIGNsYXNzPVwia2V5XCI+RVNDPC9zcGFuPiAmbWRhc2g7IHt7bGFiZWxzLmRyYXdpbmdfbW9kZV9lc2N9fTwvcD5cbiAgICAgICAgICAgICAgICAgICAgPHA+PHNwYW4gY2xhc3M9XCJrZXlcIj5TSElGVDwvc3Bhbj4gJm1kYXNoOyB7e2xhYmVscy5kcmF3aW5nX21vZGVfc2hpZnR9fTwvcD5cbiAgICAgICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgICAgICAgPHNlY3Rpb24+XG4gICAgICAgICAgICAgICAgICAgIDxoMj57e2xhYmVscy5lZGl0aW5nX21vZGV9fTwvaDI+XG4gICAgICAgICAgICAgICAgICAgIDxwPjxzcGFuIGNsYXNzPVwia2V5XCI+REVMRVRFPC9zcGFuPiAmbWRhc2g7IHt7bGFiZWxzLmVkaXRpbmdfbW9kZV9kZWxldGV9fTwvcD5cbiAgICAgICAgICAgICAgICAgICAgPHA+PHNwYW4gY2xhc3M9XCJrZXlcIj5FU0M8L3NwYW4+ICZtZGFzaDsge3tsYWJlbHMuZWRpdGluZ19tb2RlX2VzY319PC9wPlxuICAgICAgICAgICAgICAgICAgICA8cD48c3BhbiBjbGFzcz1cImtleVwiPlNISUZUPC9zcGFuPiAmbWRhc2g7IHt7bGFiZWxzLmVkaXRpbmdfbW9kZV9zaGlmdH19PC9wPlxuICAgICAgICAgICAgICAgICAgICA8cD48c3BhbiBjbGFzcz1cImtleVwiPiZ1YXJyOzwvc3Bhbj4gJm1kYXNoOyB7e2xhYmVscy5lZGl0aW5nX21vZGVfdXB9fTwvcD5cbiAgICAgICAgICAgICAgICAgICAgPHA+PHNwYW4gY2xhc3M9XCJrZXlcIj4mZGFycjs8L3NwYW4+ICZtZGFzaDsge3tsYWJlbHMuZWRpdGluZ19tb2RlX2Rvd259fTwvcD5cbiAgICAgICAgICAgICAgICAgICAgPHA+PHNwYW4gY2xhc3M9XCJrZXlcIj4mbGFycjs8L3NwYW4+ICZtZGFzaDsge3tsYWJlbHMuZWRpdGluZ19tb2RlX2xlZnR9fTwvcD5cbiAgICAgICAgICAgICAgICAgICAgPHA+PHNwYW4gY2xhc3M9XCJrZXlcIj4mcmFycjs8L3NwYW4+ICZtZGFzaDsge3tsYWJlbHMuZWRpdGluZ19tb2RlX3JpZ2h0fX08L3A+XG4gICAgICAgICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PmAsXG4gICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmcySW1hZ2VNYXBFZGl0b3JEaXJlY3RpdmUpLFxuICAgICAgICAgICAgbXVsdGk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgICAgICAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5nMkltYWdlTWFwRWRpdG9yRGlyZWN0aXZlKSxcbiAgICAgICAgICAgIG11bHRpOiB0cnVlXG4gICAgICAgIH1cbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIE5nMkltYWdlTWFwRWRpdG9yRGlyZWN0aXZlIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uQ2hhbmdlcywgT25Jbml0IHtcbiAgICBASW5wdXQoJ2Fuc3dlcnMnKSBhbnN3ZXJzOiBhbnlbXSA9IFtdO1xuICAgIEBJbnB1dCgnc3JjJykgbWFpbkltYWdlU3JjOiBzdHJpbmc7XG4gICAgQElucHV0KCd3aWR0aCcpIG1haW5JbWFnZVdpZHRoOiBudW1iZXI7XG5cbiAgICBwdWJsaWMgdmFsaWQ6IGJvb2xlYW4gPSB0cnVlO1xuICAgIHB1YmxpYyBpc0VkaXRNb2RlOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGN1cnJlbnRUeXBlOiBzdHJpbmcgPSAnJztcblxuICAgIHB1YmxpYyBpY29uczogYW55ID0ge1xuICAgICAgICByZWN0YW5nbGU6ICcvc3JjL2Fzc2V0cy9pbWcvdGVzdC9yZWMuc3ZnJyxcbiAgICAgICAgY2lyY2xlOiAnL3NyYy9hc3NldHMvaW1nL3Rlc3QvY2lyLnN2ZycsXG4gICAgICAgIHBvbHlnb246ICcvc3JjL2Fzc2V0cy9pbWcvdGVzdC9wb2wuc3ZnJ1xuICAgIH07XG5cbiAgICBwdWJsaWMgbGFiZWxzOiBhbnkgPSB7fTtcblxuICAgIHB1YmxpYyBzdGF0aWMgZ2xvYmFsTGFiZWxzOiBhbnkgPSB7XG4gICAgICAgIHNhdmVfYW5zd2VyczogJ1NhdmUgYW5zd2VycycsXG4gICAgICAgIGVkaXQ6ICdFZGl0JyxcbiAgICAgICAgY2xlYXI6ICdDbGVhcicsXG4gICAgICAgIGRyYXdpbmdfbW9kZTogJ0RyYXdpbmcgbW9kZSAocmVjdGFuZ2xlIC8gY2lyY2xlIC8gcG9seWdvbiknLFxuICAgICAgICBkcmF3aW5nX21vZGVfZW50ZXI6ICdzdG9wIHBvbHlnb24gZHJhd2luZyAob3IgY2xpY2sgb24gZmlyc3QgaGVscGVyKScsXG4gICAgICAgIGRyYXdpbmdfbW9kZV9lc2M6ICdjYW5jZWwgZHJhd2luZyBvZiBhIG5ldyBhcmVhJyxcbiAgICAgICAgZHJhd2luZ19tb2RlX3NoaWZ0OiAnc3F1YXJlIGRyYXdpbmcgaW4gY2FzZSBvZiBhIHJlY3RhbmdsZSBhbmQgcmlnaHQgYW5nbGUgZHJhd2luZyBpbiBjYXNlIG9mIGEgcG9seWdvbicsXG4gICAgICAgIGVkaXRpbmdfbW9kZTogJ0VkaXRpbmcgbW9kZScsXG4gICAgICAgIGVkaXRpbmdfbW9kZV9kZWxldGU6ICdyZW1vdmUgYSBzZWxlY3RlZCBhcmVhJyxcbiAgICAgICAgZWRpdGluZ19tb2RlX2VzYzogJ2NhbmNlbCBlZGl0aW5nIG9mIGEgc2VsZWN0ZWQgYXJlYScsXG4gICAgICAgIGVkaXRpbmdfbW9kZV9zaGlmdDogJ2VkaXQgYW5kIHNhdmUgcHJvcG9ydGlvbnMgZm9yIHJlY3RhbmdsZScsXG4gICAgICAgIGVkaXRpbmdfbW9kZV91cDogJ21vdmUgYSBzZWxlY3RlZCBhcmVhIHVwJyxcbiAgICAgICAgZWRpdGluZ19tb2RlX2Rvd246ICdtb3ZlIGEgc2VsZWN0ZWQgYXJlYSBkb3duJyxcbiAgICAgICAgZWRpdGluZ19tb2RlX2xlZnQ6ICdtb3ZlIGEgc2VsZWN0ZWQgYXJlYSB0byB0aGUgbGVmdCcsXG4gICAgICAgIGVkaXRpbmdfbW9kZV9yaWdodDogJ21vdmUgYSBzZWxlY3RlZCBhcmVhIHRvIHRoZSByaWdodCdcbiAgICB9O1xuXG4gICAgcHVibGljIGFwcDogRWRpdG9yQXBwO1xuXG4gICAgcHVibGljIF92YWx1ZTogc3RyaW5nO1xuICAgIHByaXZhdGUgX3BhcnNlZFZhbHVlOiBhbnk7XG5cbiAgICBwcml2YXRlIF9sb2FkZWRJbWFnZTogc3RyaW5nID0gJyc7XG5cbiAgICBAT3V0cHV0KCkgb25BbnN3ZXJzVXBkYXRlZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH1cblxuICAgIHZhbGlkYXRlKGM6IEZvcm1Db250cm9sKSB7XG4gICAgICAgIGlmICh0aGlzLnZhbGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWVcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcm9wYWdhdGVDaGFuZ2UgPSAoXzogYW55KSA9PiB7XG4gICAgfTtcblxuICAgIHJlZ2lzdGVyT25DaGFuZ2UoZm4pIHtcbiAgICAgICAgdGhpcy5wcm9wYWdhdGVDaGFuZ2UgPSBmbjtcbiAgICB9XG5cbiAgICByZWdpc3Rlck9uVG91Y2hlZCgpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3JlZ2lzdGVyT25Ub3VjaGVkJyk7XG4gICAgfVxuXG4gICAgd3JpdGVWYWx1ZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG5cbiAgICAgICAgaWYgKHRoaXMuX3ZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9wYXJzZWRWYWx1ZSA9IEpTT04ucGFyc2UodGhpcy5fdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl92YWx1ZSAmJiB0aGlzLm1haW5JbWFnZVdpZHRoICYmIHRoaXMuYXBwKSB7XG4gICAgICAgICAgICBpZih0aGlzLl9sb2FkZWRJbWFnZSAhPSB0aGlzLl9wYXJzZWRWYWx1ZS5pbWcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2FkZWRJbWFnZSA9IHRoaXMuX3BhcnNlZFZhbHVlLmltZztcbiAgICAgICAgICAgICAgICB0aGlzLmFwcC5sb2FkSW1hZ2UodGhpcy5fcGFyc2VkVmFsdWUuaW1nLCB0aGlzLm1haW5JbWFnZVdpZHRoKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnd3JpdGVWYWx1ZSBsb2FkSW1hZ2UnLCB0aGlzLl9wYXJzZWRWYWx1ZS5pbWcsIHRoaXMubWFpbkltYWdlV2lkdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLmxhYmVscyA9IE5nMkltYWdlTWFwRWRpdG9yRGlyZWN0aXZlLmdsb2JhbExhYmVscztcbiAgICAgICAgdGhpcy5hcHAgPSBuZXcgRWRpdG9yQXBwKCk7XG4gICAgICAgIFV0aWxzLmFwcCA9IHRoaXMuYXBwO1xuICAgICAgICBBcmVhLmFwcCA9IHRoaXMuYXBwO1xuXG4gICAgICAgIHRoaXMuYXBwLmJ1dHRvbnMub25TZXRJbnZhbGlkID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy52YWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5wcm9wYWdhdGVDaGFuZ2UoW10pO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmFwcC5idXR0b25zLm9uRGF0YSA9IChhbnN3ZXJzOiBhbnlbXSwgYXJlYXM6IGFueSkgPT4ge1xuICAgICAgICAgICAgdGhpcy52YWxpZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnByb3BhZ2F0ZUNoYW5nZShhcmVhcyk7XG4gICAgICAgICAgICB0aGlzLmFuc3dlcnMgPSBhbnN3ZXJzO1xuICAgICAgICAgICAgdGhpcy5vbkFuc3dlcnNVcGRhdGVkLmVtaXQoYW5zd2Vycyk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYXBwLm9uQ3VycmVudFR5cGUgPSAodHlwZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUeXBlID0gdHlwZTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5hcHAub25TZXRNb2RlID0gKG1vZGU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgdGhpcy5pc0VkaXRNb2RlID0gbW9kZSA9PSAnZWRpdGluZyc7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYXBwLm9uSW1hZ2VMb2FkZWQgPSAoc3RhdGU6IGFueSkgPT4ge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ29uSW1hZ2VMb2FkZWQnKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuX3ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNjYWxlID0gMTtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUuaW1hZ2Uud2lkdGggPiB0aGlzLmFwcC5kb21FbGVtZW50cy5pbWcuY2xpZW50V2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NhbGUgPSBOdW1iZXIoKHN0YXRlLmltYWdlLndpZHRoIC8gdGhpcy5hcHAuZG9tRWxlbWVudHMuaW1nLmNsaWVudFdpZHRoKS50b0ZpeGVkKDMpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzY2FsZSA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdvbkltYWdlTG9hZGVkJywgdGhpcy5fcGFyc2VkVmFsdWUsIHRoaXMuYXBwLmltZy53aWR0aCwgdGhpcy5hcHAuZG9tRWxlbWVudHMuaW1nLmNsaWVudFdpZHRoKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnc2NhbGUnLCBzY2FsZSApO1xuXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3RoaXMuYW5zd2VycycsIHRoaXMuYW5zd2Vycyk7XG5cbiAgICAgICAgICAgICAgICBVdGlscy5mb3JlYWNoKHRoaXMuX3BhcnNlZFZhbHVlLmFyZWFzLCAoeCwgaSwgYXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh4LnR5cGUgaW4gQXJlYUZhY3RvcnkuQ09OU1RSVUNUT1JTKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2FkYXB0YXRpb24gY29vcmRpbmF0ZXMgaW4gc2NyZWVuIHJlc29sdXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHguY29vcmRzLmZvckVhY2goKGl0ZW0sIGksIGFycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHguY29vcmRzW2ldID0gTWF0aC5yb3VuZChpdGVtIC8gc2NhbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIEFyZWFGYWN0b3J5LkNPTlNUUlVDVE9SU1t4LnR5cGVdLmNyZWF0ZUZyb21TYXZlZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29vcmRzOiB4LmNvb3JkcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBocmVmOiB4LmhyZWYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWx0OiAodGhpcy5hbnN3ZXJzW2ldICE9IHVuZGVmaW5lZCAmJiB0aGlzLmFuc3dlcnNbaV0uaXNfcmlnaHQpID8gJzEnIDogJzAnLC8veC5hbHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICh0aGlzLmFuc3dlcnNbaV0gIT0gdW5kZWZpbmVkKSA/IHRoaXMuYW5zd2Vyc1tpXS5ib2R5IDogeC50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1iZXI6IGlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHRoaXMubWFpbkltYWdlU3JjICYmIHRoaXMubWFpbkltYWdlV2lkdGggJiYgdGhpcy5fbG9hZGVkSW1hZ2UgIT0gdGhpcy5tYWluSW1hZ2VTcmMpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvYWRlZEltYWdlID0gdGhpcy5tYWluSW1hZ2VTcmM7XG4gICAgICAgICAgICB0aGlzLmFwcC5sb2FkSW1hZ2UodGhpcy5tYWluSW1hZ2VTcmMsIHRoaXMubWFpbkltYWdlV2lkdGgpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ25nT25Jbml0IGxvYWRJbWFnZScsIHRoaXMubWFpbkltYWdlU3JjLCB0aGlzLm1haW5JbWFnZVdpZHRoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgICAgIGlmICh0aGlzLm1haW5JbWFnZVNyYyAmJiB0aGlzLm1haW5JbWFnZVdpZHRoICYmIHRoaXMuYXBwICYmIHRoaXMuX2xvYWRlZEltYWdlICE9IHRoaXMubWFpbkltYWdlU3JjKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2FkZWRJbWFnZSA9IHRoaXMubWFpbkltYWdlU3JjO1xuICAgICAgICAgICAgdGhpcy5hcHAubG9hZEltYWdlKHRoaXMubWFpbkltYWdlU3JjLCB0aGlzLm1haW5JbWFnZVdpZHRoKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCduZ09uQ2hhbmdlcyBsb2FkSW1hZ2UnLCB0aGlzLm1haW5JbWFnZVNyYywgdGhpcy5tYWluSW1hZ2VXaWR0aCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=