import {Area} from './area.class';

/**
 * The constructor of helpers points
 *
 * @constructor
 * @param node {parentNode} - a node for inserting helper
 * @param x {number} - x - coordinate
 * @param y {number} - y - coordinate
 * @param action {string} - an action by click of this helper
 */
export class Helper {
    public static SIZE: number = 5;
    public static SIZENum: number = 15;
    public static OFFSET: number = -Math.ceil(Helper.SIZE / 2);
    public static CLASS_NAME: string = 'helper';
    public static ACTIONS_TO_CURSORS: any = {
        'move': 'move',
        'editLeft': 'e-resize',
        'editRight': 'w-resize',
        'editTop': 'n-resize',
        'editBottom': 's-resize',
        'editTopLeft': 'nw-resize',
        'editTopRight': 'ne-resize',
        'editBottomLeft': 'sw-resize',
        'editBottomRight': 'se-resize',
        'pointMove': 'pointer',
        'number': 'default'
    };

    private _el: any;

    constructor(node: any, x: number, y: number, action: string) {
        if (action == 'number') {
            this._el = document.createElementNS(Area.SVG_NS, 'text');
        } else {
            this._el = document.createElementNS(Area.SVG_NS, 'rect');
        }


        this._el.classList.add(Helper.CLASS_NAME);
        if (action == 'number') {
            //this._el.textContent = 'Test';
            this._el.setAttribute('height', Helper.SIZENum);
            this._el.setAttribute('width', Helper.SIZENum);
            this._el.setAttribute('x', x + Helper.OFFSET);
            this._el.setAttribute('y', y + Helper.OFFSET);
        } else {
            this._el.setAttribute('height', Helper.SIZE);
            this._el.setAttribute('width', Helper.SIZE);
            this._el.setAttribute('x', x + Helper.OFFSET);
            this._el.setAttribute('y', y + Helper.OFFSET);
        }

        node.appendChild(this._el);

        this._el.action = action;
        this._el.classList.add(Helper.ACTIONS_TO_CURSORS[action]);
    }

    public setCoords(x: number, y: number) {
        this._el.setAttribute('x', x + Helper.OFFSET);
        this._el.setAttribute('y', y + Helper.OFFSET);

        return this;
    }

    public setNumber(id: number) {
        this._el.textContent = id + 1;
    }

    public setId(id: number) {
        this._el.n = id;
        return this;
    }
}