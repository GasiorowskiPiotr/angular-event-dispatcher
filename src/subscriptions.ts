/// <reference path="../bower_components/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../bower_components/DefinitelyTyped/underscore/underscore.d.ts"/>

module evilduck {

    export interface ISubscription {
        wrap($q: ng.IQService): ng.IPromise<any>;
    }

    export interface IEventSubscription {
        wrap($q: ng.IQService, tagName: string): ng.IPromise<any>;
    }

    export class EventSubscription implements IEventSubscription {
        private _eventName: string;
        private _tagSubs: TagSubscription[];
        private _subs: ISubscription[];

        constructor(eventName: string) {
            this._eventName = eventName;
            this._tagSubs = new Array<TagSubscription>();
            this._subs = new Array<ISubscription>();
        }

        public get eventName():string {
            return this._eventName;
        }

        public subscribe(func: () => any, tag: string = null): void {
            this.subscribeGeneral(func, tag);
        }

        public subscribeBasic(scope: ng.IScope, func: () => void, tag: string = null): void {
            if (tag) {
                this._tagSubs.push(TagSubscription.Basic(tag, func, scope));
            } else {
                this._subs.push(new BasicSubscription(func, scope));
            }
        }

        public subscribePromise(func: () => ng.IPromise<any>, tag: string = null): void {
            if (tag) {
                this._tagSubs.push(TagSubscription.Promise(tag, func));
            } else {
                this._subs.push(new PromiseSubscription(func));
            }
        }

        public subscribeGeneral(func: () => any, tag: string = null): void {
            if (tag) {
                this._tagSubs.push(TagSubscription.General(tag, func));
            } else {
                this._subs.push(new GeneralSubscription(func));
            }
        }

        public wrap($q: ng.IQService, tagName: string = null): ng.IPromise<any> {

            var subs: ISubscription[];
            var tagSubs: TagSubscription[];

            if (tagName) {
                subs = new Array<ISubscription>();
                // TODO: Cache it
                tagSubs = _.filter(this._tagSubs, (ts: TagSubscription) => ts.tagName === tagName);
            } else {
                subs = this._subs;
                tagSubs = this._tagSubs;
            }

            var promise = $q.when(subs[0].wrap($q));
            var i = 1;
            while (i < subs.length) {
                promise = promise.then(() => subs[i].wrap($q));
            }
            while (i < tagSubs.length) {
                promise = promise.then(() => tagSubs[i].wrap($q));
            }

            return promise;
        }
    }

    export class TagSubscription implements ISubscription {
        private _tagName: string;
        private _sub: ISubscription;

        public static Basic(tagName: string, func: () => any, scope: ng.IScope): TagSubscription {
            var s = new TagSubscription();
            s._sub = new BasicSubscription(func, scope);
            s._tagName = tagName;

            return s;
        }

        public static Promise(tagName: string, func: () => ng.IPromise<any>): TagSubscription {
            var s = new TagSubscription();
            s._sub = new PromiseSubscription(func);
            s._tagName = tagName;

            return s;
        }

        public static General(tagName: string, func: () => any): TagSubscription {
            var s = new TagSubscription();
            s._sub = new GeneralSubscription(func);
            s._tagName = tagName;

            return s;
        }

        public get tagName(): string {
            return this._tagName;
        }

        public get subscription(): ISubscription {
            return this._sub;
        }

        public wrap($q: ng.IQService): ng.IPromise<any> {
            return this._sub.wrap($q);
        }
    }

    export class BasicSubscription implements ISubscription {

        constructor(func: () => any, $scope: ng.IScope) {
            this._func = func;
            this._scope = $scope;
        }

        private _func: () => any;
        private _scope: ng.IScope;

        public wrap($q: ng.IQService): ng.IPromise<any> {
            var deferral = $q.defer();

            setTimeout(() => {
                this._scope.$apply(() => {
                    try {
                        var res = this._func();
                        return deferral.resolve(res);
                    } catch (err) {
                        return deferral.reject(err);
                    }
                });
            }, 1);

            return deferral.promise;
        }
    }

    export class PromiseSubscription implements ISubscription {

        private _func: () => ng.IPromise<any>;

        constructor(func: () => ng.IPromise<any>) {
            this._func = func;
        }

        public wrap($q: ng.IQService): ng.IPromise<any> {
            return this._func();
        }

    }

    export class GeneralSubscription implements ISubscription {

        private _func: () => any;

        constructor(func: () => any) {
            this._func = func;
        }

        public wrap($q: ng.IQService): ng.IPromise<any> {
            return $q.when(this._func());
        }

    }
}

angular.module('evilduck.eventDispatcher', []);