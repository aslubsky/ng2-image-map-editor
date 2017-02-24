import {Rectangle} from './rectangle.class';
import {Circle} from './circle.class';
import {Polygon} from './polygon.class';

export class AreaFactory {
    public static CONSTRUCTORS: any = {
        rectangle: Rectangle,
        circle: Circle,
        polygon: Polygon
    };
}