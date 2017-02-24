import {Utils} from './utils.class';
import {Area} from './area.class';

export class Code {
    public block = Utils.id('code');
    public content = Utils.id('code_content');
    public close_button = this.block.querySelector('.close_button');

    constructor() {
        this.close_button.addEventListener('click', (e) => {
            Utils.hide(this.block);
            e.preventDefault();
        }, false);
    }

    public print() {
        this.content.innerHTML = Area.app.getHTMLCode(true);
        //utils.show(block);
    }

    public hide() {
        Utils.hide(this.block);
    }
}