import { Utils } from './utils.class';
// import {Info} from './info.class';
// import {Code} from './code.class';
import { Help } from './help.class';
import { AreaFactory } from './area-factory.class';
import { AppEvent } from './app-event.class';
import { Buttons } from './buttons.class';
export class CursorPositionInfo {
    constructor() {
        this._coords_info = Utils.id('coords');
    }
    set(coords) {
        this._coords_info.innerHTML = 'x: ' + coords.x + ', ' + 'y: ' + coords.y;
    }
    empty() {
        this._coords_info.innerHTML = '';
    }
}
export class EditorApp {
    constructor() {
        this.domElements = {
            wrapper: Utils.id('wrapper'),
            svg: Utils.id('svg'),
            img: Utils.id('img'),
            container: Utils.id('image'),
            map: null,
            editor: Utils.id('editor')
        };
        this.img = Utils.id('img');
        this.state = {
            offset: {
                x: 0,
                y: 0
            },
            appMode: null,
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
        // public info: Info = new Info();
        // public code: Code = new Code();
        this.help = new Help();
        this.filename = null;
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
    recalcOffsetValues() {
        this.state.offset = Utils.getOffset(this.domElements.container);
    }
    /* Add mousedown event for svg */
    onSvgMousedown(e) {
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
                    this.addEvent(this.domElements.container, 'mousemove', this.state.selectedArea.onProcessEditing.bind(this.state.selectedArea))
                        .addEvent(this.domElements.container, 'mouseup', this.state.selectedArea.onStopEditing.bind(this.state.selectedArea));
                }
                else if (e.target.tagName === 'rect' || e.target.tagName === 'circle' || e.target.tagName === 'polygon') {
                    this.state.editType = 'move';
                    this.addEvent(this.domElements.container, 'mousemove', this.state.selectedArea.onProcessEditing.bind(this.state.selectedArea))
                        .addEvent(this.domElements.container, 'mouseup', this.state.selectedArea.onStopEditing.bind(this.state.selectedArea));
                }
            }
            else {
                this.deselectAll();
                // this.info.unload();
            }
        }
    }
    /* Add click event for svg */
    onSvgClick(e) {
        if (this.state.appMode === 'drawing' && !this.state.isDraw && this.state.currentType) {
            // this.code.hide();
            this.setIsDraw(true);
            this.state.newArea = AreaFactory.CONSTRUCTORS[this.state.currentType].createAndStartDrawing(Utils.getRightCoords(e.pageX, e.pageY));
        }
    }
    /* Add dblclick event for svg */
    onAreaDblClick(e) {
        if (this.state.appMode === 'editing') {
            if (e.target.tagName === 'rect' || e.target.tagName === 'circle' || e.target.tagName === 'polygon') {
                this.state.selectedArea = e.target.parentNode.obj;
                // this.info.load(this.state.selectedArea, e.pageX, e.pageY);
            }
        }
    }
    /* Add keydown event for document */
    onDocumentKeyDown(e) {
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
                }
                else if (this.state.appMode === 'editing') {
                    this.state.selectedArea.redraw();
                    this.removeAllEvents();
                }
                break;
            case EditorApp.KEYS.TOP:
                if (this.state.appMode === 'editing' && this.state.selectedArea) {
                    this.state.selectedArea.setParams(this.state.selectedArea.dynamicEdit(this.state.selectedArea.move(0, -1)));
                    e.preventDefault();
                }
                break;
            case EditorApp.KEYS.BOTTOM:
                if (this.state.appMode === 'editing' && this.state.selectedArea) {
                    this.state.selectedArea.setParams(this.state.selectedArea.dynamicEdit(this.state.selectedArea.move(0, 1)));
                    e.preventDefault();
                }
                break;
            case EditorApp.KEYS.LEFT:
                if (this.state.appMode === 'editing' && this.state.selectedArea) {
                    this.state.selectedArea.setParams(this.state.selectedArea.dynamicEdit(this.state.selectedArea.move(-1, 0)));
                    e.preventDefault();
                }
                break;
            case EditorApp.KEYS.RIGHT:
                if (this.state.appMode === 'editing' && this.state.selectedArea) {
                    this.state.selectedArea.setParams(this.state.selectedArea.dynamicEdit(this.state.selectedArea.move(1, 0)));
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
                    var params = this.state.selectedArea.params, x = params.x || params.cx || params[0], y = params.y || params.cy || params[1];
                    // this.info.load(this.state.selectedArea, x + this.getOffset('x'), y + this.getOffset('y'));
                }
                break;
            case EditorApp.KEYS.C:
                if (this.state.appMode === 'editing' && this.state.selectedArea && ctrlDown) {
                    var Constructor = AreaFactory.CONSTRUCTORS[area_params.type], area_params = this.state.selectedArea.toJSON();
                    if (Constructor) {
                        Constructor.createFromSaved(area_params);
                        this.state.selectedArea.setParams(this.state.selectedArea.move(10, 10));
                        this.state.selectedArea.redraw();
                    }
                }
                break;
        }
    }
    hide() {
        Utils.hide(this.domElements.container);
        return this;
    }
    show() {
        Utils.show(this.domElements.container);
        return this;
    }
    setDimensions(width, height) {
        this.domElements.svg.setAttribute('width', width);
        this.domElements.svg.setAttribute('height', height);
        this.domElements.container.style.width = width + 'px';
        this.domElements.container.style.height = height + 'px';
        return this;
    }
    onImageLoaded(state) {
    }
    loadImage(url, width) {
        this.domElements.img.src = url;
        this.state.image.src = url;
        this.state.image.width = width;
        var tmp_arr = url.split('/');
        this.filename = tmp_arr[tmp_arr.length - 1];
        this.domElements.img.onload = () => {
            this.show()
                .setDimensions(this.domElements.img.width, this.domElements.img.height)
                .recalcOffsetValues();
            this.onImageLoaded(this.state);
        };
        this.setFilename(this.filename);
        this.preview();
        return this;
    }
    preview() {
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
    hidePreview() {
        Utils.show(this.domElements.svg);
        this.domElements.map.innerHTML = '';
        return this;
    }
    addNodeToSvg(node) {
        this.domElements.svg.appendChild(node);
        return this;
    }
    removeNodeFromSvg(node) {
        this.domElements.svg.removeChild(node);
        return this;
    }
    getOffset(arg) {
        switch (arg) {
            case 'x':
            case 'y':
                return this.state.offset[arg];
        }
    }
    clear() {
        //remove all areas
        this.state.areas.length = 0;
        while (this.domElements.svg.childNodes[0]) {
            this.domElements.svg.removeChild(this.domElements.svg.childNodes[0]);
        }
        // this.code.hide();
        // this.info.unload();
        return this;
    }
    removeObject(obj) {
        Utils.foreach(this.state.areas, (x, i) => {
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
                    x._helpers.number.setNumber(i);
                    break;
            }
        });
        return this;
    }
    deselectAll() {
        Utils.foreach(this.state.areas, function (x) {
            x.deselect();
        });
        return this;
    }
    getIsDraw() {
        return this.state.isDraw;
    }
    setIsDraw(arg) {
        this.state.isDraw = arg;
        return this;
    }
    setMode(arg) {
        this.onSetMode(arg);
        this.state.appMode = arg;
        return this;
    }
    getMode() {
        return this.state.appMode;
    }
    onSetMode(mode) {
    }
    onCurrentType(type) {
    }
    setShape(arg) {
        this.state.currentType = arg;
        this.onCurrentType(arg);
        return this;
    }
    getShape() {
        return this.state.currentType;
    }
    addObject(object) {
        this.state.areas.push(object);
        return this;
    }
    getNewArea() {
        return this.state.newArea;
    }
    resetNewArea() {
        this.state.newArea = null;
        return this;
    }
    getSelectedArea() {
        return this.state.selectedArea;
    }
    setSelectedArea(obj) {
        this.state.selectedArea = obj;
        return this;
    }
    getEditType() {
        return this.state.editType;
    }
    setFilename(str) {
        this.state.image.filename = str;
        return this;
    }
    setEditClass() {
        this.domElements.container.classList.remove('draw');
        this.domElements.container.classList.add('edit');
        return this;
    }
    setDrawClass() {
        this.domElements.container.classList.remove('edit');
        this.domElements.container.classList.add('draw');
        return this;
    }
    setDefaultClass() {
        this.domElements.container.classList.remove('edit');
        this.domElements.container.classList.remove('draw');
        return this;
    }
    addEvent(target, eventType, func) {
        this.state.events.push(new AppEvent(target, eventType, func));
        return this;
    }
    removeAllEvents() {
        Utils.foreach(this.state.events, function (x) {
            x.remove();
        });
        this.state.events.length = 0;
        return this;
    }
    // public loadJSON(str, width) {
    //     var obj = JSON.parse(str);
    //     this.loadImage(obj.img, width);
    //     return
    // }
    getAreas() {
        return this.state.areas;
    }
    getAreasJSON(scale) {
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
    getHTMLCode(arg) {
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
        }
        else {
            Utils.foreachReverse(this.state.areas, function (x) {
                html_code += x.toString();
            });
        }
        return html_code;
    }
}
EditorApp.KEYS = {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLWFwcC5jbGFzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lZGl0b3ItYXBwLmNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDcEMscUNBQXFDO0FBQ3JDLHFDQUFxQztBQUNyQyxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ2xDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNqRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDM0MsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRXhDLE1BQU0sT0FBTyxrQkFBa0I7SUFBL0I7UUFDWSxpQkFBWSxHQUFRLEtBQUssQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7SUFTbkQsQ0FBQztJQVBVLEdBQUcsQ0FBQyxNQUFXO1FBQ2xCLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBRU0sS0FBSztRQUNSLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUNyQyxDQUFDO0NBQ0o7QUFHRCxNQUFNLE9BQU8sU0FBUztJQXNEbEI7UUFyRE8sZ0JBQVcsR0FBUTtZQUN0QixPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUM7WUFDNUIsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDO1lBQ3BCLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQztZQUNwQixTQUFTLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUM7WUFDNUIsR0FBRyxF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SCxTQUFTLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUN2QzthQUFNO1lBQ0gsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUM7Z0JBQzlDLFNBQVMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDOUIsQ0FBQyxDQUFDLENBQUM7U0FDTjtRQUNELE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7O0FBdmZhLGNBQUksR0FBUTtJQUN0QixFQUFFLEVBQUUsR0FBRztJQUNQLEdBQUcsRUFBRSxFQUFFO0lBQ1AsR0FBRyxFQUFFLEVBQUU7SUFDUCxNQUFNLEVBQUUsRUFBRTtJQUNWLElBQUksRUFBRSxFQUFFO0lBQ1IsS0FBSyxFQUFFLEVBQUU7SUFDVCxNQUFNLEVBQUUsRUFBRTtJQUNWLENBQUMsRUFBRSxFQUFFO0lBQ0wsQ0FBQyxFQUFFLEVBQUU7SUFDTCxDQUFDLEVBQUUsRUFBRTtDQUNSLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1V0aWxzfSBmcm9tICcuL3V0aWxzLmNsYXNzJztcbi8vIGltcG9ydCB7SW5mb30gZnJvbSAnLi9pbmZvLmNsYXNzJztcbi8vIGltcG9ydCB7Q29kZX0gZnJvbSAnLi9jb2RlLmNsYXNzJztcbmltcG9ydCB7SGVscH0gZnJvbSAnLi9oZWxwLmNsYXNzJztcbmltcG9ydCB7QXJlYUZhY3Rvcnl9IGZyb20gJy4vYXJlYS1mYWN0b3J5LmNsYXNzJztcbmltcG9ydCB7QXBwRXZlbnR9IGZyb20gJy4vYXBwLWV2ZW50LmNsYXNzJztcbmltcG9ydCB7QnV0dG9uc30gZnJvbSAnLi9idXR0b25zLmNsYXNzJztcblxuZXhwb3J0IGNsYXNzIEN1cnNvclBvc2l0aW9uSW5mbyB7XG4gICAgcHJpdmF0ZSBfY29vcmRzX2luZm86IGFueSA9IFV0aWxzLmlkKCdjb29yZHMnKTtcblxuICAgIHB1YmxpYyBzZXQoY29vcmRzOiBhbnkpIHtcbiAgICAgICAgdGhpcy5fY29vcmRzX2luZm8uaW5uZXJIVE1MID0gJ3g6ICcgKyBjb29yZHMueCArICcsICcgKyAneTogJyArIGNvb3Jkcy55O1xuICAgIH1cblxuICAgIHB1YmxpYyBlbXB0eSgpIHtcbiAgICAgICAgdGhpcy5fY29vcmRzX2luZm8uaW5uZXJIVE1MID0gJyc7XG4gICAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBFZGl0b3JBcHAge1xuICAgIHB1YmxpYyBkb21FbGVtZW50czogYW55ID0ge1xuICAgICAgICB3cmFwcGVyOiBVdGlscy5pZCgnd3JhcHBlcicpLFxuICAgICAgICBzdmc6IFV0aWxzLmlkKCdzdmcnKSxcbiAgICAgICAgaW1nOiBVdGlscy5pZCgnaW1nJyksXG4gICAgICAgIGNvbnRhaW5lcjogVXRpbHMuaWQoJ2ltYWdlJyksXG4gICAgICAgIG1hcDogbnVsbCxcbiAgICAgICAgZWRpdG9yOiBVdGlscy5pZCgnZWRpdG9yJylcbiAgICB9O1xuXG4gICAgcHVibGljIGltZzogYW55ID0gVXRpbHMuaWQoJ2ltZycpO1xuXG4gICAgcHVibGljIHN0YXRlOiBhbnkgPSB7XG4gICAgICAgIG9mZnNldDoge1xuICAgICAgICAgICAgeDogMCxcbiAgICAgICAgICAgIHk6IDBcbiAgICAgICAgfSxcbiAgICAgICAgYXBwTW9kZTogbnVsbCwgLy8gZHJhd2luZyB8fCBlZGl0aW5nIHx8IHByZXZpZXdcbiAgICAgICAgY3VycmVudFR5cGU6IG51bGwsXG4gICAgICAgIGVkaXRUeXBlOiBudWxsLFxuICAgICAgICBuZXdBcmVhOiBudWxsLFxuICAgICAgICBzZWxlY3RlZEFyZWE6IG51bGwsXG4gICAgICAgIGFyZWFzOiBbXSxcbiAgICAgICAgZXZlbnRzOiBbXSxcbiAgICAgICAgaXNEcmF3OiBmYWxzZSxcbiAgICAgICAgaW1hZ2U6IHtcbiAgICAgICAgICAgIHNyYzogbnVsbCxcbiAgICAgICAgICAgIGZpbGVuYW1lOiBudWxsLFxuICAgICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDBcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBwdWJsaWMgc3RhdGljIEtFWVM6IGFueSA9IHtcbiAgICAgICAgRjE6IDExMixcbiAgICAgICAgRVNDOiAyNyxcbiAgICAgICAgVE9QOiAzOCxcbiAgICAgICAgQk9UVE9NOiA0MCxcbiAgICAgICAgTEVGVDogMzcsXG4gICAgICAgIFJJR0hUOiAzOSxcbiAgICAgICAgREVMRVRFOiA0NixcbiAgICAgICAgSTogNzMsXG4gICAgICAgIFM6IDgzLFxuICAgICAgICBDOiA2N1xuICAgIH07XG5cbiAgICBwdWJsaWMgY3Vyc29yX3Bvc2l0aW9uX2luZm86IEN1cnNvclBvc2l0aW9uSW5mbztcbiAgICAvLyBwdWJsaWMgaW5mbzogSW5mbyA9IG5ldyBJbmZvKCk7XG4gICAgLy8gcHVibGljIGNvZGU6IENvZGUgPSBuZXcgQ29kZSgpO1xuICAgIHB1YmxpYyBoZWxwOiBIZWxwID0gbmV3IEhlbHAoKTtcbiAgICBwdWJsaWMgYnV0dG9uczogQnV0dG9ucztcblxuICAgIHB1YmxpYyBmaWxlbmFtZTogYW55ID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvKiBHZXQgb2Zmc2V0IHZhbHVlICovXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLnJlY2FsY09mZnNldFZhbHVlcy5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cbiAgICAgICAgLyogRGlzYWJsZSBzZWxlY3Rpb24gKi9cbiAgICAgICAgdGhpcy5kb21FbGVtZW50cy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSwgZmFsc2UpO1xuXG4gICAgICAgIC8qIERpc2FibGUgaW1hZ2UgZHJhZ2dpbmcgKi9cbiAgICAgICAgdGhpcy5kb21FbGVtZW50cy5pbWcuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSwgZmFsc2UpO1xuXG4gICAgICAgIHRoaXMuY3Vyc29yX3Bvc2l0aW9uX2luZm8gPSBuZXcgQ3Vyc29yUG9zaXRpb25JbmZvKCk7XG5cbiAgICAgICAgdGhpcy5kb21FbGVtZW50cy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY3Vyc29yX3Bvc2l0aW9uX2luZm8uc2V0KFV0aWxzLmdldFJpZ2h0Q29vcmRzKGUucGFnZVgsIGUucGFnZVkpKTtcbiAgICAgICAgfSwgZmFsc2UpO1xuXG4gICAgICAgIHRoaXMuZG9tRWxlbWVudHMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmN1cnNvcl9wb3NpdGlvbl9pbmZvLmVtcHR5KCk7XG4gICAgICAgIH0sIGZhbHNlKTtcblxuXG4gICAgICAgIHRoaXMuZG9tRWxlbWVudHMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMub25TdmdNb3VzZWRvd24uYmluZCh0aGlzKSwgZmFsc2UpO1xuICAgICAgICB0aGlzLmRvbUVsZW1lbnRzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25TdmdDbGljay5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuZG9tRWxlbWVudHMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgdGhpcy5vbkFyZWFEYmxDbGljay5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cbiAgICAgICAgdGhpcy5kb21FbGVtZW50cy5lZGl0b3IuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMub25Eb2N1bWVudEtleURvd24uYmluZCh0aGlzKSwgZmFsc2UpO1xuXG4gICAgICAgIHRoaXMuYnV0dG9ucyA9IG5ldyBCdXR0b25zKHRoaXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyByZWNhbGNPZmZzZXRWYWx1ZXMoKSB7XG4gICAgICAgIHRoaXMuc3RhdGUub2Zmc2V0ID0gVXRpbHMuZ2V0T2Zmc2V0KHRoaXMuZG9tRWxlbWVudHMuY29udGFpbmVyKTtcbiAgICB9XG5cbiAgICAvKiBBZGQgbW91c2Vkb3duIGV2ZW50IGZvciBzdmcgKi9cbiAgICBwdWJsaWMgb25TdmdNb3VzZWRvd24oZTogYW55KSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmFwcE1vZGUgPT09ICdlZGl0aW5nJykge1xuICAgICAgICAgICAgaWYgKGUudGFyZ2V0LnBhcmVudE5vZGUudGFnTmFtZSA9PT0gJ2cnKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcy5pbmZvLnVubG9hZCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2VsZWN0ZWRBcmVhID0gZS50YXJnZXQucGFyZW50Tm9kZS5vYmo7XG4gICAgICAgICAgICAgICAgdGhpcy5kZXNlbGVjdEFsbCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2VsZWN0ZWRBcmVhLnNlbGVjdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2VsZWN0ZWRBcmVhLmRlbHRhID0ge1xuICAgICAgICAgICAgICAgICAgICAneCc6IGUucGFnZVgsXG4gICAgICAgICAgICAgICAgICAgICd5JzogZS5wYWdlWVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoZWxwZXInKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGVscGVyID0gZS50YXJnZXQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuZWRpdFR5cGUgPSBoZWxwZXIuYWN0aW9uO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChoZWxwZXIubiA+PSAwKSB7IC8vIGlmIHR5cGVvZiBzZWxlY3RlZF9hcmVhID09IHBvbHlnb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2VsZWN0ZWRBcmVhLnNlbGVjdGVkX3BvaW50ID0gaGVscGVyLm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZEV2ZW50KHRoaXMuZG9tRWxlbWVudHMuY29udGFpbmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ21vdXNlbW92ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnNlbGVjdGVkQXJlYS5vblByb2Nlc3NFZGl0aW5nLmJpbmQodGhpcy5zdGF0ZS5zZWxlY3RlZEFyZWEpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZEV2ZW50KHRoaXMuZG9tRWxlbWVudHMuY29udGFpbmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdtb3VzZXVwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnNlbGVjdGVkQXJlYS5vblN0b3BFZGl0aW5nLmJpbmQodGhpcy5zdGF0ZS5zZWxlY3RlZEFyZWEpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGUudGFyZ2V0LnRhZ05hbWUgPT09ICdyZWN0JyB8fCBlLnRhcmdldC50YWdOYW1lID09PSAnY2lyY2xlJyB8fCBlLnRhcmdldC50YWdOYW1lID09PSAncG9seWdvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5lZGl0VHlwZSA9ICdtb3ZlJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRFdmVudCh0aGlzLmRvbUVsZW1lbnRzLmNvbnRhaW5lcixcbiAgICAgICAgICAgICAgICAgICAgICAgICdtb3VzZW1vdmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5zZWxlY3RlZEFyZWEub25Qcm9jZXNzRWRpdGluZy5iaW5kKHRoaXMuc3RhdGUuc2VsZWN0ZWRBcmVhKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRFdmVudCh0aGlzLmRvbUVsZW1lbnRzLmNvbnRhaW5lcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbW91c2V1cCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5zZWxlY3RlZEFyZWEub25TdG9wRWRpdGluZy5iaW5kKHRoaXMuc3RhdGUuc2VsZWN0ZWRBcmVhKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2VsZWN0QWxsKCk7XG4gICAgICAgICAgICAgICAgLy8gdGhpcy5pbmZvLnVubG9hZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyogQWRkIGNsaWNrIGV2ZW50IGZvciBzdmcgKi9cbiAgICBwdWJsaWMgb25TdmdDbGljayhlKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmFwcE1vZGUgPT09ICdkcmF3aW5nJyAmJiAhdGhpcy5zdGF0ZS5pc0RyYXcgJiYgdGhpcy5zdGF0ZS5jdXJyZW50VHlwZSkge1xuICAgICAgICAgICAgLy8gdGhpcy5jb2RlLmhpZGUoKTtcbiAgICAgICAgICAgIHRoaXMuc2V0SXNEcmF3KHRydWUpO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXRlLm5ld0FyZWEgPSBBcmVhRmFjdG9yeS5DT05TVFJVQ1RPUlNbdGhpcy5zdGF0ZS5jdXJyZW50VHlwZV0uY3JlYXRlQW5kU3RhcnREcmF3aW5nKFxuICAgICAgICAgICAgICAgIFV0aWxzLmdldFJpZ2h0Q29vcmRzKGUucGFnZVgsIGUucGFnZVkpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyogQWRkIGRibGNsaWNrIGV2ZW50IGZvciBzdmcgKi9cbiAgICBwdWJsaWMgb25BcmVhRGJsQ2xpY2soZSkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5hcHBNb2RlID09PSAnZWRpdGluZycpIHtcbiAgICAgICAgICAgIGlmIChlLnRhcmdldC50YWdOYW1lID09PSAncmVjdCcgfHwgZS50YXJnZXQudGFnTmFtZSA9PT0gJ2NpcmNsZScgfHwgZS50YXJnZXQudGFnTmFtZSA9PT0gJ3BvbHlnb24nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5zZWxlY3RlZEFyZWEgPSBlLnRhcmdldC5wYXJlbnROb2RlLm9iajtcbiAgICAgICAgICAgICAgICAvLyB0aGlzLmluZm8ubG9hZCh0aGlzLnN0YXRlLnNlbGVjdGVkQXJlYSwgZS5wYWdlWCwgZS5wYWdlWSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiBBZGQga2V5ZG93biBldmVudCBmb3IgZG9jdW1lbnQgKi9cbiAgICBwdWJsaWMgb25Eb2N1bWVudEtleURvd24oZTogYW55KSB7XG4gICAgICAgIHZhciBjdHJsRG93biA9IGUuY3RybEtleSB8fCBlLm1ldGFLZXk7IC8vIFBDIHx8IE1hY1xuXG4gICAgICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4gICAgICAgICAgICBjYXNlIEVkaXRvckFwcC5LRVlTLkYxOlxuICAgICAgICAgICAgICAgIHRoaXMuaGVscC5zaG93KCk7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgRWRpdG9yQXBwLktFWVMuRVNDOlxuICAgICAgICAgICAgICAgIHRoaXMuaGVscC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuaXNEcmF3KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuaXNEcmF3ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUubmV3QXJlYS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5hcmVhcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVBbGxFdmVudHMoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuYXBwTW9kZSA9PT0gJ2VkaXRpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2VsZWN0ZWRBcmVhLnJlZHJhdygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUFsbEV2ZW50cygpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIEVkaXRvckFwcC5LRVlTLlRPUDpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5hcHBNb2RlID09PSAnZWRpdGluZycgJiYgdGhpcy5zdGF0ZS5zZWxlY3RlZEFyZWEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5zZWxlY3RlZEFyZWEuc2V0UGFyYW1zKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5zZWxlY3RlZEFyZWEuZHluYW1pY0VkaXQodGhpcy5zdGF0ZS5zZWxlY3RlZEFyZWEubW92ZSgwLCAtMSkpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBFZGl0b3JBcHAuS0VZUy5CT1RUT006XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuYXBwTW9kZSA9PT0gJ2VkaXRpbmcnICYmIHRoaXMuc3RhdGUuc2VsZWN0ZWRBcmVhKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2VsZWN0ZWRBcmVhLnNldFBhcmFtcyhcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2VsZWN0ZWRBcmVhLmR5bmFtaWNFZGl0KHRoaXMuc3RhdGUuc2VsZWN0ZWRBcmVhLm1vdmUoMCwgMSkpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgRWRpdG9yQXBwLktFWVMuTEVGVDpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5hcHBNb2RlID09PSAnZWRpdGluZycgJiYgdGhpcy5zdGF0ZS5zZWxlY3RlZEFyZWEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5zZWxlY3RlZEFyZWEuc2V0UGFyYW1zKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5zZWxlY3RlZEFyZWEuZHluYW1pY0VkaXQodGhpcy5zdGF0ZS5zZWxlY3RlZEFyZWEubW92ZSgtMSwgMCkpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBFZGl0b3JBcHAuS0VZUy5SSUdIVDpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5hcHBNb2RlID09PSAnZWRpdGluZycgJiYgdGhpcy5zdGF0ZS5zZWxlY3RlZEFyZWEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5zZWxlY3RlZEFyZWEuc2V0UGFyYW1zKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5zZWxlY3RlZEFyZWEuZHluYW1pY0VkaXQodGhpcy5zdGF0ZS5zZWxlY3RlZEFyZWEubW92ZSgxLCAwKSlcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIEVkaXRvckFwcC5LRVlTLkRFTEVURTpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5hcHBNb2RlID09PSAnZWRpdGluZycgJiYgdGhpcy5zdGF0ZS5zZWxlY3RlZEFyZWEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVPYmplY3QodGhpcy5zdGF0ZS5zZWxlY3RlZEFyZWEpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnNlbGVjdGVkQXJlYSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuaW5mby51bmxvYWQoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBFZGl0b3JBcHAuS0VZUy5JOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmFwcE1vZGUgPT09ICdlZGl0aW5nJyAmJiB0aGlzLnN0YXRlLnNlbGVjdGVkQXJlYSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGFyYW1zID0gdGhpcy5zdGF0ZS5zZWxlY3RlZEFyZWEucGFyYW1zLFxuICAgICAgICAgICAgICAgICAgICAgICAgeCA9IHBhcmFtcy54IHx8IHBhcmFtcy5jeCB8fCBwYXJhbXNbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICB5ID0gcGFyYW1zLnkgfHwgcGFyYW1zLmN5IHx8IHBhcmFtc1sxXTtcblxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmluZm8ubG9hZCh0aGlzLnN0YXRlLnNlbGVjdGVkQXJlYSwgeCArIHRoaXMuZ2V0T2Zmc2V0KCd4JyksIHkgKyB0aGlzLmdldE9mZnNldCgneScpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBFZGl0b3JBcHAuS0VZUy5DOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmFwcE1vZGUgPT09ICdlZGl0aW5nJyAmJiB0aGlzLnN0YXRlLnNlbGVjdGVkQXJlYSAmJiBjdHJsRG93bikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgQ29uc3RydWN0b3IgPSBBcmVhRmFjdG9yeS5DT05TVFJVQ1RPUlNbYXJlYV9wYXJhbXMudHlwZV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmVhX3BhcmFtcyA9IHRoaXMuc3RhdGUuc2VsZWN0ZWRBcmVhLnRvSlNPTigpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChDb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgQ29uc3RydWN0b3IuY3JlYXRlRnJvbVNhdmVkKGFyZWFfcGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2VsZWN0ZWRBcmVhLnNldFBhcmFtcyh0aGlzLnN0YXRlLnNlbGVjdGVkQXJlYS5tb3ZlKDEwLCAxMCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5zZWxlY3RlZEFyZWEucmVkcmF3KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgcHVibGljIGhpZGUoKSB7XG4gICAgICAgIFV0aWxzLmhpZGUodGhpcy5kb21FbGVtZW50cy5jb250YWluZXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwdWJsaWMgc2hvdygpIHtcbiAgICAgICAgVXRpbHMuc2hvdyh0aGlzLmRvbUVsZW1lbnRzLmNvbnRhaW5lcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXREaW1lbnNpb25zKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgdGhpcy5kb21FbGVtZW50cy5zdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHdpZHRoKTtcbiAgICAgICAgdGhpcy5kb21FbGVtZW50cy5zdmcuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBoZWlnaHQpO1xuICAgICAgICB0aGlzLmRvbUVsZW1lbnRzLmNvbnRhaW5lci5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4JztcbiAgICAgICAgdGhpcy5kb21FbGVtZW50cy5jb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcHVibGljIG9uSW1hZ2VMb2FkZWQoc3RhdGU6IGFueSkge1xuXG4gICAgfVxuXG4gICAgcHVibGljIGxvYWRJbWFnZSh1cmwsIHdpZHRoKSB7XG4gICAgICAgIHRoaXMuZG9tRWxlbWVudHMuaW1nLnNyYyA9IHVybDtcbiAgICAgICAgdGhpcy5zdGF0ZS5pbWFnZS5zcmMgPSB1cmw7XG4gICAgICAgIHRoaXMuc3RhdGUuaW1hZ2Uud2lkdGggPSB3aWR0aDtcbiAgICAgICAgdmFyIHRtcF9hcnIgPSB1cmwuc3BsaXQoJy8nKTtcbiAgICAgICAgdGhpcy5maWxlbmFtZSA9IHRtcF9hcnJbdG1wX2Fyci5sZW5ndGggLSAxXTtcbiAgICAgICAgdGhpcy5kb21FbGVtZW50cy5pbWcub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zaG93KClcbiAgICAgICAgICAgICAgICAuc2V0RGltZW5zaW9ucyh0aGlzLmRvbUVsZW1lbnRzLmltZy53aWR0aCwgdGhpcy5kb21FbGVtZW50cy5pbWcuaGVpZ2h0KVxuICAgICAgICAgICAgICAgIC5yZWNhbGNPZmZzZXRWYWx1ZXMoKTtcblxuICAgICAgICAgICAgdGhpcy5vbkltYWdlTG9hZGVkKHRoaXMuc3RhdGUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuc2V0RmlsZW5hbWUodGhpcy5maWxlbmFtZSk7XG5cbiAgICAgICAgdGhpcy5wcmV2aWV3KCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcHVibGljIHByZXZpZXcoKSB7XG4gICAgICAgIHRoaXMuZG9tRWxlbWVudHMuaW1nLnNldEF0dHJpYnV0ZSgndXNlbWFwJywgJyNtYXAnKTtcbiAgICAgICAgdGhpcy5kb21FbGVtZW50cy5tYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdtYXAnKTtcbiAgICAgICAgdGhpcy5kb21FbGVtZW50cy5tYXAuc2V0QXR0cmlidXRlKCduYW1lJywgJ21hcCcpO1xuICAgICAgICB0aGlzLmRvbUVsZW1lbnRzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmRvbUVsZW1lbnRzLm1hcCk7XG5cbiAgICAgICAgLy8gVXRpbHMuaGlkZSh0aGlzLmRvbUVsZW1lbnRzLnN2Zyk7XG4gICAgICAgIC8vIHRoaXMubWFwLmlubmVySFRNTCA9IHRoaXMuYXBwLmdldEhUTUxDb2RlKCk7XG5cbi8vICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuLy8gICAgICAgICBpbmZvLnVubG9hZCgpO1xuLy8gICAgICAgICBhcHAub25FZGl0aW5nUHJvY2Vzc2hhcGUobnVsbCk7XG4vLyAgICAgICAgIFV0aWxzLmhpZGUoZG9tRWxlbWVudHMuc3ZnKTtcbi8vICAgICAgICAgbWFwLmlubmVySFRNTCA9IGFwcC5nZXRIVE1MQ29kZSgpO1xuLy8gICAgICAgICBjb2RlLnByaW50KCk7XG4vLyAgICAgICAgIHJldHVybiB0aGlzO1xuLy8gICAgIH07XG4gICAgfVxuXG4gICAgcHVibGljIGhpZGVQcmV2aWV3KCkge1xuICAgICAgICBVdGlscy5zaG93KHRoaXMuZG9tRWxlbWVudHMuc3ZnKTtcbiAgICAgICAgdGhpcy5kb21FbGVtZW50cy5tYXAuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHB1YmxpYyBhZGROb2RlVG9Tdmcobm9kZSkge1xuICAgICAgICB0aGlzLmRvbUVsZW1lbnRzLnN2Zy5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcHVibGljIHJlbW92ZU5vZGVGcm9tU3ZnKG5vZGUpIHtcbiAgICAgICAgdGhpcy5kb21FbGVtZW50cy5zdmcucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRPZmZzZXQoYXJnKSB7XG4gICAgICAgIHN3aXRjaCAoYXJnKSB7XG4gICAgICAgICAgICBjYXNlICd4JzpcbiAgICAgICAgICAgIGNhc2UgJ3knOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnN0YXRlLm9mZnNldFthcmddO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFyKCkge1xuICAgICAgICAvL3JlbW92ZSBhbGwgYXJlYXNcbiAgICAgICAgdGhpcy5zdGF0ZS5hcmVhcy5sZW5ndGggPSAwO1xuICAgICAgICB3aGlsZSAodGhpcy5kb21FbGVtZW50cy5zdmcuY2hpbGROb2Rlc1swXSkge1xuICAgICAgICAgICAgdGhpcy5kb21FbGVtZW50cy5zdmcucmVtb3ZlQ2hpbGQodGhpcy5kb21FbGVtZW50cy5zdmcuY2hpbGROb2Rlc1swXSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gdGhpcy5jb2RlLmhpZGUoKTtcbiAgICAgICAgLy8gdGhpcy5pbmZvLnVubG9hZCgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVtb3ZlT2JqZWN0KG9iaikge1xuICAgICAgICBVdGlscy5mb3JlYWNoKHRoaXMuc3RhdGUuYXJlYXMsICh4LCBpKSA9PiB7XG4gICAgICAgICAgICBpZiAoeCA9PT0gb2JqKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5hcmVhcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBvYmoucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMuc3RhdGUuYXJlYXMuZm9yRWFjaChmdW5jdGlvbiAoeCwgaSkge1xuICAgICAgICAgICAgc3dpdGNoICh4LnR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdyZWN0YW5nbGUnOlxuICAgICAgICAgICAgICAgICAgICB4Ll9oZWxwZXJzLm51bWJlci5zZXROdW1iZXIoaSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3BvbHlnb24nOlxuICAgICAgICAgICAgICAgICAgICB4Ll9oZWxwZXJzWzBdLnNldE51bWJlcihpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnY2lyY2xlJzpcbiAgICAgICAgICAgICAgICAgICAgeC5faGVscGVycy5udW1iZXIuc2V0TnVtYmVyKGkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcHVibGljIGRlc2VsZWN0QWxsKCkge1xuICAgICAgICBVdGlscy5mb3JlYWNoKHRoaXMuc3RhdGUuYXJlYXMsIGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICB4LmRlc2VsZWN0KCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0SXNEcmF3KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZS5pc0RyYXc7XG4gICAgfVxuXG4gICAgcHVibGljIHNldElzRHJhdyhhcmcpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5pc0RyYXcgPSBhcmc7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRNb2RlKGFyZykge1xuICAgICAgICB0aGlzLm9uU2V0TW9kZShhcmcpO1xuICAgICAgICB0aGlzLnN0YXRlLmFwcE1vZGUgPSBhcmc7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRNb2RlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZS5hcHBNb2RlO1xuICAgIH1cblxuICAgIHB1YmxpYyBvblNldE1vZGUobW9kZSkge1xuXG4gICAgfVxuXG4gICAgcHVibGljIG9uQ3VycmVudFR5cGUodHlwZSkge1xuXG4gICAgfVxuXG4gICAgcHVibGljIHNldFNoYXBlKGFyZykge1xuICAgICAgICB0aGlzLnN0YXRlLmN1cnJlbnRUeXBlID0gYXJnO1xuICAgICAgICB0aGlzLm9uQ3VycmVudFR5cGUoYXJnKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFNoYXBlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZS5jdXJyZW50VHlwZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkT2JqZWN0KG9iamVjdCkge1xuICAgICAgICB0aGlzLnN0YXRlLmFyZWFzLnB1c2gob2JqZWN0KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcHVibGljIGdldE5ld0FyZWEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlLm5ld0FyZWE7XG4gICAgfVxuXG4gICAgcHVibGljIHJlc2V0TmV3QXJlYSgpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5uZXdBcmVhID0gbnVsbDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFNlbGVjdGVkQXJlYSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUuc2VsZWN0ZWRBcmVhO1xuICAgIH1cblxuICAgIHNldFNlbGVjdGVkQXJlYShvYmopIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5zZWxlY3RlZEFyZWEgPSBvYmo7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRFZGl0VHlwZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUuZWRpdFR5cGU7XG4gICAgfVxuXG4gICAgcHVibGljIHNldEZpbGVuYW1lKHN0cikge1xuICAgICAgICB0aGlzLnN0YXRlLmltYWdlLmZpbGVuYW1lID0gc3RyO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0RWRpdENsYXNzKCkge1xuICAgICAgICB0aGlzLmRvbUVsZW1lbnRzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdkcmF3Jyk7XG4gICAgICAgIHRoaXMuZG9tRWxlbWVudHMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2VkaXQnKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0RHJhd0NsYXNzKCkge1xuICAgICAgICB0aGlzLmRvbUVsZW1lbnRzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdlZGl0Jyk7XG4gICAgICAgIHRoaXMuZG9tRWxlbWVudHMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2RyYXcnKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0RGVmYXVsdENsYXNzKCkge1xuICAgICAgICB0aGlzLmRvbUVsZW1lbnRzLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdlZGl0Jyk7XG4gICAgICAgIHRoaXMuZG9tRWxlbWVudHMuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYXcnKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkRXZlbnQodGFyZ2V0LCBldmVudFR5cGUsIGZ1bmMpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5ldmVudHMucHVzaChuZXcgQXBwRXZlbnQodGFyZ2V0LCBldmVudFR5cGUsIGZ1bmMpKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcHVibGljIHJlbW92ZUFsbEV2ZW50cygpIHtcbiAgICAgICAgVXRpbHMuZm9yZWFjaCh0aGlzLnN0YXRlLmV2ZW50cywgZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgIHgucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnN0YXRlLmV2ZW50cy5sZW5ndGggPSAwO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvLyBwdWJsaWMgbG9hZEpTT04oc3RyLCB3aWR0aCkge1xuICAgIC8vICAgICB2YXIgb2JqID0gSlNPTi5wYXJzZShzdHIpO1xuICAgIC8vICAgICB0aGlzLmxvYWRJbWFnZShvYmouaW1nLCB3aWR0aCk7XG4gICAgLy8gICAgIHJldHVyblxuICAgIC8vIH1cblxuICAgIHB1YmxpYyBnZXRBcmVhcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUuYXJlYXM7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEFyZWFzSlNPTihzY2FsZSkge1xuICAgICAgICBpZiAoc2NhbGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgc2NhbGUgPSAxO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvYmogPSB7XG4gICAgICAgICAgICBhcmVhczogW10sXG4gICAgICAgICAgICBpbWc6IHRoaXMuc3RhdGUuaW1hZ2Uuc3JjXG4gICAgICAgIH07XG4gICAgICAgIFV0aWxzLmZvcmVhY2godGhpcy5zdGF0ZS5hcmVhcywgZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgIHZhciBkYXRhID0geC50b0pTT04oKTtcbiAgICAgICAgICAgIGlmIChkYXRhLnR5cGUgIT0gJ3BvbHlnb24nKSB7XG4gICAgICAgICAgICAgICAgZGF0YS5jb29yZHMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaSwgYXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEuY29vcmRzW2ldID0gKE1hdGgucm91bmQoaXRlbSAqIHNjYWxlKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvYmouYXJlYXMucHVzaChkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmopO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRIVE1MQ29kZShhcmcpIHtcbiAgICAgICAgdmFyIGh0bWxfY29kZSA9ICcnO1xuICAgICAgICBpZiAoYXJnKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuYXJlYXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcwIG9iamVjdHMnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaHRtbF9jb2RlICs9IFV0aWxzLmVuY29kZSgnPGltZyBzcmM9XCInICsgdGhpcy5zdGF0ZS5pbWFnZS5maWxlbmFtZSArICdcIiBhbHQ9XCJcIiB1c2VtYXA9XCIjbWFwXCIgLz4nKSArXG4gICAgICAgICAgICAgICAgJzxiciAvPicgKyBVdGlscy5lbmNvZGUoJzxtYXAgbmFtZT1cIm1hcFwiPicpICsgJzxiciAvPic7XG4gICAgICAgICAgICBVdGlscy5mb3JlYWNoUmV2ZXJzZSh0aGlzLnN0YXRlLmFyZWFzLCBmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgICAgIGh0bWxfY29kZSArPSAnJm5ic3A7Jm5ic3A7Jm5ic3A7Jm5ic3A7JyArIFV0aWxzLmVuY29kZSh4LnRvU3RyaW5nKCkpICsgJzxiciAvPic7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGh0bWxfY29kZSArPSBVdGlscy5lbmNvZGUoJzwvbWFwPicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgVXRpbHMuZm9yZWFjaFJldmVyc2UodGhpcy5zdGF0ZS5hcmVhcywgZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgICAgICBodG1sX2NvZGUgKz0geC50b1N0cmluZygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGh0bWxfY29kZTtcbiAgICB9XG59Il19