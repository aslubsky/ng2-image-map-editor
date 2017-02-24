import {Utils} from './utils.class';

export class Help {
    public block: any;
    public overlay: any;
    public close_button: any;

    constructor() {
        this.block = Utils.id('help');
        console.log('this.block', this.block);
        this.overlay = Utils.id('overlay');
        this.close_button = this.block.querySelector('.close_button');

        this.overlay.addEventListener('click', this.hide.bind(this), false);
        this.close_button.addEventListener('click', this.hide.bind(this), false);
    }

    public hide() {
        Utils.hide(this.block);
        Utils.hide(this.overlay);
    }

    public show() {
        Utils.show(this.block);
        Utils.show(this.overlay);
    }

}