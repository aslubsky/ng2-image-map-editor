import {Utils} from './utils.class';
// import {Info} from './info.class';
// import {Code} from './code.class';
import {Help} from './help.class';
import {AreaFactory} from './area-factory.class';
import {AppEvent} from './app-event.class';
import {Buttons} from './buttons.class';

export class CursorPositionInfo {
    private _coords_info: any = Utils.id('coords');

    public set(coords: any) {
        this._coords_info.innerHTML = 'x: ' + coords.x + ', ' + 'y: ' + coords.y;
    }

    public empty() {
        this._coords_info.innerHTML = '';
    }
}


export class EditorApp {
    public domElements: any = {
        wrapper: Utils.id('wrapper'),
        svg: Utils.id('svg'),
        img: Utils.id('img'),
        container: Utils.id('image'),
        map: null,
        editor: Utils.id('editor')
    };

    public img: any = Utils.id('img');

    public state: any = {
        offset: {
            x: 0,
            y: 0
        },
        appMode: null, // drawing || editing || preview
        currentType: null,
        editType: null,
        newArea: null,
        selectedArea: null,
        areas: [],
        events: [],
        isDraw: false,
        image: {
            src: null,
            filename: null,
            width: 0,
            height: 0
        }
    };

    public static KEYS: any = {
        F1: 112,
        ESC: 27,
        TOP: 38,
        BOTTOM: 40,
        LEFT: 37,
        RIGHT: 39,
        DELETE: 46,
        I: 73,
        S: 83,
        C: 67
    };

    public cursor_position_info: CursorPositionInfo;
    // public info: Info = new Info();
    // public code: Code = new Code();
    public help: Help = new Help();
    public buttons: Buttons;

    public filename: any = null;

    constructor() {
        /* Get offset value */
        window.addEventListener('resize', this.recalcOffsetValues.bind(this), false);

        /* Disable selection */
        this.domElements.container.addEventListener('mousedown', (e) => {
            e.preventDefault();
        }, false);

        /* Disable image dragging */
        this.domElements.img.addEventListener('dragstart', (e) => {
            e.preventDefault();
        }, false);

        this.cursor_position_info = new CursorPositionInfo();

        this.domElements.container.addEventListener('mousemove', (e) => {
            this.cursor_position_info.set(Utils.getRightCoords(e.pageX, e.pageY));
        }, false);

        this.domElements.container.addEventListener('mouseleave', () => {
            this.cursor_position_info.empty();
        }, false);


        this.domElements.container.addEventListener('mousedown', this.onSvgMousedown.bind(this), false);
        this.domElements.container.addEventListener('click', this.onSvgClick.bind(this), false);
        this.domElements.container.addEventListener('dblclick', this.onAreaDblClick.bind(this), false);

        this.domElements.editor.addEventListener('keydown', this.onDocumentKeyDown.bind(this), false);

        this.buttons = new Buttons(this);
    }

    public recalcOffsetValues() {
        this.state.offset = Utils.getOffset(this.domElements.container);
    }

    /* Add mousedown event for svg */
    public onSvgMousedown(e: any) {
        if (this.state.appMode === 'editing') {
            if (e.target.parentNode.tagName === 'g') {
                // this.info.unload();
                this.state.selectedArea = e.target.parentNode.obj;
                this.deselectAll();
                this.state.selectedArea.select();
                this.state.selectedArea.delta = {
                    'x': e.pageX,
                    'y': e.pageY
                };

                if (e.target.classList.contains('helper')) {
                    var helper = e.target;
                    this.state.editType = helper.action;

                    if (helper.n >= 0) { // if typeof selected_area == polygon
                        this.state.selectedArea.selected_point = helper.n;
                    }

                    this.addEvent(this.domElements.container,
                        'mousemove',
                        this.state.selectedArea.onProcessEditing.bind(this.state.selectedArea))
                        .addEvent(this.domElements.container,
                            'mouseup',
                            this.state.selectedArea.onStopEditing.bind(this.state.selectedArea));
                } else if (e.target.tagName === 'rect' || e.target.tagName === 'circle' || e.target.tagName === 'polygon') {
                    this.state.editType = 'move';
                    this.addEvent(this.domElements.container,
                        'mousemove',
                        this.state.selectedArea.onProcessEditing.bind(this.state.selectedArea))
                        .addEvent(this.domElements.container,
                            'mouseup',
                            this.state.selectedArea.onStopEditing.bind(this.state.selectedArea));
                }
            } else {
                this.deselectAll();
                // this.info.unload();
            }
        }
    }

    /* Add click event for svg */
    public onSvgClick(e) {
        if (this.state.appMode === 'drawing' && !this.state.isDraw && this.state.currentType) {
            // this.code.hide();
            this.setIsDraw(true);

            this.state.newArea = AreaFactory.CONSTRUCTORS[this.state.currentType].createAndStartDrawing(
                Utils.getRightCoords(e.pageX, e.pageY)
            );
        }
    }

