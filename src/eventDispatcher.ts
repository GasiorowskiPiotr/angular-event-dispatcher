module evilduck {

    export interface IEventDispatcher {
        on(event: string, handler: (any) => any, tag: string): SubscriptionInfo;
        ngOn(scope: ng.IScope, event: string, handler: (any) => any, tag: string): void;
        unsubscribe(guid: string, event: string, tag: string);
        dispatch(data: any, eventName: string, tag: string): ng.IPromise<any>;
    }

    export class EventDispatcher implements IEventDispatcher {

        private _innerDict: any;
        private $q: ng.IQService;

        constructor($q: ng.IQService) {
            this._innerDict = {};
            this.$q = $q;
        }


        public on(event: string, handler: (any) => any, tag: string = null): SubscriptionInfo {

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

        public ngOn(scope: ng.IScope, event: string, handler: (any) => any, tag: string = null): void {

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

        public dispatch(data: any, eventName: string, tag: string = null): ng.IPromise<any> {

            if (this._innerDict[eventName]) {
                return (<EventSubscription>this._innerDict[eventName]).wrap(this.$q, data, tag);
            }
            return this.$q.when();
        }
    }

    export interface ISubscription {
        wrap($q: ng.IQService, data: any): ng.IPromise<any>;
        guid: string;
    }

    export interface IEventSubscription {
        wrap($q: ng.IQService, data: any, tagName: string): ng.IPromise<any>;
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
} 