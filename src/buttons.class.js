import { Utils } from './utils.class';
import { Area } from './area.class';
export var Buttons = (function () {
    function Buttons(app) {
        this.app = app;
        this.all = Utils.id('nav').getElementsByTagName('li');
        this.rectangle = Utils.id('rectangle');
        this.circle = Utils.id('circle');
        this.polygon = Utils.id('polygon');
        this.edit = Utils.id('edit');
        this.clear = Utils.id('clear');
        this.to_html = Utils.id('to_html');
        this.show_help = Utils.id('show_help');
        this.rectangle.addEventListener('click', this.onShapeButtonClick, false);
        this.circle.addEventListener('click', this.onShapeButtonClick, false);
        this.polygon.addEventListener('click', this.onShapeButtonClick, false);
        this.clear.addEventListener('click', this.onClearButtonClick, false);
        this.to_html.addEventListener('click', this.onToHtmlButtonClick, false);
        this.edit.addEventListener('click', this.onEditButtonClick, false);
        this.show_help.addEventListener('click', this.onShowHelpButtonClick, false);
    }
    Buttons.prototype.deselectAll = function () {
        Utils.foreach(this.all, function (x) {
            x.classList.remove(Area.CLASS_NAMES.SELECTED);
        });
    };
    Buttons.prototype.selectOne = function (button) {
        this.deselectAll();
        button.classList.add(Area.CLASS_NAMES.SELECTED);
    };
    Buttons.prototype.onShapeButtonClick = function (e) {
        this.onSetInvalid();
        this.app.setMode('drawing')
            .setDrawClass()
            .setShape(e.target.id)
            .deselectAll()
            .hidePreview();
        this.selectOne(this);
        e.preventDefault();
    };
    Buttons.prototype.onClearButtonClick = function (e) {
        this.onSetInvalid();
        if (confirm('Clear all?')) {
            this.app.setMode(null)
                .setDefaultClass()
                .setShape(null)
                .clear()
                .hidePreview();
            this.deselectAll();
        }
        e.preventDefault();
    };
    Buttons.prototype.onToHtmlButtonClick = function (e) {
        var answers = this.app.getAreas();
        var scale = 1;
        if (this.app.img.width > this.app.domElements.img.clientWidth) {
            scale = Number((this.app.img.width / this.app.domElements.img.clientWidth).toFixed(3)) + 0.03;
        }
        else {
            scale = 1.03;
        }
        var resultsAnswers = [];
        answers.forEach(function (item, i, arr) {
            var imgMapData = item.toJSON();
            imgMapData.coords.forEach(function (item, i, arr) {
                imgMapData.coords[i] = Math.round(item * scale);
            });
            resultsAnswers.push({
                body: item.attributes.title,
                is_right: (item.attributes.alt == '1') ? true : false,
                img_map: JSON.stringify(imgMapData)
            });
        });
        this.onData(resultsAnswers, this.app.getAreasJSON(scale));
        e.preventDefault();
    };
    Buttons.prototype.onEditButtonClick = function (e) {
        this.onSetInvalid();
        if (this.app.getMode() === 'editing') {
            this.app.setMode(null)
                .setDefaultClass()
                .deselectAll();
            this.deselectAll();
            Utils.show(this.app.domElements.svg);
        }
        else {
            this.app.setShape(null)
                .setMode('editing')
                .setEditClass();
            this.selectOne(this);
        }
        this.app.hidePreview();
        e.preventDefault();
    };
    Buttons.prototype.onData = function (answers, areas) {
    };
    Buttons.prototype.onSetInvalid = function () {
    };
    Buttons.prototype.onShowHelpButtonClick = function (e) {
        e.preventDefault();
    };
    return Buttons;
}());
//# sourceMappingURL=buttons.class.js.map