    /* Add dblclick event for svg */
    public onAreaDblClick(e) {
        if (this.state.appMode === 'editing') {
            if (e.target.tagName === 'rect' || e.target.tagName === 'circle' || e.target.tagName === 'polygon') {
                this.state.selectedArea = e.target.parentNode.obj;
                // this.info.load(this.state.selectedArea, e.pageX, e.pageY);
            }
        }
    }

    /* Add keydown event for document */
    public onDocumentKeyDown(e: any) {
        var ctrlDown = e.ctrlKey || e.metaKey; // PC || Mac

        switch (e.keyCode) {
            case EditorApp.KEYS.F1:
                this.help.show();
                e.preventDefault();

                break;

            case EditorApp.KEYS.ESC:
                this.help.hide();
                if (this.state.isDraw) {
                    this.state.isDraw = false;
                    this.state.newArea.remove();
                    this.state.areas.pop();
                    this.removeAllEvents();
                } else if (this.state.appMode === 'editing') {
                    this.state.selectedArea.redraw();
                    this.removeAllEvents();
                }

                break;

            case EditorApp.KEYS.TOP:
                if (this.state.appMode === 'editing' && this.state.selectedArea) {
                    this.state.selectedArea.setParams(
                        this.state.selectedArea.dynamicEdit(this.state.selectedArea.move(0, -1))
                    );
                    e.preventDefault();
                }

                break;

            case EditorApp.KEYS.BOTTOM:
                if (this.state.appMode === 'editing' && this.state.selectedArea) {
                    this.state.selectedArea.setParams(
                        this.state.selectedArea.dynamicEdit(this.state.selectedArea.move(0, 1))
                    );
                    e.preventDefault();
                }
                break;

            case EditorApp.KEYS.LEFT:
                if (this.state.appMode === 'editing' && this.state.selectedArea) {
                    this.state.selectedArea.setParams(
                        this.state.selectedArea.dynamicEdit(this.state.selectedArea.move(-1, 0))
                    );
                    e.preventDefault();
                }

                break;

            case EditorApp.KEYS.RIGHT:
                if (this.state.appMode === 'editing' && this.state.selectedArea) {
                    this.state.selectedArea.setParams(
                        this.state.selectedArea.dynamicEdit(this.state.selectedArea.move(1, 0))
                    );
                    e.preventDefault();
                }

                break;

            case EditorApp.KEYS.DELETE:
                if (this.state.appMode === 'editing' && this.state.selectedArea) {
                    this.removeObject(this.state.selectedArea);
                    this.state.selectedArea = null;
                    // this.info.unload();
                }

                break;

            case EditorApp.KEYS.I:
                if (this.state.appMode === 'editing' && this.state.selectedArea) {
                    var params = this.state.selectedArea.params,
                        x = params.x || params.cx || params[0],
                        y = params.y || params.cy || params[1];

                    // this.info.load(this.state.selectedArea, x + this.getOffset('x'), y + this.getOffset('y'));
                }

                break;

            case EditorApp.KEYS.C:
                if (this.state.appMode === 'editing' && this.state.selectedArea && ctrlDown) {
                    var Constructor = AreaFactory.CONSTRUCTORS[area_params.type],
                        area_params = this.state.selectedArea.toJSON();

                    if (Constructor) {
                        Constructor.createFromSaved(area_params);
                        this.state.selectedArea.setParams(this.state.selectedArea.move(10, 10));
                        this.state.selectedArea.redraw();
                    }
                }

                break;
        }
    }


    public hide() {
        Utils.hide(this.domElements.container);
        return this;
    }

    public show() {
        Utils.show(this.domElements.container);
        return this;
    }

    public setDimensions(width, height) {
        this.domElements.svg.setAttribute('width', width);
        this.domElements.svg.setAttribute('height', height);
        this.domElements.container.style.width = width + 'px';
        this.domElements.container.style.height = height + 'px';
        return this;
    }

    public onImageLoaded() {

    }

    public loadImage(url, width) {
        this.domElements.img.src = url;
        this.state.image.src = url;
        this.state.image.width = width;
        var tmp_arr = url.split('/');
        this.filename = tmp_arr[tmp_arr.length - 1];
        this.domElements.img.onload = () => {
            this.show()
                .setDimensions(this.domElements.img.width, this.domElements.img.height)
                .recalcOffsetValues();

            this.onImageLoaded();
        };

        this.setFilename(this.filename);

        this.preview();

        return this;
    }

    public preview() {
        this.domElements.img.setAttribute('usemap', '#map');
        this.domElements.map = document.createElement('map');
        this.domElements.map.setAttribute('name', 'map');
        this.domElements.container.appendChild(this.domElements.map);

        // Utils.hide(this.domElements.svg);
        // this.map.innerHTML = this.app.getHTMLCode();

//     return function () {
//         info.unload();
//         app.onEditingProcesshape(null);
//         Utils.hide(domElements.svg);
//         map.innerHTML = app.getHTMLCode();
//         code.print();
//         return this;
//     };
    }

