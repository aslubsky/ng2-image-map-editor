import {Component, Input, OnInit, Output, OnChanges, SimpleChanges, EventEmitter, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl} from '@angular/forms';
import {EditorApp} from './editor-app.class';
import {Utils} from './utils.class';
import {Area} from './area.class';
import {AreaFactory} from './area-factory.class';


@Component({
    selector: '[ng2-image-map-editor]',
    template: `<div id="wrapper">
    <header id="header">
        <nav id="nav" class="clearfix">
            <ul class="float-left">
                <li id="to_html"><a [class.btn-success]="!valid" class="btn-success btn" href="#">{{labels.save_answers}}</a></li>
                <li><a [class.btn-default]="currentType == 'rectangle'" [class.btn]="currentType != 'rectangle'" id="rectangle" href="#"><img [src]="icons.rectangle"></a></li>
                <li><a [class.btn-default]="currentType == 'circle'" [class.btn]="currentType != 'circle'" href="#" id="circle"><img [src]="icons.circle"></a></li>
                <li><a [class.btn-default]="currentType == 'polygon'" [class.btn]="currentType != 'polygon'" href="#" id="polygon"><img [src]="icons.polygon"></a></li>
            </ul>
            <ul class="float-right">
                <li class="btn" id="edit">
                    <a [class.btn-primary]="isEditMode" [class.btn-default]="!isEditMode" class="btn" href="#">
                    <i [class.fa-toggle-on]="isEditMode" [class.fa-toggle-off]="!isEditMode" class="fa" aria-hidden="true"></i> {{labels.edit}}</a>
                </li>
                <li class="btn" id="clear"><a class="btn btn-default" href="#"><i class="fa fa-eraser" aria-hidden="true"></i> {{labels.clear}}</a></li>
                <li class="btn" id="show_help"><a href="#"><i class="fa fa-question-circle" aria-hidden="true"></i></a></li>
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
})
export class Ng2ImageMapEditorDirective implements ControlValueAccessor, OnChanges, OnInit {
    @Input('answers') answers: any[] = [];
    @Input('src') mainImageSrc: string;
    @Input('width') mainImageWidth: number;

    public valid: boolean = true;
    public isEditMode: boolean = false;
    public currentType: string = '';

    public icons: any = {
        rectangle: '/themes/default/assets/img/test/rec.png',
        circle: '/themes/default/assets/img/test/cir.png',
        polygon: '/themes/default/assets/img/test/pol.png'
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
        // console.log('Ng2ImageMapEditorDirective NG_VALIDATORS', c.value, this.valid);
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
            if(this._loadedImage != this._parsedValue.img) {
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

                Utils.foreach(this._parsedValue.areas, (x, i, arr) => {
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
