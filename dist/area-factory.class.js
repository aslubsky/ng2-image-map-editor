"use strict";
var rectangle_class_1 = require('./rectangle.class');
var circle_class_1 = require('./circle.class');
var polygon_class_1 = require('./polygon.class');
var AreaFactory = (function () {
    function AreaFactory() {
    }
    AreaFactory.CONSTRUCTORS = {
        rectangle: rectangle_class_1.Rectangle,
        circle: circle_class_1.Circle,
        polygon: polygon_class_1.Polygon
    };
    return AreaFactory;
}());
exports.AreaFactory = AreaFactory;
//# sourceMappingURL=area-factory.class.js.map