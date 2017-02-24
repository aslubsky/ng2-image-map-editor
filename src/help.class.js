import { Utils } from './utils.class';
export var Help = (function () {
    function Help() {
        this.block = Utils.id('help');
        this.overlay = Utils.id('overlay');
        this.close_button = this.block.querySelector('.close_button');
        this.overlay.addEventListener('click', this.hide, false);
        this.close_button.addEventListener('click', this.hide, false);
    }
    Help.prototype.hide = function () {
        Utils.hide(this.block);
        Utils.hide(this.overlay);
    };
    Help.prototype.show = function () {
        Utils.show(this.block);
        Utils.show(this.overlay);
    };
    return Help;
}());
//# sourceMappingURL=help.class.js.map