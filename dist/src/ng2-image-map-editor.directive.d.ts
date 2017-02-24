import { OnInit, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { EditorApp } from './editor-app.class';
export declare class Ng2ImageMapEditorDirective implements ControlValueAccessor, OnChanges, OnInit {
    answers: any[];
    mainImageSrc: string;
    mainImageWidth: number;
    valid: boolean;
    isEditMode: boolean;
    currentType: string;
    icons: any;
    labels: any;
    app: EditorApp;
    _value: string;
    onAnswersUpdated: EventEmitter<{}>;
    constructor();
    propagateChange: (_: any) => void;
    registerOnChange(fn: any): void;
    registerOnTouched(): void;
    writeValue(value: string): void;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
}
