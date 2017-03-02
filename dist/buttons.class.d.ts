import { EditorApp } from './editor-app.class';
export declare class Buttons {
    private app;
    all: NodeListOf<HTMLLIElement>;
    rectangle: HTMLElement;
    circle: HTMLElement;
    polygon: HTMLElement;
    edit: HTMLElement;
    clear: HTMLElement;
    to_html: HTMLElement;
    show_help: HTMLElement;
    constructor(app: EditorApp);
    deselectAll(): void;
    selectOne(button: any): void;
    onShapeButtonClick(e: any): void;
    onClearButtonClick(e: any): void;
    onToHtmlButtonClick(e: any): void;
    onEditButtonClick(e: any): void;
    onData(answers: any[], areas: any): void;
    onSetInvalid(): void;
    onShowHelpButtonClick(e: any): void;
}
