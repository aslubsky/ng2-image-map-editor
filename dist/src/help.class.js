"use strict";
var utils_class_1 = require('./utils.class');
var Help = (function () {
    function Help() {
        this.block = utils_class_1.Utils.id('help');
        console.log('this.block', this.block);
        this.overlay = utils_class_1.Utils.id('overlay');
        this.close_button = this.block.querySelector('.close_button');
        this.overlay.addEventListener('click', this.hide.bind(this), false);
        this.close_button.addEventListener('click', this.hide.bind(this), false);
    }
    Help.prototype.hide = function () {
        utils_class_1.Utils.hide(this.block);
        utils_class_1.Utils.hide(this.overlay);
    };
    Help.prototype.show = function () {
        utils_class_1.Utils.show(this.block);
        utils_class_1.Utils.show(this.overlay);
    };
    return Help;
}());
exports.Help = Help;
//# sourceMappingURL=help.class.js.map