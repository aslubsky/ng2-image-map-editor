import {Component, Input, OnInit, Output, OnChanges, SimpleChanges, EventEmitter, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl} from '@angular/forms';
import {EditorApp} from './editor-app.class';
import {Utils} from './utils.class';
import {Area} from './area.class';
import {AreaFactory} from './area-factory.class';


@Component({
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
})
export class Ng2ImageMapEditorDirective implements ControlValueAccessor, OnChanges, OnInit {
    @Input('answers') answers: any[] = [];
    @Input('src') mainImageSrc: string;
    @Input('width') mainImageWidth: number;

    public valid: boolean = true;
    public isEditMode: boolean = false;
    public currentType: string = '';

    public icons: any = {
        rectangle: '/src/assets/img/test/rec.svg',
        circle: '/src/assets/img/test/cir.svg',
        polygon: '/src/assets/img/test/pol.svg'
    };

    public labels: any = {};

    public static globalLabels: any = {
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

    public app: EditorApp;

    public _value: string;
    private _parsedValue: any;

    private _loadedImage: string = '';

    @Output() onAnswersUpdated = new EventEmitter();

    constructor() {
    }

    validate(c: FormControl) {
        if (this.valid) {
            return null;
        }
        return {
            required: true
        };
    }

    propagateChange = (_: any) => {
    };

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    registerOnTouched() {
        // console.log('registerOnTouched');
    }

    writeValue(value: string) {
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

    public ngOnInit() {
        this.labels = Ng2ImageMapEditorDirective.globalLabels;
        this.app = new EditorApp();
        Utils.app = this.app;
        Area.app = this.app;

        this.app.buttons.onSetInvalid = () => {
            this.valid = false;
            this.propagateChange([]);
        };
        this.app.buttons.onData = (answers: any[], areas: any) => {
            this.valid = true;
            this.propagateChange(areas);
            this.answers = answers;
            this.onAnswersUpdated.emit(answers);
        };
        this.app.onCurrentType = (type: string) => {
            this.currentType = type;
        };
        this.app.onSetMode = (mode: string) => {
            this.isEditMode = mode == 'editing';
        };
        this.app.onImageLoaded = (state: any) => {
            // console.log('onImageLoaded');

            if (this._value) {
                var scale = 1;
                if (state.image.width > this.app.domElements.img.clientWidth) {
                    scale = Number((state.image.width / this.app.domElements.img.clientWidth).toFixed(3));
                } else {
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
                                alt: (this.answers[i] != undefined && this.answers[i].is_right) ? '1' : '0',//x.alt,
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

    public ngOnChanges(changes: SimpleChanges) {
        if (this.mainImageSrc && this.mainImageWidth && this.app && this._loadedImage != this.mainImageSrc) {
            this._loadedImage = this.mainImageSrc;
            this.app.loadImage(this.mainImageSrc, this.mainImageWidth);
            // console.log('ngOnChanges loadImage', this.mainImageSrc, this.mainImageWidth);
        }
    }
}
