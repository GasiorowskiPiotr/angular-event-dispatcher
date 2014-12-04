/// <reference path="../bower_components/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../bower_components/DefinitelyTyped/underscore/underscore.d.ts"/>

module evilduck {

    export class EventDispatcher {
        
        private _innerDict: any;

        constructor() {
            this._innerDict = {};
        }


        public on(event: string, handler: () => any, tag: string = null): SubscriptionInfo {

            if (!event) {
                throw new Error('Event name must not be empty');
            }

            if (!handler) {
                throw new Error('Handler must be defined');
            }

            if (!this._innerDict[event]) {
                this._innerDict[event] = new EventSubscription(event);
            } 

            return (<EventSubscription>this._innerDict[event]).subscribe(handler, tag);
        }

        public ngOn(scope: ng.IScope, event: string, handler: () => any, tag: string = null): void {

            var subsInfo = this.on(event, handler, tag);

            scope.$on('destroy', () => {
                subsInfo.destoy();
            });
        }

        public once(event: string, handler: () => any, tag: string = null) {
            
        }

    }

    export interface ISubscription {
        wrap($q: ng.IQService): ng.IPromise<any>;
    }

    export interface IEventSubscription {
        wrap($q: ng.IQService, tagName: string): ng.IPromise<any>;
    }

    export class SubscriptionInfo {
        
        constructor(event: string, arr: Array<ISubscription>, tag: string = null) {
            this.event = event;
            this.idx = arr.length -1;
            this.tag = tag;
            this.arr = arr;
            this.isDestroyed = false;
        }

        private event: string;
        private idx: number;
        private tag: string;
        private arr: Array<ISubscription>;
        private isDestroyed: boolean;

        public destoy(): void {
            if (!this.isDestroyed) {
                //this.arr.splice(this.idx, 1); // TODO: this needs to be refactored
                this.isDestroyed = true;
            }
        }

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

        public subscribe(func: () => any, tag: string = null): SubscriptionInfo {
            return this.subscribeGeneral(func, tag);
        }

        public subscribeBasic(func: () => void, tag: string = null): SubscriptionInfo {
            if (tag) {
                this._tagSubs.push(TagSubscription.Basic(tag, func));
                return new SubscriptionInfo(this._eventName, this._tagSubs);
            } else {
                this._subs.push(new BasicSubscription(func));
                return new SubscriptionInfo(this._eventName, this._subs);
            }
        }

        public subscribePromise(func: () => ng.IPromise<any>, tag: string = null): SubscriptionInfo {
            if (tag) {
                this._tagSubs.push(TagSubscription.Promise(tag, func));
                return new SubscriptionInfo(this._eventName, this._tagSubs, tag);
            } else {
                this._subs.push(new PromiseSubscription(func));
                return new SubscriptionInfo(this._eventName, this._subs);
            }
        }

        public subscribeGeneral(func: () => any, tag: string = null): SubscriptionInfo {
            if (tag) {
                this._tagSubs.push(TagSubscription.General(tag, func));
                return new SubscriptionInfo(this._eventName, this._tagSubs, tag);
            } else {
                this._subs.push(new GeneralSubscription(func));
                return new SubscriptionInfo(this._eventName, this._subs);
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

            var toExec = _.union(subs, tagSubs);
            if (toExec.length == 0) {
                return $q.when();
            }

            var promises = _.map(toExec, (sub: ISubscription) => {
                return sub.wrap($q);
            });

            return $q.all(promises);
        }
    }

    export class TagSubscription implements ISubscription {
        private _tagName: string;
        private _sub: ISubscription;

        public static Basic(tagName: string, func: () => any): TagSubscription {
            var s = new TagSubscription();
            s._sub = new BasicSubscription(func);
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

        constructor(func: () => any) {
            this._func = func;
        }

        private _func: () => any;
        private _scope: ng.IScope;

        public wrap($q: ng.IQService): ng.IPromise<any> {
            var deferral = $q.defer();

            try {
                var res = this._func();
                deferral.resolve(res);
            } catch (err) {
                deferral.reject(err);
            }

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