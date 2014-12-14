/// <reference path="../bower_components/DefinitelyTyped/angularjs/angular.d.ts"/> 
/// <reference path="../bower_components/base-event-dispatcher/dist/dts/colWrapper.d.ts"/>
/// <reference path="../bower_components/base-event-dispatcher/dist/dts/promiseWrapper.d.ts"/>
/// <reference path="../bower_components/base-event-dispatcher/dist/dts/qWrapper.d.ts"/>

module evilduck {
    export module angular {
        export class QService extends QWrapper {

            private $q: ng.IQService;
            private coll: CollWrapper;

            constructor($q: ng.IQService, coll: CollWrapper) {
                super();

                this.$q = $q;
                this.coll = coll;
            }

            public when<T>(a: any = null): PromiseWrapper<T> {
                if (a) {
                    return new QPromise<T>(this.$q.when(a));
                } else {
                    return new QPromise(this.$q.when());
                }
            }

            public all<T>(promises: PromiseWrapper<any>[]): PromiseWrapper<T> {
                return new QPromise(
                    this.$q.all(
                        this.coll.map(promises, (p: QPromise<any>) => p.innerPromise)));
            }
        }

        export class QPromise<T> extends PromiseWrapper<T> {

            private promise: ng.IPromise<T>;

            constructor(promise: ng.IPromise<T>) {
                super();
                this.promise = promise;
            }

            public get innerPromise() {
                return this.promise;
            }

            public then(func: (T) => any): QPromise<any> {
                return new QPromise(this.promise.then(r => func(r)));

            }

            public catch(func: (T) => any): QPromise<any> {
                return new QPromise(this.promise.catch(r => func(r)));
            }

            public finally(func: () => any): QPromise<any> {
                return new QPromise(this.promise.finally(() => func()));
            }
        }
    }
} 