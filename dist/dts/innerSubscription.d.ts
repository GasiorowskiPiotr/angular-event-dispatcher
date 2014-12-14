declare module evilduck {
    class InnerSubscription implements ISubscription {
        private _func;
        private _guid;
        constructor(func: (any: any) => any, guid?: string);
        wrap($q: ng.IQService, data: any): ng.IPromise<any>;
        guid: string;
    }
}
