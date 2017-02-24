import {Utils} from './utils.class';
import {Area} from './area.class';

export class Info {
    public form: any = Utils.id('edit_details');
    public header: any = this.form.querySelector('h5');
    public href_attr: any = Utils.id('href_attr');
    public alt_attr: any = Utils.id('alt_attr');
    public title_attr: any = Utils.id('title_attr');
    public save_button: any = Utils.id('save_details');
    public close_button: any = this.form.querySelector('.close_button');
    public sections: any = this.form.querySelectorAll('p');
    public obj: any;
    public x: number;
    public y: number;
    public temp_x: number;
    public temp_y: number;

    constructor() {
        this.save_button.addEventListener('click', this.save, false);

        this.href_attr.addEventListener('keydown', (e) => {
            e.stopPropagation();
        }, false);
        this.alt_attr.addEventListener('keydown', (e) => {
            e.stopPropagation();
        }, false);
        this.title_attr.addEventListener('keydown', (e) => {
            e.stopPropagation();
        }, false);

        this.href_attr.addEventListener('change', () => {
            this.form.classList.add('changed');
            this.href_attr.parentNode.classList.add('changed');
        }, false);
        this.alt_attr.addEventListener('change', () => {
            this.form.classList.add('changed');
            this.alt_attr.parentNode.classList.add('changed');
        }, false);
        this.title_attr.addEventListener('change', () => {
            this.form.classList.add('changed');
            this.title_attr.parentNode.classList.add('changed');
        }, false);

        this.close_button.addEventListener('click', this.unload, false);

        this.header.addEventListener('mousedown', (e: any) => {
            this.temp_x = e.pageX;
            this.temp_y = e.pageY;

            Area.app.addEvent(document, 'mousemove', this.moveEditBlock);
            Area.app.addEvent(this.header, 'mouseup', this.stopMoveEditBlock);

            e.preventDefault();
        }, false);
    }

    public changedReset() {
        this.form.classList.remove('changed');
        Utils.foreach(this.sections, (x: any) => {
            x.classList.remove('changed');
        });
    }

    public save(e: any) {
        this.obj.href = this.href_attr.value;
        this.obj.alt = this.alt_attr.value;
        this.obj.title = this.title_attr.value;

        this.obj[this.obj.href ? 'with_href' : 'without_href']();

        this.changedReset();

        e.preventDefault();
    }

    public unload() {
        this.obj = null;
        this.changedReset();
        Utils.hide(this.form);
    }

    public setCoords(x, y) {
        this.form.style.left = (x + 5) + 'px';
        this.form.style.top = (y + 5) + 'px';
    }

    public moveEditBlock(e: any) {
        this.setCoords(this.x + e.pageX - this.temp_x, this.y + e.pageY - this.temp_y);
    }

    public stopMoveEditBlock(e: any) {
        this.x = this.x + e.pageX - this.temp_x;
        this.y = this.y + e.pageY - this.temp_y;
        this.setCoords(this.x, this.y);

        Area.app.removeAllEvents();
    }

    public load(object, new_x, new_y) {
        this.obj = object;
        this.href_attr.value = object.href ? object.href : '';
        this.alt_attr.value = object.alt ? object.alt : '';
        this.title_attr.value = object.title ? object.title : '';
        Utils.show(this.form);
        if (new_x && new_y) {
            this.x = new_x;
            this.y = new_y;
            this.setCoords(this.x, this.y);
        }
    }
}