declare module evilduck {
    class EventSubscription implements IEventSubscription {
        private _eventName;
        private _tagSubs;
        private _subs;
        constructor(eventName: string);
        eventName: string;
        subscribe(func: (any: any) => any, tag?: string): SubscriptionInfo;
        private subscribeGeneral(func, tag?);
        wrap($q: ng.IQService, data: any, tagName?: string): ng.IPromise<any>;
        unsubscribe(guid: string, tag?: string): void;
        count: number;
        private createGuid();
    }
}
