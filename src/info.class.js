import {Utils} from './utils.class';
import {Area} from './area.class';
export var Info = (function () {
    function Info() {
        var _this = this;
        this.form = Utils.id('edit_details');
        this.header = this.form.querySelector('h5');
        this.href_attr = Utils.id('href_attr');
        this.alt_attr = Utils.id('alt_attr');
        this.title_attr = Utils.id('title_attr');
        this.save_button = Utils.id('save_details');
        this.close_button = this.form.querySelector('.close_button');
        this.sections = this.form.querySelectorAll('p');
        this.save_button.addEventListener('click', this.save, false);
        this.href_attr.addEventListener('keydown', function (e) {
            e.stopPropagation();
        }, false);
        this.alt_attr.addEventListener('keydown', function (e) {
            e.stopPropagation();
        }, false);
        this.title_attr.addEventListener('keydown', function (e) {
            e.stopPropagation();
        }, false);
        this.href_attr.addEventListener('change', function () {
            _this.form.classList.add('changed');
            _this.href_attr.parentNode.classList.add('changed');
        }, false);
        this.alt_attr.addEventListener('change', function () {
            _this.form.classList.add('changed');
            _this.alt_attr.parentNode.classList.add('changed');
        }, false);
        this.title_attr.addEventListener('change', function () {
            _this.form.classList.add('changed');
            _this.title_attr.parentNode.classList.add('changed');
        }, false);
        this.close_button.addEventListener('click', this.unload, false);
        this.header.addEventListener('mousedown', function (e) {
            _this.temp_x = e.pageX;
            _this.temp_y = e.pageY;
            Area.app.addEvent(document, 'mousemove', _this.moveEditBlock);
            Area.app.addEvent(_this.header, 'mouseup', _this.stopMoveEditBlock);
            e.preventDefault();
        }, false);
    }

    Info.prototype.changedReset = function () {
        this.form.classList.remove('changed');
        Utils.foreach(this.sections, function (x) {
            x.classList.remove('changed');
        });
    };
    Info.prototype.save = function (e) {
        this.obj.href = this.href_attr.value;
        this.obj.alt = this.alt_attr.value;
        this.obj.title = this.title_attr.value;
        this.obj[this.obj.href ? 'with_href' : 'without_href']();
        this.changedReset();
        e.preventDefault();
    };
    Info.prototype.unload = function () {
        this.obj = null;
        this.changedReset();
        Utils.hide(this.form);
    };
    Info.prototype.setCoords = function (x, y) {
        this.form.style.left = (x + 5) + 'px';
        this.form.style.top = (y + 5) + 'px';
    };
    Info.prototype.moveEditBlock = function (e) {
        this.setCoords(this.x + e.pageX - this.temp_x, this.y + e.pageY - this.temp_y);
    };
    Info.prototype.stopMoveEditBlock = function (e) {
        this.x = this.x + e.pageX - this.temp_x;
        this.y = this.y + e.pageY - this.temp_y;
        this.setCoords(this.x, this.y);
        Area.app.removeAllEvents();
    };
    Info.prototype.load = function (object, new_x, new_y) {
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
    };
    return Info;
}());
//# sourceMappingURL=info.class.js.map