import { Area } from './area.class';
import { Helper } from './helper.class';
import { Utils } from './utils.class';
/**
 * The constructor for circles
 *
 * Initial state:
 *      ----
 *  /         \
 * |  (x, y)  |
 * \         /
 *    ----
 * with radius = 0
 *
 * @constructor
 * @param coords {Object} - coordinates of the begin pointer, e.g. {x: 100, y: 200}
 */
export class Circle extends Area {
    constructor(coords, type) {
        super(coords, 'circle');
        /**
         * @namespace
         * @property {number} cx - Distance from the left edge of the image to the center of the circle
         * @property {number} cy - Distance from the top edge of the image to the center of the circle
         * @property {number} radius - Radius of the circle
         */
        this._params = {
            cx: coords.x,
            cy: coords.y,
            radius: 0
        };
        this._el = document.createElementNS(Area.SVG_NS, 'circle');
        this._groupEl.appendChild(this._el);
        this._helpers = {
            number: new Helper(this._groupEl, coords.x, coords.y, 'number'),
            center: new Helper(this._groupEl, coords.x, coords.y, 'move'),
            top: new Helper(this._groupEl, coords.x, coords.y, 'editTop'),
            bottom: new Helper(this._groupEl, coords.x, coords.y, 'editBottom'),
            left: new Helper(this._groupEl, coords.x, coords.y, 'editLeft'),
            right: new Helper(this._groupEl, coords.x, coords.y, 'editRight')
        };
        this._helpers.number.setNumber(coords.n);
        this.select().redraw();
        Area.app.addObject(this); //add this object to array of all objects
    }
    setSVGAttributes(params) {
        this._el.setAttribute('cx', params.cx);
        this._el.setAttribute('cy', params.cy);
        this._el.setAttribute('r', params.radius);
        this._helpers.number.setCoords(params.cx, params.cy - params.radius - 5);
        this._helpers.center.setCoords(params.cx, params.cy);
        this._helpers.top.setCoords(params.cx, params.cy - params.radius);
        this._helpers.right.setCoords(params.cx + params.radius, params.cy);
        this._helpers.bottom.setCoords(params.cx, params.cy + params.radius);
        this._helpers.left.setCoords(params.cx - params.radius, params.cy);
        return this;
    }
    setParams(params) {
        this._params.cx = params.cx;
        this._params.cy = params.cy;
        this._params.radius = params.radius;
        return this;
    }
    dynamicDraw(x1, y1) {
        var x0 = this._params.cx, y0 = this._params.cy, dx, dy, radius, temp_params;
        x1 = x1 || x0;
        y1 = y1 || y0;
        dx = Math.abs(x0 - x1);
        dy = Math.abs(y0 - y1);
        radius = Math.round(Math.sqrt(dx * dx + dy * dy));
        temp_params = {
            /* params */
            cx: x0,
            cy: y0,
            radius: radius
        };
        this.setSVGAttributes(temp_params);
        return temp_params;
    }
    onProcessDrawing(e) {
        var coords = Utils.getRightCoords(e.pageX, e.pageY);
        this.dynamicDraw(coords.x, coords.y);
    }
    onStopDrawing(e) {
        var coords = Utils.getRightCoords(e.pageX, e.pageY);
        this.setParams(this.dynamicDraw(coords.x, coords.y)).deselect();
        Area.app.removeAllEvents()
            .setIsDraw(false)
            .resetNewArea();
    }
    edit(editingType, dx, dy) {
        var tempParams = Object.assign({}, this._params);
        switch (editingType) {
            case 'move':
                tempParams.cx += dx;
                tempParams.cy += dy;
                break;
            case 'editTop':
                tempParams.radius -= dy;
                break;
            case 'editBottom':
                tempParams.radius += dy;
                break;
            case 'editLeft':
                tempParams.radius -= dx;
                break;
            case 'editRight':
                tempParams.radius += dx;
                break;
        }
        return tempParams;
    }
    move(dx, dy) {
        var temp_params = Object.create(this._params);
        temp_params.cx += dx;
        temp_params.cy += dy;
        return temp_params;
    }
    dynamicEdit(temp_params) {
        if (temp_params.radius < 0) {
            temp_params.radius = Math.abs(temp_params.radius);
        }
        this.setSVGAttributes(temp_params);
        return temp_params;
    }
    onProcessEditing(e) {
        var editType = Area.app.getEditType();
        this.dynamicEdit(this.edit(editType, e.pageX - this.delta.x, e.pageY - this.delta.y));
    }
    onStopEditing(e) {
        var editType = Area.app.getEditType();
        this.setParams(this.dynamicEdit(this.edit(editType, e.pageX - this.delta.x, e.pageY - this.delta.y)));
        Area.app.removeAllEvents();
    }
    toString() {
        return '<area shape="circle" coords="'
            + this._params.cx + ', '
            + this._params.cy + ', '
            + this._params.radius
            + '"'
            + (this.href ? ' href="' + this.href + '"' : '')
            + (this.alt ? ' alt="' + this.alt + '"' : '')
            + (this.title ? ' title="' + this.title + '"' : '')
            + ' />';
    }
    /**
     * Returns true if coords array is valid for circles and false otherwise
     *
     * @static
     * @param coords {Array} - coords for new circle as array
     * @return {boolean}
     */
    static testCoords(coords) {
        return coords.length === 3;
    }
    static createFromSaved(params) {
        if (!this.testCoords(params.coords)) {
            return;
        }
        Area.app.setIsDraw(true);
        var area = new Circle({
            x: params.coords[0],
            y: params.coords[1],
            n: params.number
        });
        area.setParams(area.dynamicDraw(params.coords[0], params.coords[1] + params.coords[2])).deselect();
        Area.app.setIsDraw(false)
            .resetNewArea();
        area.setInfoAttributes(params);
    }
    toJSON() {
        return {
            type: 'circle',
            coords: [
                this._params.cx,
                this._params.cy,
                this._params.radius
            ],
            href: this.attributes.href,
            alt: this.attributes.alt,
            title: this.attributes.title
        };
    }
    redraw(params) {
        this.setSVGAttributes(params ? params : this._params);
        return this;
    }
    /**
     * Creates new circle and add drawing handlers for DOM-elements
     *
     * @param coords {Object} coords
     * @returns created circle
     */
    static createAndStartDrawing(coords) {
        coords.n = Area.app.getAreas().length;
        var newArea = new Circle(coords);
        Area.app.addEvent(Area.app.domElements.container, 'mousemove', newArea.onProcessDrawing.bind(newArea))
            .addEvent(Area.app.domElements.container, 'click', newArea.onStopDrawing.bind(newArea));
        return newArea;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2lyY2xlLmNsYXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NpcmNsZS5jbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ2xDLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN0QyxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXBDOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFDSCxNQUFNLE9BQU8sTUFBTyxTQUFRLElBQUk7SUFFNUIsWUFBWSxNQUFXLEVBQUUsSUFBVTtRQUMvQixLQUFLLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRXhCOzs7OztXQUtHO1FBQ0gsSUFBSSxDQUFDLE9BQU8sR0FBRztZQUNYLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNaLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNaLE1BQU0sRUFBRSxDQUFDO1NBQ1osQ0FBQTtRQUVELElBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVwQyxJQUFJLENBQUMsUUFBUSxHQUFHO1lBQ1osTUFBTSxFQUFFLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQztZQUMvRCxNQUFNLEVBQUUsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDO1lBQzdELEdBQUcsRUFBRSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUM7WUFDN0QsTUFBTSxFQUFFLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQztZQUNuRSxJQUFJLEVBQUUsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDO1lBQy9ELEtBQUssRUFBRSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUM7U0FDcEUsQ0FBQTtRQUNELElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRXZCLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMseUNBQXlDO0lBQ3ZFLENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxNQUFNO1FBQzFCLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0s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O2FBQ2pHLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFFNUYsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBcmVhfSBmcm9tICcuL2FyZWEuY2xhc3MnO1xuaW1wb3J0IHtIZWxwZXJ9IGZyb20gJy4vaGVscGVyLmNsYXNzJztcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4vdXRpbHMuY2xhc3MnO1xuXG4vKipcbiAqIFRoZSBjb25zdHJ1Y3RvciBmb3IgY2lyY2xlc1xuICpcbiAqIEluaXRpYWwgc3RhdGU6XG4gKiAgICAgIC0tLS1cbiAqICAvICAgICAgICAgXFxcbiAqIHwgICh4LCB5KSAgfFxuICogXFwgICAgICAgICAvXG4gKiAgICAtLS0tXG4gKiB3aXRoIHJhZGl1cyA9IDBcbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSBjb29yZHMge09iamVjdH0gLSBjb29yZGluYXRlcyBvZiB0aGUgYmVnaW4gcG9pbnRlciwgZS5nLiB7eDogMTAwLCB5OiAyMDB9XG4gKi9cbmV4cG9ydCBjbGFzcyBDaXJjbGUgZXh0ZW5kcyBBcmVhIHtcblxuICAgIGNvbnN0cnVjdG9yKGNvb3JkczogYW55LCB0eXBlPzogYW55KSB7XG4gICAgICAgIHN1cGVyKGNvb3JkcywgJ2NpcmNsZScpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZXNwYWNlXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjeCAtIERpc3RhbmNlIGZyb20gdGhlIGxlZnQgZWRnZSBvZiB0aGUgaW1hZ2UgdG8gdGhlIGNlbnRlciBvZiB0aGUgY2lyY2xlXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjeSAtIERpc3RhbmNlIGZyb20gdGhlIHRvcCBlZGdlIG9mIHRoZSBpbWFnZSB0byB0aGUgY2VudGVyIG9mIHRoZSBjaXJjbGVcbiAgICAgICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHJhZGl1cyAtIFJhZGl1cyBvZiB0aGUgY2lyY2xlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9wYXJhbXMgPSB7XG4gICAgICAgICAgICBjeDogY29vcmRzLngsXG4gICAgICAgICAgICBjeTogY29vcmRzLnksXG4gICAgICAgICAgICByYWRpdXM6IDBcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKEFyZWEuU1ZHX05TLCAnY2lyY2xlJyk7XG4gICAgICAgIHRoaXMuX2dyb3VwRWwuYXBwZW5kQ2hpbGQodGhpcy5fZWwpO1xuXG4gICAgICAgIHRoaXMuX2hlbHBlcnMgPSB7IC8vYXJyYXkgb2YgYWxsIGhlbHBlcnMtcmVjdGFuZ2xlc1xuICAgICAgICAgICAgbnVtYmVyOiBuZXcgSGVscGVyKHRoaXMuX2dyb3VwRWwsIGNvb3Jkcy54LCBjb29yZHMueSwgJ251bWJlcicpLFxuICAgICAgICAgICAgY2VudGVyOiBuZXcgSGVscGVyKHRoaXMuX2dyb3VwRWwsIGNvb3Jkcy54LCBjb29yZHMueSwgJ21vdmUnKSxcbiAgICAgICAgICAgIHRvcDogbmV3IEhlbHBlcih0aGlzLl9ncm91cEVsLCBjb29yZHMueCwgY29vcmRzLnksICdlZGl0VG9wJyksXG4gICAgICAgICAgICBib3R0b206IG5ldyBIZWxwZXIodGhpcy5fZ3JvdXBFbCwgY29vcmRzLngsIGNvb3Jkcy55LCAnZWRpdEJvdHRvbScpLFxuICAgICAgICAgICAgbGVmdDogbmV3IEhlbHBlcih0aGlzLl9ncm91cEVsLCBjb29yZHMueCwgY29vcmRzLnksICdlZGl0TGVmdCcpLFxuICAgICAgICAgICAgcmlnaHQ6IG5ldyBIZWxwZXIodGhpcy5fZ3JvdXBFbCwgY29vcmRzLngsIGNvb3Jkcy55LCAnZWRpdFJpZ2h0JylcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9oZWxwZXJzLm51bWJlci5zZXROdW1iZXIoY29vcmRzLm4pO1xuICAgICAgICB0aGlzLnNlbGVjdCgpLnJlZHJhdygpO1xuXG4gICAgICAgIEFyZWEuYXBwLmFkZE9iamVjdCh0aGlzKTsgLy9hZGQgdGhpcyBvYmplY3QgdG8gYXJyYXkgb2YgYWxsIG9iamVjdHNcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0U1ZHQXR0cmlidXRlcyhwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5fZWwuc2V0QXR0cmlidXRlKCdjeCcsIHBhcmFtcy5jeCk7XG4gICAgICAgIHRoaXMuX2VsLnNldEF0dHJpYnV0ZSgnY3knLCBwYXJhbXMuY3kpO1xuICAgICAgICB0aGlzLl9lbC5zZXRBdHRyaWJ1dGUoJ3InLCBwYXJhbXMucmFkaXVzKTtcblxuICAgICAgICB0aGlzLl9oZWxwZXJzLm51bWJlci5zZXRDb29yZHMocGFyYW1zLmN4LCBwYXJhbXMuY3kgLSBwYXJhbXMucmFkaXVzIC0gNSk7XG4gICAgICAgIHRoaXMuX2hlbHBlcnMuY2VudGVyLnNldENvb3JkcyhwYXJhbXMuY3gsIHBhcmFtcy5jeSk7XG4gICAgICAgIHRoaXMuX2hlbHBlcnMudG9wLnNldENvb3JkcyhwYXJhbXMuY3gsIHBhcmFtcy5jeSAtIHBhcmFtcy5yYWRpdXMpO1xuICAgICAgICB0aGlzLl9oZWxwZXJzLnJpZ2h0LnNldENvb3JkcyhwYXJhbXMuY3ggKyBwYXJhbXMucmFkaXVzLCBwYXJhbXMuY3kpO1xuICAgICAgICB0aGlzLl9oZWxwZXJzLmJvdHRvbS5zZXRDb29yZHMocGFyYW1zLmN4LCBwYXJhbXMuY3kgKyBwYXJhbXMucmFkaXVzKTtcbiAgICAgICAgdGhpcy5faGVscGVycy5sZWZ0LnNldENvb3JkcyhwYXJhbXMuY3ggLSBwYXJhbXMucmFkaXVzLCBwYXJhbXMuY3kpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRQYXJhbXMocGFyYW1zKSB7XG4gICAgICAgIHRoaXMuX3BhcmFtcy5jeCA9IHBhcmFtcy5jeDtcbiAgICAgICAgdGhpcy5fcGFyYW1zLmN5ID0gcGFyYW1zLmN5O1xuICAgICAgICB0aGlzLl9wYXJhbXMucmFkaXVzID0gcGFyYW1zLnJhZGl1cztcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZHluYW1pY0RyYXcoeDEsIHkxKSB7XG4gICAgICAgIHZhciB4MCA9IHRoaXMuX3BhcmFtcy5jeCxcbiAgICAgICAgICAgIHkwID0gdGhpcy5fcGFyYW1zLmN5LFxuICAgICAgICAgICAgZHgsXG4gICAgICAgICAgICBkeSxcbiAgICAgICAgICAgIHJhZGl1cyxcbiAgICAgICAgICAgIHRlbXBfcGFyYW1zO1xuXG4gICAgICAgIHgxID0geDEgfHwgeDA7XG4gICAgICAgIHkxID0geTEgfHwgeTA7XG5cbiAgICAgICAgZHggPSBNYXRoLmFicyh4MCAtIHgxKTtcbiAgICAgICAgZHkgPSBNYXRoLmFicyh5MCAtIHkxKTtcbiAgICAgICAgcmFkaXVzID0gTWF0aC5yb3VuZChNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpKTtcblxuICAgICAgICB0ZW1wX3BhcmFtcyA9IHtcbiAgICAgICAgICAgIC8qIHBhcmFtcyAqL1xuICAgICAgICAgICAgY3g6IHgwLFxuICAgICAgICAgICAgY3k6IHkwLFxuICAgICAgICAgICAgcmFkaXVzOiByYWRpdXNcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0U1ZHQXR0cmlidXRlcyh0ZW1wX3BhcmFtcyk7XG5cbiAgICAgICAgcmV0dXJuIHRlbXBfcGFyYW1zO1xuICAgIH1cblxuICAgIHB1YmxpYyBvblByb2Nlc3NEcmF3aW5nKGUpIHtcbiAgICAgICAgdmFyIGNvb3JkcyA9IFV0aWxzLmdldFJpZ2h0Q29vcmRzKGUucGFnZVgsIGUucGFnZVkpO1xuXG4gICAgICAgIHRoaXMuZHluYW1pY0RyYXcoY29vcmRzLngsIGNvb3Jkcy55KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25TdG9wRHJhd2luZyhlKSB7XG4gICAgICAgIHZhciBjb29yZHMgPSBVdGlscy5nZXRSaWdodENvb3JkcyhlLnBhZ2VYLCBlLnBhZ2VZKTtcblxuICAgICAgICB0aGlzLnNldFBhcmFtcyh0aGlzLmR5bmFtaWNEcmF3KGNvb3Jkcy54LCBjb29yZHMueSkpLmRlc2VsZWN0KCk7XG5cbiAgICAgICAgQXJlYS5hcHAucmVtb3ZlQWxsRXZlbnRzKClcbiAgICAgICAgICAgIC5zZXRJc0RyYXcoZmFsc2UpXG4gICAgICAgICAgICAucmVzZXROZXdBcmVhKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGVkaXQoZWRpdGluZ1R5cGUsIGR4LCBkeSkge1xuICAgICAgICB2YXIgdGVtcFBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX3BhcmFtcyk7XG4gICAgICAgIHN3aXRjaCAoZWRpdGluZ1R5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ21vdmUnOlxuICAgICAgICAgICAgICAgIHRlbXBQYXJhbXMuY3ggKz0gZHg7XG4gICAgICAgICAgICAgICAgdGVtcFBhcmFtcy5jeSArPSBkeTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnZWRpdFRvcCc6XG4gICAgICAgICAgICAgICAgdGVtcFBhcmFtcy5yYWRpdXMgLT0gZHk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2VkaXRCb3R0b20nOlxuICAgICAgICAgICAgICAgIHRlbXBQYXJhbXMucmFkaXVzICs9IGR5O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdlZGl0TGVmdCc6XG4gICAgICAgICAgICAgICAgdGVtcFBhcmFtcy5yYWRpdXMgLT0gZHg7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2VkaXRSaWdodCc6XG4gICAgICAgICAgICAgICAgdGVtcFBhcmFtcy5yYWRpdXMgKz0gZHg7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRlbXBQYXJhbXM7XG4gICAgfVxuXG4gICAgcHVibGljIG1vdmUoZHgsIGR5KSB7IC8vb2Zmc2V0IHggYW5kIHlcbiAgICAgICAgdmFyIHRlbXBfcGFyYW1zID0gT2JqZWN0LmNyZWF0ZSh0aGlzLl9wYXJhbXMpO1xuXG4gICAgICAgIHRlbXBfcGFyYW1zLmN4ICs9IGR4O1xuICAgICAgICB0ZW1wX3BhcmFtcy5jeSArPSBkeTtcblxuICAgICAgICByZXR1cm4gdGVtcF9wYXJhbXM7XG4gICAgfVxuXG4gICAgcHVibGljIGR5bmFtaWNFZGl0KHRlbXBfcGFyYW1zKSB7XG4gICAgICAgIGlmICh0ZW1wX3BhcmFtcy5yYWRpdXMgPCAwKSB7XG4gICAgICAgICAgICB0ZW1wX3BhcmFtcy5yYWRpdXMgPSBNYXRoLmFicyh0ZW1wX3BhcmFtcy5yYWRpdXMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0U1ZHQXR0cmlidXRlcyh0ZW1wX3BhcmFtcyk7XG5cbiAgICAgICAgcmV0dXJuIHRlbXBfcGFyYW1zO1xuICAgIH1cblxuICAgIHB1YmxpYyBvblByb2Nlc3NFZGl0aW5nKGUpIHtcbiAgICAgICAgdmFyIGVkaXRUeXBlID0gQXJlYS5hcHAuZ2V0RWRpdFR5cGUoKTtcbiAgICAgICAgdGhpcy5keW5hbWljRWRpdChcbiAgICAgICAgICAgIHRoaXMuZWRpdChlZGl0VHlwZSwgZS5wYWdlWCAtIHRoaXMuZGVsdGEueCwgZS5wYWdlWSAtIHRoaXMuZGVsdGEueSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25TdG9wRWRpdGluZyhlKSB7XG4gICAgICAgIHZhciBlZGl0VHlwZSA9IEFyZWEuYXBwLmdldEVkaXRUeXBlKCk7XG5cbiAgICAgICAgdGhpcy5zZXRQYXJhbXMoXG4gICAgICAgICAgICB0aGlzLmR5bmFtaWNFZGl0KFxuICAgICAgICAgICAgICAgIHRoaXMuZWRpdChlZGl0VHlwZSwgZS5wYWdlWCAtIHRoaXMuZGVsdGEueCwgZS5wYWdlWSAtIHRoaXMuZGVsdGEueSlcbiAgICAgICAgICAgIClcbiAgICAgICAgKTtcblxuICAgICAgICBBcmVhLmFwcC5yZW1vdmVBbGxFdmVudHMoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKSB7IC8vdG8gaHRtbCBtYXAgYXJlYSBjb2RlXG4gICAgICAgIHJldHVybiAnPGFyZWEgc2hhcGU9XCJjaXJjbGVcIiBjb29yZHM9XCInXG4gICAgICAgICAgICArIHRoaXMuX3BhcmFtcy5jeCArICcsICdcbiAgICAgICAgICAgICsgdGhpcy5fcGFyYW1zLmN5ICsgJywgJ1xuICAgICAgICAgICAgKyB0aGlzLl9wYXJhbXMucmFkaXVzXG4gICAgICAgICAgICArICdcIidcbiAgICAgICAgICAgICsgKHRoaXMuaHJlZiA/ICcgaHJlZj1cIicgKyB0aGlzLmhyZWYgKyAnXCInIDogJycpXG4gICAgICAgICAgICArICh0aGlzLmFsdCA/ICcgYWx0PVwiJyArIHRoaXMuYWx0ICsgJ1wiJyA6ICcnKVxuICAgICAgICAgICAgKyAodGhpcy50aXRsZSA/ICcgdGl0bGU9XCInICsgdGhpcy50aXRsZSArICdcIicgOiAnJylcbiAgICAgICAgICAgICsgJyAvPic7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIGNvb3JkcyBhcnJheSBpcyB2YWxpZCBmb3IgY2lyY2xlcyBhbmQgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHBhcmFtIGNvb3JkcyB7QXJyYXl9IC0gY29vcmRzIGZvciBuZXcgY2lyY2xlIGFzIGFycmF5XG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHRlc3RDb29yZHMoY29vcmRzKSB7XG4gICAgICAgIHJldHVybiBjb29yZHMubGVuZ3RoID09PSAzO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlRnJvbVNhdmVkKHBhcmFtcykge1xuICAgICAgICBpZiAoIXRoaXMudGVzdENvb3JkcyhwYXJhbXMuY29vcmRzKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgQXJlYS5hcHAuc2V0SXNEcmF3KHRydWUpO1xuICAgICAgICB2YXIgYXJlYSA9IG5ldyBDaXJjbGUoe1xuICAgICAgICAgICAgeDogcGFyYW1zLmNvb3Jkc1swXSxcbiAgICAgICAgICAgIHk6IHBhcmFtcy5jb29yZHNbMV0sXG4gICAgICAgICAgICBuOiBwYXJhbXMubnVtYmVyXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFyZWEuc2V0UGFyYW1zKGFyZWEuZHluYW1pY0RyYXcoXG4gICAgICAgICAgICBwYXJhbXMuY29vcmRzWzBdLFxuICAgICAgICAgICAgcGFyYW1zLmNvb3Jkc1sxXSArIHBhcmFtcy5jb29yZHNbMl1cbiAgICAgICAgKSkuZGVzZWxlY3QoKTtcblxuICAgICAgICBBcmVhLmFwcC5zZXRJc0RyYXcoZmFsc2UpXG4gICAgICAgICAgICAucmVzZXROZXdBcmVhKCk7XG5cbiAgICAgICAgYXJlYS5zZXRJbmZvQXR0cmlidXRlcyhwYXJhbXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b0pTT04oKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdjaXJjbGUnLFxuICAgICAgICAgICAgY29vcmRzOiBbXG4gICAgICAgICAgICAgICAgdGhpcy5fcGFyYW1zLmN4LFxuICAgICAgICAgICAgICAgIHRoaXMuX3BhcmFtcy5jeSxcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXJhbXMucmFkaXVzXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgaHJlZjogdGhpcy5hdHRyaWJ1dGVzLmhyZWYsXG4gICAgICAgICAgICBhbHQ6IHRoaXMuYXR0cmlidXRlcy5hbHQsXG4gICAgICAgICAgICB0aXRsZTogdGhpcy5hdHRyaWJ1dGVzLnRpdGxlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcmVkcmF3KHBhcmFtcz86IGFueSkge1xuICAgICAgICB0aGlzLnNldFNWR0F0dHJpYnV0ZXMocGFyYW1zID8gcGFyYW1zIDogdGhpcy5fcGFyYW1zKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBuZXcgY2lyY2xlIGFuZCBhZGQgZHJhd2luZyBoYW5kbGVycyBmb3IgRE9NLWVsZW1lbnRzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY29vcmRzIHtPYmplY3R9IGNvb3Jkc1xuICAgICAqIEByZXR1cm5zIGNyZWF0ZWQgY2lyY2xlXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVBbmRTdGFydERyYXdpbmcoY29vcmRzKSB7XG4gICAgICAgIGNvb3Jkcy5uID0gQXJlYS5hcHAuZ2V0QXJlYXMoKS5sZW5ndGg7XG4gICAgICAgIHZhciBuZXdBcmVhID0gbmV3IENpcmNsZShjb29yZHMpO1xuXG4gICAgICAgIEFyZWEuYXBwLmFkZEV2ZW50KEFyZWEuYXBwLmRvbUVsZW1lbnRzLmNvbnRhaW5lciwgJ21vdXNlbW92ZScsIG5ld0FyZWEub25Qcm9jZXNzRHJhd2luZy5iaW5kKG5ld0FyZWEpKVxuICAgICAgICAgICAgLmFkZEV2ZW50KEFyZWEuYXBwLmRvbUVsZW1lbnRzLmNvbnRhaW5lciwgJ2NsaWNrJywgbmV3QXJlYS5vblN0b3BEcmF3aW5nLmJpbmQobmV3QXJlYSkpO1xuXG4gICAgICAgIHJldHVybiBuZXdBcmVhO1xuICAgIH1cbn0iXX0=