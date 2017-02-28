import {Utils} from './utils.class';
import {Area} from './area.class';
import {EditorApp} from './editor-app.class';

/* Buttons and actions */
export class Buttons {
    public all = Utils.id('nav').getElementsByTagName('li');
    public rectangle = Utils.id('rectangle');
    public circle = Utils.id('circle');
    public polygon = Utils.id('polygon');
    public edit = Utils.id('edit');
    public clear = Utils.id('clear');
    public to_html = Utils.id('to_html');
    public show_help = Utils.id('show_help');


    constructor(private app: EditorApp) {
        this.rectangle.addEventListener('click', this.onShapeButtonClick.bind(this), false);
        this.circle.addEventListener('click', this.onShapeButtonClick.bind(this), false);
        this.polygon.addEventListener('click', this.onShapeButtonClick.bind(this), false);
        this.clear.addEventListener('click', this.onClearButtonClick.bind(this), false);
        this.to_html.addEventListener('click', this.onToHtmlButtonClick.bind(this), false);
        this.edit.addEventListener('click', this.onEditButtonClick.bind(this), false);
        this.show_help.addEventListener('click', this.onShowHelpButtonClick.bind(this), false);
    }

    public deselectAll() {
        Utils.foreach(this.all, function (x) {
            x.classList.remove(Area.CLASS_NAMES.SELECTED);
        });
    }

    public selectOne(button: any) {
        this.deselectAll();
        button.classList.add(Area.CLASS_NAMES.SELECTED);
    }

    public onShapeButtonClick(e) {
        e.preventDefault();
        var target = e.target.id ? e.target : e.target.parentNode;

        // console.log('onShapeButtonClick', e, this, target, target.id);

        this.onSetInvalid();

        this.app.setMode('drawing')
            .setDrawClass()
            .setShape(target.id)
            .deselectAll()
            .hidePreview();
        // this.app.info.unload();
        this.selectOne(target);
    }

    public onClearButtonClick(e) {
        e.preventDefault();
        // console.log('onClearButtonClick', e, this);

        // Clear all
        if (confirm('Clear all?')) {
            this.onSetInvalid();

            this.app.setMode(null)
                .setDefaultClass()
                .setShape(null)
                .clear()
                .hidePreview();
            this.deselectAll();
        }
    }


    public onToHtmlButtonClick(e) {
        var answers = this.app.getAreas();
        var scale = 1;
        if (this.app.img.width > this.app.domElements.img.clientWidth) {
            scale = Number((this.app.img.width / this.app.domElements.img.clientWidth).toFixed(3)) + 0.03;
        } else {
            scale = 1.03;
        }
        var resultsAnswers: any[] = [];
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

        // Generate html code only
        e.preventDefault();
    }


    public onEditButtonClick(e) {
        e.preventDefault();

        this.onSetInvalid();

        if (this.app.getMode() === 'editing') {
            this.app.setMode(null)
                .setDefaultClass()
                .deselectAll();
            this.deselectAll();
            Utils.show(this.app.domElements.svg);
        } else {
            this.app.setShape(null)
                .setMode('editing')
                .setEditClass();
            this.selectOne(this.edit);
        }
        this.app.hidePreview();
    }

    public onData(answers: any[], areas: any) {

    }

    public onSetInvalid() {

    }

    public onShowHelpButtonClick(e) {
        this.app.help.show();
        e.preventDefault();
    }
}
