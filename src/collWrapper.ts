/// <reference path="../bower_components/DefinitelyTyped/angularjs/angular.d.ts"/> 
/// <reference path="../bower_components/DefinitelyTyped/underscore/underscore.d.ts"/>
/// <reference path="../bower_components/base-event-dispatcher/dist/dts/colWrapper.d.ts"/>

module evilduck {
    export module underscore {
        export class Underscore extends CollWrapper {
            public map<T, U>(col: Array<T>, func: (T) => U): Array<U> {
                return _.map(col, func);
            }

            public union<T>(col1: Array<T>, col2: Array<T>): Array<T> {
                return _.union(col1, col2);
            }

            public find<T>(col: Array<T>, pred: (T) => boolean): T {
                return _.find(col, pred);
            }

            public indexOf<T>(col: Array<T>, item: T): number {
                return _.indexOf(col, item);
            }

            public filter<T>(col: Array<T>, pred: (T) => boolean): Array<T> {
                return _.filter(col, pred);
            }
        }
    }
}

