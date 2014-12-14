declare module evilduck {
    interface IEventDispatcher {
        on(event: string, handler: (any: any) => any, tag: string): SubscriptionInfo;
        ngOn(scope: ng.IScope, event: string, handler: (any: any) => any, tag: string): void;
        unsubscribe(guid: string, event: string, tag: string): any;
        dispatch(data: any, eventName: string, tag: string): ng.IPromise<any>;
    }
    class EventDispatcher implements IEventDispatcher {
        private _innerDict;
        private $q;
        constructor($q: ng.IQService);
        on(event: string, handler: (any: any) => any, tag?: string): SubscriptionInfo;
        ngOn(scope: ng.IScope, event: string, handler: (any: any) => any, tag?: string): void;
        unsubscribe(guid: string, event: string, tag?: string): void;
        dispatch(data: any, eventName: string, tag?: string): ng.IPromise<any>;
    }
    interface ISubscription {
        wrap($q: ng.IQService, data: any): ng.IPromise<any>;
        guid: string;
    }
    interface IEventSubscription {
        wrap($q: ng.IQService, data: any, tagName: string): ng.IPromise<any>;
    }
    class SubscriptionInfo {
        constructor(guid: string, event: string, tag?: string);
        private event;
        private tag;
        private isDestroyed;
        private dispatcher;
        private guid;
        destroy(): void;
        Dispatcher: EventDispatcher;
    }
}
