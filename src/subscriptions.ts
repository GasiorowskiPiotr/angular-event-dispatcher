/// <reference path="../bower_components/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../bower_components/DefinitelyTyped/underscore/underscore.d.ts"/>

module evilduck {

    export class EventDispatcher {
        
        private _innerDict: any;
        private $q: ng.IQService;

        constructor($q: ng.IQService) {
            this._innerDict = {};
            this.$q = $q;
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

            var subsInfo = (<EventSubscription>this._innerDict[event]).subscribe(handler, tag);
            subsInfo.Dispatcher = this;
            return subsInfo;
        }

        public ngOn(scope: ng.IScope, event: string, handler: () => any, tag: string = null): void {

            var subsInfo = this.on(event, handler, tag);

            scope.$on('destroy', () => {
                subsInfo.destoy();
            });
        }

        public unsubscribe(guid: string, event: string, tag: string = null) {
            if (this._innerDict[event]) {
                (<EventSubscription>this._innerDict[event]).unsubscribe(guid, tag);
                if ((<EventSubscription>this._innerDict[event]).count === 0) {
                    delete this._innerDict[event];
                }
            }
        }

        public dispatch(event: any, eventName: string, tag: string = null) : ng.IPromise<any> {

            if (this._innerDict[eventName]) {
                return (<EventSubscription>this._innerDict[eventName]).wrap(this.$q, tag);
            }
            return this.$q.when();
        }
    }

    export interface ISubscription {
        wrap($q: ng.IQService): ng.IPromise<any>;
        guid: string;
    }

    export interface IEventSubscription {
        wrap($q: ng.IQService, tagName: string): ng.IPromise<any>;
    }

    export class SubscriptionInfo {
        
        constructor(guid: string, event: string, tag: string = null) {
            this.event = event;
            this.tag = tag;
            this.isDestroyed = false;
        }

        private event: string;
        private tag: string;
        private isDestroyed: boolean;
        private dispatcher: EventDispatcher;
        private guid: string;

        public destoy(): void {
            if (!this.isDestroyed) {
                this.dispatcher.unsubscribe(this.guid, this.event, this.tag);
                this.isDestroyed = true;
            }
        }

        public get Dispatcher(): EventDispatcher {
            return this.dispatcher;
        }

        public set Dispatcher(value: EventDispatcher) {
            this.dispatcher = value;
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
            var guid = this.createGuid();
            if (tag) {
                this._tagSubs.push(TagSubscription.Basic(tag, func, guid));
                return new SubscriptionInfo(guid, this._eventName, tag);
            } else {
                this._subs.push(new BasicSubscription(func, guid));
                return new SubscriptionInfo(guid, this._eventName);
            }
        }

        public subscribePromise(func: () => ng.IPromise<any>, tag: string = null): SubscriptionInfo {
            var guid = this.createGuid();
            if (tag) {
                this._tagSubs.push(TagSubscription.Promise(tag, func, guid));
                return new SubscriptionInfo(guid, this._eventName, tag);
            } else {
                this._subs.push(new PromiseSubscription(func, guid));
                return new SubscriptionInfo(guid, this._eventName);
            }
        }

        public subscribeGeneral(func: () => any, tag: string = null): SubscriptionInfo {
            var guid = this.createGuid();
            if (tag) {
                this._tagSubs.push(TagSubscription.General(tag, func, guid));
                return new SubscriptionInfo(guid, this._eventName, tag);
            } else {
                this._subs.push(new GeneralSubscription(func, guid));
                return new SubscriptionInfo(guid, this._eventName);
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

        public unsubscribe(guid: string, tag: string = null) {
            if (tag) {
                var itemT = _.find(this._tagSubs, (s: TagSubscription) => s.tagName === tag && s.guid === guid);
                var idxT = _.indexOf(this._tagSubs, itemT);
                this._tagSubs.splice(idxT, 1);
            } else {
                var itemS = _.find(this._subs, (s: ISubscription) => s.guid === guid);
                var idxS = _.indexOf(this._subs, itemS);
                this._subs.splice(idxS, 1);
            }
        }

        public get count(): number {
            return this._subs.length + this._tagSubs.length;
        }

        private createGuid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
    }

    export class TagSubscription implements ISubscription {
        private _tagName: string;
        private _sub: ISubscription;
        private _guid: string;

        public static Basic(tagName: string, func: () => any, guid: string = null): TagSubscription {
            var s = new TagSubscription();
            s._sub = new BasicSubscription(func, guid);
            s._tagName = tagName;

            return s;
        }

        public static Promise(tagName: string, func: () => ng.IPromise<any>, guid: string = null): TagSubscription {
            var s = new TagSubscription();
            s._sub = new PromiseSubscription(func, guid);
            s._tagName = tagName;

            return s;
        }

        public static General(tagName: string, func: () => any, guid: string = null): TagSubscription {
            var s = new TagSubscription();
            s._sub = new GeneralSubscription(func, guid);
            s._tagName = tagName;

            return s;
        }

        public get tagName(): string {
            return this._tagName;
        }

        public get subscription(): ISubscription {
            return this._sub;
        }

        public get guid(): string {
            return this._guid;
        }

        public wrap($q: ng.IQService): ng.IPromise<any> {
            return this._sub.wrap($q);
        }
    }

    export class BasicSubscription implements ISubscription {

        constructor(func: () => any, guid: string = null) {
            this._func = func;
            this._guid = guid;
        }

        private _func: () => any;
        private _scope: ng.IScope;
        private _guid: string;

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

        public get guid() {
            return this._guid;
        }
    }

    export class PromiseSubscription implements ISubscription {

        private _func: () => ng.IPromise<any>;
        private _guid: string;

        constructor(func: () => ng.IPromise<any>, guid: string = null) {
            this._func = func;
            this._guid = guid;
        }

        public wrap($q: ng.IQService): ng.IPromise<any> {
            return this._func();
        }

        public get guid() {
            return this._guid;
        }

    }

    export class GeneralSubscription implements ISubscription {

        private _func: () => any;
        private _guid: string;

        constructor(func: () => any, guid: string = null) {
            this._func = func;
            this._guid = guid;
        }

        public wrap($q: ng.IQService): ng.IPromise<any> {
            return $q.when(this._func());
        }

        public get guid() {
            return this._guid;
        }
    }
}

angular.module('evilduck.eventDispatcher', []);