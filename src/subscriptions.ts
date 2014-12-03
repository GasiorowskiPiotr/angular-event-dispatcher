/// <reference path="../bower_components/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../bower_components/DefinitelyTyped/underscore/underscore.d.ts"/>

module evilduck {

    export interface ISubscription {
        wrap($q: ng.IQService): ng.IPromise<any>;
    }

    export class EventSubscription implements ISubscription {
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

        public subscribe(scope: ng.IScope, func: () => any, returnsPromise: boolean) {
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

        public get tagSubscriptions(): TagSubscription[]{
            return this._tagSubs;
        }

        public get subscriptions(): ISubscription[]{
            return this._subs;
        }

        public wrap($q: ng.IQService): ng.IPromise<any> {

            var promise = $q.when(this._subs[0].wrap($q));
            var i = 1;
            while (i < this._subs.length) {
                promise = promise.then(() => this._subs[i].wrap($q));
            }
            while (i < this._tagSubs.length) {
                promise = promise.then(() => this._tagSubs[i].wrap($q));
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

        public get func(): () => any {
            return this._func;
        }

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

        public get func(): () => ng.IPromise<any> {
            return this._func;
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

        public get func(): () => ng.IPromise<any> {
            return this._func;
        }

        public wrap($q: ng.IQService): ng.IPromise<any> {
            return $q.when(this._func());
        }

    }
}

angular.module('evilduck.eventDispatcher', []);