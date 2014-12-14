/// <reference path="../bower_components/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../bower_components/base-event-dispatcher/dist/dts/colWrapper.d.ts" />
/// <reference path="../bower_components/base-event-dispatcher/dist/dts/promiseWrapper.d.ts" />
/// <reference path="../bower_components/base-event-dispatcher/dist/dts/qWrapper.d.ts" />
declare module evilduck {
    module angular {
        class QService extends QWrapper {
            private $q;
            private coll;
            constructor($q: ng.IQService, coll: CollWrapper);
            when<T>(a?: any): PromiseWrapper<T>;
            all<T>(promises: PromiseWrapper<any>[]): PromiseWrapper<T>;
        }
        class QPromise<T> extends PromiseWrapper<T> {
            private promise;
            constructor(promise: ng.IPromise<T>);
            innerPromise: ng.IPromise<T>;
            then(func: (T: any) => any): QPromise<any>;
            catch(func: (T: any) => any): QPromise<any>;
            finally(func: () => any): QPromise<any>;
        }
    }
}
