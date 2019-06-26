"use strict";
var Utils = (function () {
    function Utils() {
    }
    Utils.getOffset = function (node) {
        var boxCoords = node.getBoundingClientRect();
        return {
            x: Math.round(boxCoords.left + window.pageXOffset),
            y: Math.round(boxCoords.top + window.pageYOffset)
        };
    };
    Utils.getRightCoords = function (x, y) {
        return {
            x: x - Utils.app.getOffset('x'),
            y: y - Utils.app.getOffset('y')
        };
    };
    Utils.id = function (str) {
        return document.getElementById(str);
    };
    Utils.hide = function (node) {
        node.style.display = 'none';
        return this;
    };
    Utils.show = function (node) {
        node.style.display = 'block';
        return this;
    };
    Utils.encode = function (str) {
        return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };
    Utils.foreach = function (arr, func) {
        for (var i = 0, count = arr.length; i < count; i++) {
            func(arr[i], i);
        }
    };
    Utils.foreachReverse = function (arr, func) {
        for (var i = arr.length - 1; i >= 0; i--) {
            func(arr[i], i);
        }
    };
    Utils.stopEvent = function (e) {
        e.stopPropagation();
        e.preventDefault();
        return this;
    };
    return Utils;
}());
exports.Utils = Utils;
//# sourceMappingURL=utils.class.js.map