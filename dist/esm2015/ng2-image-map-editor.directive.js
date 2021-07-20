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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmcyLWltYWdlLW1hcC1lZGl0b3IuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL25nMi1pbWFnZS1tYXAtZWRpdG9yLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQTRCLFlBQVksRUFBRSxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDbkgsT0FBTyxFQUF1QixpQkFBaUIsRUFBRSxhQUFhLEVBQWMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuRyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDN0MsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNwQyxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ2xDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQzs7O0FBNEtqRCxNQUFNLE9BQU8sMEJBQTBCO0lBNENuQztRQTNDa0IsWUFBTyxHQUFVLEVBQUUsQ0FBQztRQUkvQixVQUFLLEdBQVksSUFBSSxDQUFDO1FBQ3RCLGVBQVUsR0FBWSxLQUFLLENBQUM7UUFDNUIsZ0JBQVcsR0FBVyxFQUFFLENBQUM7UUFFekIsVUFBSyxHQUFRO1lBQ2hCLFNBQVMsRUFBRSw4QkFBOEI7WUFDekMsTUFBTSxFQUFFLDhCQUE4QjtZQUN0QyxPQUFPLEVBQUUsOEJBQThCO1NBQzFDLENBQUM7UUFFSyxXQUFNLEdBQVEsRUFBRSxDQUFDO1FBeUJoQixpQkFBWSxHQUFXLEVBQUUsQ0FBQztRQUV4QixxQkFBZ0IsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBY2hELG9CQUFlLEdBQUcsQ0FBQyxDQUFNLEVBQUUsRUFBRTtRQUM3QixDQUFDLENBQUM7SUFaRixDQUFDO0lBRUQsUUFBUSxDQUFDLENBQWM7UUFDbkIsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lB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SSxPQUFPLEVBQUUsYUFBYTt3QkFDdEIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsMkJBQTJCLENBQUM7d0JBQ3pELEtBQUssRUFBRSxJQUFJO3FCQUNkO2lCQUNKO2FBQ0o7c0NBRXFCLE9BQU87a0JBQXhCLEtBQUs7bUJBQUMsU0FBUztZQUNGLFlBQVk7a0JBQXpCLEtBQUs7bUJBQUMsS0FBSztZQUNJLGNBQWM7a0JBQTdCLEtBQUs7bUJBQUMsT0FBTztZQXVDSixnQkFBZ0I7a0JBQXpCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIEV2ZW50RW1pdHRlciwgZm9yd2FyZFJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiwgTkdfVkFMSURBVE9SUywgRm9ybUNvbnRyb2x9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7RWRpdG9yQXBwfSBmcm9tICcuL2VkaXRvci1hcHAuY2xhc3MnO1xuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi91dGlscy5jbGFzcyc7XG5pbXBvcnQge0FyZWF9IGZyb20gJy4vYXJlYS5jbGFzcyc7XG5pbXBvcnQge0FyZWFGYWN0b3J5fSBmcm9tICcuL2FyZWEtZmFjdG9yeS5jbGFzcyc7XG5cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdbbmcyLWltYWdlLW1hcC1lZGl0b3JdJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2IGlkPVwid3JhcHBlclwiPlxuICAgICAgICAgICAgPGhlYWRlciBpZD1cImhlYWRlclwiPlxuICAgICAgICAgICAgICAgIDxuYXYgaWQ9XCJuYXZcIiBjbGFzcz1cImNsZWFyZml4XCI+XG4gICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImZsb2F0LWxlZnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBpZD1cInRvX2h0bWxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBbY2xhc3MuYnRuLXJvdW5kLXNtLXByaW1hcnldPVwiIXZhbGlkXCIgY2xhc3M9XCJidG4tcm91bmQtc20tZGVmYXVsdFwiIGhyZWY9XCIjXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cInt7bGFiZWxzLnNhdmVfYW5zd2Vyc319XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgNTEyIDUxMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0zMDUsMTQ4YzExLjA0NiwwLDIwLTguOTU0LDIwLTIwVjkwYzAtMTEuMDQ2LTguOTU0LTIwLTIwLTIwYy0xMS4wNDYsMC0yMCw4Ljk1NC0yMCwyMHYzOFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEMyODUsMTM5LjA0NiwyOTMuOTU0LDE0OCwzMDUsMTQ4elwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNDkyLDM1MmMxMS4wNDYsMCwyMC04Ljk1NCwyMC0yMFYxMDJjMC01LjMwNC0yLjEwNy0xMC4zOTItNS44NTgtMTQuMTQybC04Mi04MkM0MjAuMzkyLDIuMTA3LDQxNS4zMDQsMCw0MTAsMEg4MFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEMzNS44ODgsMCwwLDM1Ljg4OCwwLDgwdjM1MmMwLDQ0LjExMiwzNS44ODgsODAsODAsODBoMzUyYzQ0LjExMiwwLDgwLTM1Ljg4OCw4MC04MGMwLTExLjA0Ni04Ljk1NC0yMC0yMC0yMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMtMTEuMDQ2LDAtMjAsOC45NTQtMjAsMjBjMCwyMi4wNTYtMTcuOTQ0LDQwLTQwLDQwVjMxMmMwLTExLjA0Ni04Ljk1NC0yMC0yMC0yMEgxMDBjLTExLjA0NiwwLTIwLDguOTU0LTIwLDIwdjE2MFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMtMjIuMDU2LDAtNDAtMTcuOTQ0LTQwLTQwVjgwYzAtMjIuMDU2LDE3Ljk0NC00MCw0MC00MHYxMThjMCwzMy4wODQsMjYuOTE2LDYwLDYwLDYwaDIwMWMzMy4wODQsMCw2MC0yNi45MTYsNjAtNjBWNDBoMC43MTZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBMNDcyLDExMC4yODRWMzMyQzQ3MiwzNDMuMDQ2LDQ4MC45NTQsMzUyLDQ5MiwzNTJ6IE0xMjAsMzMyaDI3MnYxNDBIMTIwVjMzMnogTTM2MSwxNThjMCwxMS4wMjgtOC45NzIsMjAtMjAsMjBIMTQwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYy0xMS4wMjgsMC0yMC04Ljk3Mi0yMC0yMFY0MGgyNDFWMTU4elwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBbY2xhc3MuYnRuLXJvdW5kLXNtLWRlZmF1bHRdPVwiY3VycmVudFR5cGUgIT0gJ3JlY3RhbmdsZSdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtjbGFzcy5idG4tcm91bmQtc20tcHJpbWFyeV09XCJjdXJyZW50VHlwZSA9PSAncmVjdGFuZ2xlJ1wiIGlkPVwicmVjdGFuZ2xlXCIgaHJlZj1cIiNcIj48aW1nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtzcmNdPVwiaWNvbnMucmVjdGFuZ2xlXCI+PC9hPjwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgW2NsYXNzLmJ0bi1yb3VuZC1zbS1kZWZhdWx0XT1cImN1cnJlbnRUeXBlICE9ICdjaXJjbGUnXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbY2xhc3MuYnRuLXJvdW5kLXNtLXByaW1hcnldPVwiY3VycmVudFR5cGUgPT0gJ2NpcmNsZSdcIiBocmVmPVwiI1wiIGlkPVwiY2lyY2xlXCI+PGltZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc3JjXT1cImljb25zLmNpcmNsZVwiPjwvYT48L2xpPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIFtjbGFzcy5idG4tcm91bmQtc20tZGVmYXVsdF09XCJjdXJyZW50VHlwZSAhPSAncG9seWdvbidcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtjbGFzcy5idG4tcm91bmQtc20tcHJpbWFyeV09XCJjdXJyZW50VHlwZSA9PSAncG9seWdvbidcIiBocmVmPVwiI1wiIGlkPVwicG9seWdvblwiPjxpbWdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3NyY109XCJpY29ucy5wb2x5Z29uXCI+PC9hPjwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImZsb2F0LXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJidG5cIiBpZD1cImVkaXRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBbY2xhc3MuYnRuLXJvdW5kLXNtLWRlZmF1bHRdPVwiIWlzRWRpdE1vZGVcIiB0aXRsZT1cInt7bGFiZWxzLmVkaXR9fVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2NsYXNzLmJ0bi1yb3VuZC1zbS1wcmltYXJ5XT1cImlzRWRpdE1vZGVcIiBocmVmPVwiI1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDUxMiA1MTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTQ4MS45OTYsMzAuMDA2QzQ2Mi42NDcsMTAuNjU2LDQzNi45MjIsMCw0MDkuNTU5LDBjLTI3LjM2MywwLTUzLjA4OSwxMC42NTYtNzIuNDM4LDMwLjAwNUw1MC44MjYsMzE2LjMwMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjLTIuNDM2LDIuNDM2LTQuMjAxLDUuNDYtNS4xMjUsOC43NzlMMC43MzMsNDg2LjYzN2MtMS45MzksNi45NjgsMC4wMzQsMTQuNDQxLDUuMTYzLDE5LjU0MmMzLjgsMy43OCw4Ljg5Miw1LjgyMSwxNC4xMDYsNS44MjFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYzEuODIyLDAsMy42Ni0wLjI1LDUuNDYzLTAuNzYybDE2MS41NTctNDUuODkxYzYuODE2LTEuOTM2LDEyLjEtNy4zMzUsMTMuODg4LTE0LjE5MmMxLjc4OC02Ljg1Ny0wLjE4Ni0xNC4xNDgtNS4xODktMTkuMTY3XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEw5My44NjksMzI5LjgyN0wzMzEuMTg0LDkyLjUxMWw4OC4yNTgsODguMjU4TDIzNy43NjgsMzYxLjk0OGMtNy44MjEsNy44LTcuODM4LDIwLjQ2My0wLjAzOCwyOC4yODRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYzcuNzk5LDcuODIyLDIwLjQ2NCw3LjgzOCwyOC4yODQsMC4wMzlsMjE1Ljk4LTIxNS4zOTJDNTAxLjM0NCwxNTUuNTMsNTEyLDEyOS44MDUsNTEyLDEwMi40NDJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQzUxMiw3NS4wNzksNTAxLjM0NCw0OS4zNTQsNDgxLjk5NiwzMC4wMDZ6IE0xNDMuMzk1LDQzNi4xNThMNDguODI3LDQ2My4wMmwyNi40ODUtOTUuMTUyTDE0My4zOTUsNDM2LjE1OHogTTQ1My43MywxNDYuNTc1XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGwtNS45NjUsNS45NDlsLTg4LjI5Ni04OC4yOTdsNS45MzgtNS45MzhDMzc3LjIsNDYuNDk1LDM5Mi44OCw0MCw0MDkuNTU5LDQwYzE2LjY3OSwwLDMyLjM1OCw2LjQ5NSw0NC4xNTIsMTguMjlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQzQ2NS41MDUsNzAuMDgzLDQ3Miw4NS43NjMsNDcyLDEwMi40NDJDNDcyLDExOS4xMjEsNDY1LjUwNSwxMzQuODAxLDQ1My43MywxNDYuNTc1elwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJidG4tcm91bmQtc20tZGVmYXVsdFwiIGlkPVwiY2xlYXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImJ0bi1yb3VuZC1zbS1kZWZhdWx0XCIgaHJlZj1cIiNcIiB0aXRsZT1cInt7bGFiZWxzLmNsZWFyfX1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCA1MTIgNTEyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTQ3Miw4M0gzNTFWNjBjMC0zMy4wODQtMjYuOTE2LTYwLTYwLTYwaC03MGMtMzMuMDg0LDAtNjAsMjYuOTE2LTYwLDYwdjIzSDQwYy0xMS4wNDYsMC0yMCw4Ljk1NC0yMCwyMHM4Ljk1NCwyMCwyMCwyMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaDIwLjcxMmwyNC4zNzQsMzE1Ljk4N2MwLjAwNywwLjA5MiwwLjAxNSwwLjE4NSwwLjAyMywwLjI3OGMxLjgxNiwxOS45MjQsMTAuOTU0LDM4LjMyNiwyNS43Myw1MS44MTZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEMxMjUuNjE1LDUwNC41NzEsMTQ0Ljc3MSw1MTIsMTY0Ljc3OCw1MTJoMTgyLjQ0NGM0MS42NjcsMCw3NS45MTctMzEuMDMyLDc5LjY2OS03Mi4xODNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMxLjAwMy0xMS4wMDEtNy4xMDEtMjAuNzMxLTE4LjEwMS0yMS43MzRjLTExLjAxMS0xLjAwMy0yMC43MzEsNy4xMDEtMjEuNzM0LDE4LjEwMUMzODUuMTk1LDQ1Ni42MDMsMzY4LjA3LDQ3MiwzNDcuMjIyLDQ3MlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSDE2NC43NzhjLTIwLjc3NywwLTM3Ljg3NS0xNS41NzEtMzkuODIzLTM2LjI0MkwxMDAuODMxLDEyM2gzMTAuMzM4bC0xNy4wODIsMjIxLjQ2MmMtMC44NDksMTEuMDEzLDcuMzksMjAuNjI5LDE4LjQwMywyMS40NzlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMwLjUyNCwwLjA0LDEuMDQzLDAuMDYsMS41NiwwLjA2YzEwLjM0NywwLDE5LjExLTcuOTc0LDE5LjkxOS0xOC40NjNMNDUxLjI4OCwxMjNINDcyYzExLjA0NiwwLDIwLTguOTU0LDIwLTIwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTNDgzLjA0Niw4Myw0NzIsODN6IE0zMTEsODNIMjAxVjYwYzAtMTEuMDI4LDguOTcyLTIwLDIwLTIwaDcwYzExLjAyOCwwLDIwLDguOTcyLDIwLDIwVjgzelwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTY1LjEyNywxNjMuMDE5Yy0xMS4wMzUsMC40ODItMTkuNTksOS44MTgtMTkuMTA4LDIwLjg1NGwxMCwyMjguOTMzYzAuNDY5LDEwLjczOCw5LjMyMiwxOS4xMjgsMTkuOTY2LDE5LjEyOFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYzAuMjk0LDAsMC41OTEtMC4wMDYsMC44ODgtMC4wMmMxMS4wMzUtMC40ODIsMTkuNTktOS44MTgsMTkuMTA4LTIwLjg1NGwtMTAtMjI4LjkzNFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQzE4NS40OTksMTcxLjA5MiwxNzYuMTQ1LDE2Mi41MjMsMTY1LjEyNywxNjMuMDE5elwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMzI2LjAxOSwxODIuMTI3bC0xMCwyMjguOTM0Yy0wLjQ4MiwxMS4wMzUsOC4wNzMsMjAuMzcyLDE5LjEwOCwyMC44NTRjMC4yOTcsMC4wMTMsMC41OTMsMC4wMiwwLjg4OCwwLjAyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjMTAuNjQzLDAsMTkuNDk3LTguMzksMTkuOTY2LTE5LjEyOGwxMC0yMjguOTMzYzAuNDgyLTExLjAzNS04LjA3My0yMC4zNzItMTkuMTA4LTIwLjg1NFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQzMzNS44NTYsMTYyLjUyNywzMjYuNTAxLDE3MS4wOTIsMzI2LjAxOSwxODIuMTI3elwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMjM2LDE4M3YyMjguOTMzYzAsMTEuMDQ2LDguOTU0LDIwLDIwLDIwYzExLjA0NiwwLDIwLTguOTU0LDIwLTIwVjE4M2MwLTExLjA0Ni04Ljk1NC0yMC0yMC0yMFMyMzYsMTcxLjk1NCwyMzYsMTgzelwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBpZD1cInNob3dfaGVscFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwiYnRuLXJvdW5kLXNtLWRlZmF1bHRcIiBocmVmPVwiI1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIHZlcnNpb249XCIxLjFcIiBpZD1cIkNhcGFfMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4PVwiMHB4XCIgeT1cIjBweFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCA1MTIgNTEyXCIgc3R5bGU9XCJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBjeD1cIjI1NlwiIGN5PVwiMTI3XCIgcj1cIjIwXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk00MzcuMDIsNzQuOThDMzg4LjY2NywyNi42MjksMzI0LjM4LDAsMjU2LDBTMTIzLjMzMywyNi42MjksNzQuOTgsNzQuOThDMjYuNjI5LDEyMy4zMzMsMCwxODcuNjIsMCwyNTZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHMyNi42MjksMTMyLjY2Nyw3NC45OCwxODEuMDJDMTIzLjMzMyw0ODUuMzcxLDE4Ny42Miw1MTIsMjU2LDUxMmM0Ni44MTMsMCw5Mi42MTgtMTIuNzU4LDEzMi40NjEtMzYuODkzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjOS40NDgtNS43MjQsMTIuNDY3LTE4LjAyMiw2Ljc0NC0yNy40NjljLTUuNzIzLTkuNDQ4LTE4LjAyMS0xMi40NjctMjcuNDY4LTYuNzQ0QzMzNC4xNDQsNDYxLjI0NCwyOTUuNTA2LDQ3MiwyNTYsNDcyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjLTExOS4xMDMsMC0yMTYtOTYuODk3LTIxNi0yMTZTMTM2Ljg5Nyw0MCwyNTYsNDBzMjE2LDk2Ljg5NywyMTYsMjE2YzAsNDIuNTg5LTEyLjY2NSw4NC4wNDQtMzYuNjI3LDExOS44ODRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMtNi4xMzksOS4xODItMy42NzIsMjEuNjAzLDUuNTExLDI3Ljc0MmM5LjE4Myw2LjEzOCwyMS42MDMsMy42NzMsMjcuNzQyLTUuNTFDNDk3LjAwMSwzNTUuNjc0LDUxMiwzMDYuNTMsNTEyLDI1NlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQzUxMiwxODcuNjIsNDg1LjM3MSwxMjMuMzMzLDQzNy4wMiw3NC45OHpcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTI1NiwxODdjLTExLjA0NiwwLTIwLDguOTU0LTIwLDIwdjE3OGMwLDExLjA0Niw4Ljk1NCwyMCwyMCwyMHMyMC04Ljk1NCwyMC0yMFYyMDdDMjc2LDE5NS45NTQsMjY3LjA0NiwxODcsMjU2LDE4N3pcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgPC9uYXY+XG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cImNvb3Jkc1wiPjwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJkZWJ1Z1wiPjwvZGl2PlxuICAgICAgICAgICAgPC9oZWFkZXI+XG4gICAgICAgICAgICA8ZGl2IGlkPVwiaW1hZ2Vfd3JhcHBlclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJpbWFnZVwiPlxuICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cIlwiIGFsdD1cIiNcIiBpZD1cImltZ1wiLz5cbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmVyc2lvbj1cIjEuMlwiIGJhc2VQcm9maWxlPVwidGlueVwiIGlkPVwic3ZnXCI+PC9zdmc+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPCEtLSBGcm9tIGh0bWwgYmxvY2sgLS0+XG4gICAgICAgIDxkaXYgaWQ9XCJmcm9tX2h0bWxfd3JhcHBlclwiPlxuICAgICAgICAgICAgPGZvcm0gaWQ9XCJmcm9tX2h0bWxfZm9ybVwiPlxuICAgICAgICAgICAgICAgIDxoNT5Mb2FkaW5nIGFyZWFzPC9oNT5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNsb3NlX2J1dHRvblwiIHRpdGxlPVwiY2xvc2VcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJjb2RlX2lucHV0XCI+RW50ZXIgeW91ciBodG1sIGNvZGU6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGlkPVwiY29kZV9pbnB1dFwiPjwvdGV4dGFyZWE+XG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJsb2FkX2NvZGVfYnV0dG9uXCI+TG9hZDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPCEtLSBHZXQgaW1hZ2UgZm9ybSAtLT5cblxuICAgICAgICA8IS0tIEhlbHAgYmxvY2sgICAge3snJ3x0cmFuc2xhdGV9fSAtLT5cbiAgICAgICAgPGRpdiBpZD1cIm92ZXJsYXlcIj48L2Rpdj5cbiAgICAgICAgPGRpdiBpZD1cImhlbHBcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2xvc2VfYnV0dG9uXCIgdGl0bGU9XCJjbG9zZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0eHRcIj5cbiAgICAgICAgICAgICAgICA8c2VjdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgPGgyPnt7bGFiZWxzLmRyYXdpbmdfbW9kZX19PC9oMj5cbiAgICAgICAgICAgICAgICAgICAgPHA+PHNwYW4gY2xhc3M9XCJrZXlcIj5FTlRFUjwvc3Bhbj4gJm1kYXNoOyB7e2xhYmVscy5kcmF3aW5nX21vZGVfZW50ZXJ9fTwvcD5cbiAgICAgICAgICAgICAgICAgICAgPHA+PHNwYW4gY2xhc3M9XCJrZXlcIj5FU0M8L3NwYW4+ICZtZGFzaDsge3tsYWJlbHMuZHJhd2luZ19tb2RlX2VzY319PC9wPlxuICAgICAgICAgICAgICAgICAgICA8cD48c3BhbiBjbGFzcz1cImtleVwiPlNISUZUPC9zcGFuPiAmbWRhc2g7IHt7bGFiZWxzLmRyYXdpbmdfbW9kZV9zaGlmdH19PC9wPlxuICAgICAgICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICAgICAgICA8c2VjdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgPGgyPnt7bGFiZWxzLmVkaXRpbmdfbW9kZX19PC9oMj5cbiAgICAgICAgICAgICAgICAgICAgPHA+PHNwYW4gY2xhc3M9XCJrZXlcIj5ERUxFVEU8L3NwYW4+ICZtZGFzaDsge3tsYWJlbHMuZWRpdGluZ19tb2RlX2RlbGV0ZX19PC9wPlxuICAgICAgICAgICAgICAgICAgICA8cD48c3BhbiBjbGFzcz1cImtleVwiPkVTQzwvc3Bhbj4gJm1kYXNoOyB7e2xhYmVscy5lZGl0aW5nX21vZGVfZXNjfX08L3A+XG4gICAgICAgICAgICAgICAgICAgIDxwPjxzcGFuIGNsYXNzPVwia2V5XCI+U0hJRlQ8L3NwYW4+ICZtZGFzaDsge3tsYWJlbHMuZWRpdGluZ19tb2RlX3NoaWZ0fX08L3A+XG4gICAgICAgICAgICAgICAgICAgIDxwPjxzcGFuIGNsYXNzPVwia2V5XCI+JnVhcnI7PC9zcGFuPiAmbWRhc2g7IHt7bGFiZWxzLmVkaXRpbmdfbW9kZV91cH19PC9wPlxuICAgICAgICAgICAgICAgICAgICA8cD48c3BhbiBjbGFzcz1cImtleVwiPiZkYXJyOzwvc3Bhbj4gJm1kYXNoOyB7e2xhYmVscy5lZGl0aW5nX21vZGVfZG93bn19PC9wPlxuICAgICAgICAgICAgICAgICAgICA8cD48c3BhbiBjbGFzcz1cImtleVwiPiZsYXJyOzwvc3Bhbj4gJm1kYXNoOyB7e2xhYmVscy5lZGl0aW5nX21vZGVfbGVmdH19PC9wPlxuICAgICAgICAgICAgICAgICAgICA8cD48c3BhbiBjbGFzcz1cImtleVwiPiZyYXJyOzwvc3Bhbj4gJm1kYXNoOyB7e2xhYmVscy5lZGl0aW5nX21vZGVfcmlnaHR9fTwvcD5cbiAgICAgICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+YCxcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICAgICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZzJJbWFnZU1hcEVkaXRvckRpcmVjdGl2ZSksXG4gICAgICAgICAgICBtdWx0aTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICAgICAgICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmcySW1hZ2VNYXBFZGl0b3JEaXJlY3RpdmUpLFxuICAgICAgICAgICAgbXVsdGk6IHRydWVcbiAgICAgICAgfVxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgTmcySW1hZ2VNYXBFZGl0b3JEaXJlY3RpdmUgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25DaGFuZ2VzLCBPbkluaXQge1xuICAgIEBJbnB1dCgnYW5zd2VycycpIGFuc3dlcnM6IGFueVtdID0gW107XG4gICAgQElucHV0KCdzcmMnKSBtYWluSW1hZ2VTcmM6IHN0cmluZztcbiAgICBASW5wdXQoJ3dpZHRoJykgbWFpbkltYWdlV2lkdGg6IG51bWJlcjtcblxuICAgIHB1YmxpYyB2YWxpZDogYm9vbGVhbiA9IHRydWU7XG4gICAgcHVibGljIGlzRWRpdE1vZGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgY3VycmVudFR5cGU6IHN0cmluZyA9ICcnO1xuXG4gICAgcHVibGljIGljb25zOiBhbnkgPSB7XG4gICAgICAgIHJlY3RhbmdsZTogJy9zcmMvYXNzZXRzL2ltZy90ZXN0L3JlYy5zdmcnLFxuICAgICAgICBjaXJjbGU6ICcvc3JjL2Fzc2V0cy9pbWcvdGVzdC9jaXIuc3ZnJyxcbiAgICAgICAgcG9seWdvbjogJy9zcmMvYXNzZXRzL2ltZy90ZXN0L3BvbC5zdmcnXG4gICAgfTtcblxuICAgIHB1YmxpYyBsYWJlbHM6IGFueSA9IHt9O1xuXG4gICAgcHVibGljIHN0YXRpYyBnbG9iYWxMYWJlbHM6IGFueSA9IHtcbiAgICAgICAgc2F2ZV9hbnN3ZXJzOiAnU2F2ZSBhbnN3ZXJzJyxcbiAgICAgICAgZWRpdDogJ0VkaXQnLFxuICAgICAgICBjbGVhcjogJ0NsZWFyJyxcbiAgICAgICAgZHJhd2luZ19tb2RlOiAnRHJhd2luZyBtb2RlIChyZWN0YW5nbGUgLyBjaXJjbGUgLyBwb2x5Z29uKScsXG4gICAgICAgIGRyYXdpbmdfbW9kZV9lbnRlcjogJ3N0b3AgcG9seWdvbiBkcmF3aW5nIChvciBjbGljayBvbiBmaXJzdCBoZWxwZXIpJyxcbiAgICAgICAgZHJhd2luZ19tb2RlX2VzYzogJ2NhbmNlbCBkcmF3aW5nIG9mIGEgbmV3IGFyZWEnLFxuICAgICAgICBkcmF3aW5nX21vZGVfc2hpZnQ6ICdzcXVhcmUgZHJhd2luZyBpbiBjYXNlIG9mIGEgcmVjdGFuZ2xlIGFuZCByaWdodCBhbmdsZSBkcmF3aW5nIGluIGNhc2Ugb2YgYSBwb2x5Z29uJyxcbiAgICAgICAgZWRpdGluZ19tb2RlOiAnRWRpdGluZyBtb2RlJyxcbiAgICAgICAgZWRpdGluZ19tb2RlX2RlbGV0ZTogJ3JlbW92ZSBhIHNlbGVjdGVkIGFyZWEnLFxuICAgICAgICBlZGl0aW5nX21vZGVfZXNjOiAnY2FuY2VsIGVkaXRpbmcgb2YgYSBzZWxlY3RlZCBhcmVhJyxcbiAgICAgICAgZWRpdGluZ19tb2RlX3NoaWZ0OiAnZWRpdCBhbmQgc2F2ZSBwcm9wb3J0aW9ucyBmb3IgcmVjdGFuZ2xlJyxcbiAgICAgICAgZWRpdGluZ19tb2RlX3VwOiAnbW92ZSBhIHNlbGVjdGVkIGFyZWEgdXAnLFxuICAgICAgICBlZGl0aW5nX21vZGVfZG93bjogJ21vdmUgYSBzZWxlY3RlZCBhcmVhIGRvd24nLFxuICAgICAgICBlZGl0aW5nX21vZGVfbGVmdDogJ21vdmUgYSBzZWxlY3RlZCBhcmVhIHRvIHRoZSBsZWZ0JyxcbiAgICAgICAgZWRpdGluZ19tb2RlX3JpZ2h0OiAnbW92ZSBhIHNlbGVjdGVkIGFyZWEgdG8gdGhlIHJpZ2h0J1xuICAgIH07XG5cbiAgICBwdWJsaWMgYXBwOiBFZGl0b3JBcHA7XG5cbiAgICBwdWJsaWMgX3ZhbHVlOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfcGFyc2VkVmFsdWU6IGFueTtcblxuICAgIHByaXZhdGUgX2xvYWRlZEltYWdlOiBzdHJpbmcgPSAnJztcblxuICAgIEBPdXRwdXQoKSBvbkFuc3dlcnNVcGRhdGVkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfVxuXG4gICAgdmFsaWRhdGUoYzogRm9ybUNvbnRyb2wpIHtcbiAgICAgICAgaWYgKHRoaXMudmFsaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByb3BhZ2F0ZUNoYW5nZSA9IChfOiBhbnkpID0+IHtcbiAgICB9O1xuXG4gICAgcmVnaXN0ZXJPbkNoYW5nZShmbikge1xuICAgICAgICB0aGlzLnByb3BhZ2F0ZUNoYW5nZSA9IGZuO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyT25Ub3VjaGVkKCkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygncmVnaXN0ZXJPblRvdWNoZWQnKTtcbiAgICB9XG5cbiAgICB3cml0ZVZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcblxuICAgICAgICBpZiAodGhpcy5fdmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhcnNlZFZhbHVlID0gSlNPTi5wYXJzZSh0aGlzLl92YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX3ZhbHVlICYmIHRoaXMubWFpbkltYWdlV2lkdGggJiYgdGhpcy5hcHApIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9sb2FkZWRJbWFnZSAhPSB0aGlzLl9wYXJzZWRWYWx1ZS5pbWcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2FkZWRJbWFnZSA9IHRoaXMuX3BhcnNlZFZhbHVlLmltZztcbiAgICAgICAgICAgICAgICB0aGlzLmFwcC5sb2FkSW1hZ2UodGhpcy5fcGFyc2VkVmFsdWUuaW1nLCB0aGlzLm1haW5JbWFnZVdpZHRoKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnd3JpdGVWYWx1ZSBsb2FkSW1hZ2UnLCB0aGlzLl9wYXJzZWRWYWx1ZS5pbWcsIHRoaXMubWFpbkltYWdlV2lkdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLmxhYmVscyA9IE5nMkltYWdlTWFwRWRpdG9yRGlyZWN0aXZlLmdsb2JhbExhYmVscztcbiAgICAgICAgdGhpcy5hcHAgPSBuZXcgRWRpdG9yQXBwKCk7XG4gICAgICAgIFV0aWxzLmFwcCA9IHRoaXMuYXBwO1xuICAgICAgICBBcmVhLmFwcCA9IHRoaXMuYXBwO1xuXG4gICAgICAgIHRoaXMuYXBwLmJ1dHRvbnMub25TZXRJbnZhbGlkID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy52YWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5wcm9wYWdhdGVDaGFuZ2UoW10pO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmFwcC5idXR0b25zLm9uRGF0YSA9IChhbnN3ZXJzOiBhbnlbXSwgYXJlYXM6IGFueSkgPT4ge1xuICAgICAgICAgICAgdGhpcy52YWxpZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnByb3BhZ2F0ZUNoYW5nZShhcmVhcyk7XG4gICAgICAgICAgICB0aGlzLmFuc3dlcnMgPSBhbnN3ZXJzO1xuICAgICAgICAgICAgdGhpcy5vbkFuc3dlcnNVcGRhdGVkLmVtaXQoYW5zd2Vycyk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYXBwLm9uQ3VycmVudFR5cGUgPSAodHlwZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUeXBlID0gdHlwZTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5hcHAub25TZXRNb2RlID0gKG1vZGU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgdGhpcy5pc0VkaXRNb2RlID0gbW9kZSA9PSAnZWRpdGluZyc7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYXBwLm9uSW1hZ2VMb2FkZWQgPSAoc3RhdGU6IGFueSkgPT4ge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ29uSW1hZ2VMb2FkZWQnKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuX3ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNjYWxlID0gMTtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUuaW1hZ2Uud2lkdGggPiB0aGlzLmFwcC5kb21FbGVtZW50cy5pbWcuY2xpZW50V2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NhbGUgPSBOdW1iZXIoKHN0YXRlLmltYWdlLndpZHRoIC8gdGhpcy5hcHAuZG9tRWxlbWVudHMuaW1nLmNsaWVudFdpZHRoKS50b0ZpeGVkKDMpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzY2FsZSA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdvbkltYWdlTG9hZGVkJywgdGhpcy5fcGFyc2VkVmFsdWUsIHRoaXMuYXBwLmltZy53aWR0aCwgdGhpcy5hcHAuZG9tRWxlbWVudHMuaW1nLmNsaWVudFdpZHRoKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnc2NhbGUnLCBzY2FsZSApO1xuXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3RoaXMuYW5zd2VycycsIHRoaXMuYW5zd2Vycyk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fcGFyc2VkVmFsdWUgJiYgdGhpcy5fcGFyc2VkVmFsdWUuYXJlYXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFyc2VkVmFsdWUuYXJlYXMuZm9yRWFjaCgoeCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHgudHlwZSBpbiBBcmVhRmFjdG9yeS5DT05TVFJVQ1RPUlMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2FkYXB0YXRpb24gY29vcmRpbmF0ZXMgaW4gc2NyZWVuIHJlc29sdXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4LmNvb3Jkcy5mb3JFYWNoKChpdGVtLCBpLCBhcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeC5jb29yZHNbaV0gPSBNYXRoLnJvdW5kKGl0ZW0gLyBzY2FsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcmVhRmFjdG9yeS5DT05TVFJVQ1RPUlNbeC50eXBlXS5jcmVhdGVGcm9tU2F2ZWQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb29yZHM6IHguY29vcmRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBocmVmOiB4LmhyZWYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsdDogKHRoaXMuYW5zd2Vyc1tpXSAhPSB1bmRlZmluZWQgJiYgdGhpcy5hbnN3ZXJzW2ldLmlzX3JpZ2h0KSA/ICcxJyA6ICcwJywvL3guYWx0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogKHRoaXMuYW5zd2Vyc1tpXSAhPSB1bmRlZmluZWQpID8gdGhpcy5hbnN3ZXJzW2ldLmJvZHkgOiB4LnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1iZXI6IGlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh0aGlzLm1haW5JbWFnZVNyYyAmJiB0aGlzLm1haW5JbWFnZVdpZHRoICYmIHRoaXMuX2xvYWRlZEltYWdlICE9IHRoaXMubWFpbkltYWdlU3JjKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2FkZWRJbWFnZSA9IHRoaXMubWFpbkltYWdlU3JjO1xuICAgICAgICAgICAgdGhpcy5hcHAubG9hZEltYWdlKHRoaXMubWFpbkltYWdlU3JjLCB0aGlzLm1haW5JbWFnZVdpZHRoKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCduZ09uSW5pdCBsb2FkSW1hZ2UnLCB0aGlzLm1haW5JbWFnZVNyYywgdGhpcy5tYWluSW1hZ2VXaWR0aCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgICAgICBpZiAodGhpcy5tYWluSW1hZ2VTcmMgJiYgdGhpcy5tYWluSW1hZ2VXaWR0aCAmJiB0aGlzLmFwcCAmJiB0aGlzLl9sb2FkZWRJbWFnZSAhPSB0aGlzLm1haW5JbWFnZVNyYykge1xuICAgICAgICAgICAgdGhpcy5fbG9hZGVkSW1hZ2UgPSB0aGlzLm1haW5JbWFnZVNyYztcbiAgICAgICAgICAgIHRoaXMuYXBwLmxvYWRJbWFnZSh0aGlzLm1haW5JbWFnZVNyYywgdGhpcy5tYWluSW1hZ2VXaWR0aCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnbmdPbkNoYW5nZXMgbG9hZEltYWdlJywgdGhpcy5tYWluSW1hZ2VTcmMsIHRoaXMubWFpbkltYWdlV2lkdGgpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19