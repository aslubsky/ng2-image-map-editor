import {Utils} from './utils.class';

export class Help {
    public block = Utils.id('help');
    public overlay = Utils.id('overlay');
    public close_button = this.block.querySelector('.close_button');

    constructor() {
        this.overlay.addEventListener('click', this.hide, false);
        this.close_button.addEventListener('click', this.hide, false);
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