    public hidePreview() {
        Utils.show(this.domElements.svg);
        this.domElements.map.innerHTML = '';
        return this;
    }

    public addNodeToSvg(node) {
        this.domElements.svg.appendChild(node);
        return this;
    }

    public removeNodeFromSvg(node) {
        this.domElements.svg.removeChild(node);
        return this;
    }

    public getOffset(arg) {
        switch (arg) {
            case 'x':
            case 'y':
                return this.state.offset[arg];
        }
    }

    public clear() {
        //remove all areas
        this.state.areas.length = 0;
        while (this.domElements.svg.childNodes[0]) {
            this.domElements.svg.removeChild(this.domElements.svg.childNodes[0]);
        }
        // this.code.hide();
        // this.info.unload();
        return this;
    }

    public removeObject(obj) {
        Utils.foreach(this.state.areas, function (x, i) {
            if (x === obj) {
                this.state.areas.splice(i, 1);
            }
        });
        obj.remove();
        this.state.areas.forEach(function (x, i) {
            switch (x.type) {
                case 'rectangle':
                    x._helpers.number.setNumber(i);
                    break;
                case 'polygon':
                    x._helpers[0].setNumber(i);
                    break;
                case 'circle':
                    x.helpers.number.setNumber(i);
                    break;
            }
        })
        return this;
    }

    public deselectAll() {
        Utils.foreach(this.state.areas, function (x) {
            x.deselect();
        });
        return this;
    }

    public getIsDraw() {
        return this.state.isDraw;
    }

    public setIsDraw(arg) {
        this.state.isDraw = arg;
        return this;
    }

    public setMode(arg) {
        this.onSetMode(arg);
        this.state.appMode = arg;
        return this;
    }

    public getMode() {
        return this.state.appMode;
    }

    public onSetMode(mode) {

    }

    public onCurrentType(type) {

    }

    public setShape(arg) {
        this.state.currentType = arg;
        this.onCurrentType(arg);
        return this;
    }

    public getShape() {
        return this.state.currentType;
    }

    public addObject(object) {
        this.state.areas.push(object);
        return this;
    }

    public getNewArea() {
        return this.state.newArea;
    }

    public resetNewArea() {
        this.state.newArea = null;
        return this;
    }

    public getSelectedArea() {
        return this.state.selectedArea;
    }

    setSelectedArea(obj) {
        this.state.selectedArea = obj;
        return this;
    }

    public getEditType() {
        return this.state.editType;
    }

    public setFilename(str) {
        this.state.image.filename = str;
        return this;
    }

    public setEditClass() {
        this.domElements.container.classList.remove('draw');
        this.domElements.container.classList.add('edit');

        return this;
    }

    public setDrawClass() {
        this.domElements.container.classList.remove('edit');
        this.domElements.container.classList.add('draw');

        return this;
    }

    public setDefaultClass() {
        this.domElements.container.classList.remove('edit');
        this.domElements.container.classList.remove('draw');

        return this;
    }

    public addEvent(target, eventType, func) {
        this.state.events.push(new AppEvent(target, eventType, func));
        return this;
    }

    public removeAllEvents() {
        Utils.foreach(this.state.events, function (x) {
            x.remove();
        });
        this.state.events.length = 0;
        return this;
    }

    public loadJSON(str, width) {
        var obj = JSON.parse(str);
        this.loadImage(obj.img, width);
        return
    }

    public getAreas() {
        return this.state.areas;
    }

    public getAreasJSON(scale) {
        if (scale === undefined) {
            scale = 1;
        }
        var obj = {
            areas: [],
            img: this.state.image.src
        };
        Utils.foreach(this.state.areas, function (x) {
            var data = x.toJSON();
            if (data.type != 'polygon') {
                data.coords.forEach(function (item, i, arr) {
                    data.coords[i] = (Math.round(item * scale));
                });
            }
            obj.areas.push(data);
        });
        return JSON.stringify(obj);
    }

    public getHTMLCode(arg) {
        var html_code = '';
        if (arg) {
            if (!this.state.areas.length) {
                return '0 objects';
            }
            html_code += Utils.encode('<img src="' + this.state.image.filename + '" alt="" usemap="#map" />') +
                '<br />' + Utils.encode('<map name="map">') + '<br />';
            Utils.foreachReverse(this.state.areas, function (x) {
                html_code += '&nbsp;&nbsp;&nbsp;&nbsp;' + Utils.encode(x.toString()) + '<br />';
            });
            html_code += Utils.encode('</map>');
        } else {
            Utils.foreachReverse(this.state.areas, function (x) {
                html_code += x.toString();
            });
        }
        return html_code;
    }
}