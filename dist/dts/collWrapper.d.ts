/// <reference path="../bower_components/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../bower_components/DefinitelyTyped/underscore/underscore.d.ts" />
/// <reference path="../bower_components/base-event-dispatcher/dist/dts/colWrapper.d.ts" />
declare module evilduck {
    module underscore {
        class Underscore extends CollWrapper {
            map<T, U>(col: T[], func: (T: any) => U): U[];
            union<T>(col1: T[], col2: T[]): T[];
            find<T>(col: T[], pred: (T: any) => boolean): T;
            indexOf<T>(col: T[], item: T): number;
            filter<T>(col: T[], pred: (T: any) => boolean): T[];
        }
    }
}
