import {Utils} from './utils.class';
import {Area} from './area.class';
export var Code = (function () {
    function Code() {
        var _this = this;
        this.block = Utils.id('code');
        this.content = Utils.id('code_content');
        this.close_button = this.block.querySelector('.close_button');
        this.close_button.addEventListener('click', function (e) {
            Utils.hide(_this.block);
            e.preventDefault();
        }, false);
    }

    Code.prototype.print = function () {
        this.content.innerHTML = Area.app.getHTMLCode(true);
    };
    Code.prototype.hide = function () {
        Utils.hide(this.block);
    };
    return Code;
}());
//# sourceMappingURL=code.class.js.map