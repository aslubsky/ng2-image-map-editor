"use strict";
var utils_class_1 = require('./utils.class');
var area_class_1 = require('./area.class');
var Buttons = (function () {
    function Buttons(app) {
        this.app = app;
        this.all = utils_class_1.Utils.id('nav').getElementsByTagName('li');
        this.rectangle = utils_class_1.Utils.id('rectangle');
        this.circle = utils_class_1.Utils.id('circle');
        this.polygon = utils_class_1.Utils.id('polygon');
        this.edit = utils_class_1.Utils.id('edit');
        this.clear = utils_class_1.Utils.id('clear');
        this.to_html = utils_class_1.Utils.id('to_html');
        this.show_help = utils_class_1.Utils.id('show_help');
        this.rectangle.addEventListener('click', this.onShapeButtonClick.bind(this), false);
        this.circle.addEventListener('click', this.onShapeButtonClick.bind(this), false);
        this.polygon.addEventListener('click', this.onShapeButtonClick.bind(this), false);
        this.clear.addEventListener('click', this.onClearButtonClick.bind(this), false);
        this.to_html.addEventListener('click', this.onToHtmlButtonClick.bind(this), false);
        this.edit.addEventListener('click', this.onEditButtonClick.bind(this), false);
        this.show_help.addEventListener('click', this.onShowHelpButtonClick.bind(this), false);
    }
    Buttons.prototype.deselectAll = function () {
        utils_class_1.Utils.foreach(this.all, function (x) {
            x.classList.remove(area_class_1.Area.CLASS_NAMES.SELECTED);
        });
    };
    Buttons.prototype.selectOne = function (button) {
        this.deselectAll();
        button.classList.add(area_class_1.Area.CLASS_NAMES.SELECTED);
    };
    Buttons.prototype.onShapeButtonClick = function (e) {
        e.preventDefault();
        var target = e.target.id ? e.target : e.target.parentNode;
        this.onSetInvalid();
        this.app.setMode('drawing')
            .setDrawClass()
            .setShape(target.id)
            .deselectAll()
            .hidePreview();
        this.selectOne(target);
    };
    Buttons.prototype.onClearButtonClick = function (e) {
        e.preventDefault();
        if (confirm('Clear all?')) {
            this.onSetInvalid();
            this.app.setMode(null)
                .setDefaultClass()
                .setShape(null)
                .clear()
                .hidePreview();
            this.deselectAll();
        }
    };
    Buttons.prototype.onToHtmlButtonClick = function (e) {
        var answers = this.app.getAreas();
        var scale = 1;
        if (this.app.state.image.width > this.app.domElements.img.clientWidth) {
            scale = Number((this.app.state.image.width / this.app.domElements.img.clientWidth).toFixed(3)) + 0.03;
        }
        else {
            scale = 1.03;
        }
        console.log('****onToHtmlButtonClick: ', scale);
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
        e.preventDefault();
        this.onSetInvalid();
        if (this.app.getMode() === 'editing') {
            this.app.setMode(null)
                .setDefaultClass()
                .deselectAll();
            this.deselectAll();
            utils_class_1.Utils.show(this.app.domElements.svg);
        }
        else {
            this.app.setShape(null)
                .setMode('editing')
                .setEditClass();
            this.selectOne(this.edit);
        }
        this.app.hidePreview();
    };
    Buttons.prototype.onData = function (answers, areas) {
    };
    Buttons.prototype.onSetInvalid = function () {
    };
    Buttons.prototype.onShowHelpButtonClick = function (e) {
        this.app.help.show();
        e.preventDefault();
    };
    return Buttons;
}());
exports.Buttons = Buttons;
//# sourceMappingURL=buttons.class.js.map