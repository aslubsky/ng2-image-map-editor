import { OnInit, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { ControlValueAccessor, FormControl } from '@angular/forms';
import { EditorApp } from './editor-app.class';
import * as i0 from "@angular/core";
export declare class Ng2ImageMapEditorDirective implements ControlValueAccessor, OnChanges, OnInit {
    answers: any[];
    mainImageSrc: string;
    mainImageWidth: number;
    valid: boolean;
    isEditMode: boolean;
    currentType: string;
    icons: any;
    labels: any;
    static globalLabels: any;
    app: EditorApp;
    _value: string;
    private _parsedValue;
    private _loadedImage;
    onAnswersUpdated: EventEmitter<any>;
    constructor();
    validate(c: FormControl): {
        required: boolean;
    };
    propagateChange: (_: any) => void;
    registerOnChange(fn: any): void;
    registerOnTouched(): void;
    writeValue(value: string): void;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    static ɵfac: i0.ɵɵFactoryDef<Ng2ImageMapEditorDirective, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<Ng2ImageMapEditorDirective, "[ng2-image-map-editor]", never, { "answers": "answers"; "mainImageSrc": "src"; "mainImageWidth": "width"; }, { "onAnswersUpdated": "onAnswersUpdated"; }, never, never>;
}
